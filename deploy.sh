#!/bin/bash

# Trainer Platform Deployment Script
# This script handles production deployment with comprehensive checks and rollback capabilities

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="trainer-platform"
BACKUP_DIR="${SCRIPT_DIR}/backups"
LOG_DIR="${SCRIPT_DIR}/logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_LOG="${LOG_DIR}/deploy_${TIMESTAMP}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$DEPLOY_LOG"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$DEPLOY_LOG"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$DEPLOY_LOG"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$DEPLOY_LOG"
}

# Create necessary directories
mkdir -p "$BACKUP_DIR" "$LOG_DIR"

# Function to check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker is not running"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if .env file exists
    if [[ ! -f "${SCRIPT_DIR}/.env" ]]; then
        error ".env file not found. Please create it from env.example"
        exit 1
    fi
    
    # Check disk space
    DISK_SPACE=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [[ $DISK_SPACE -lt 10 ]]; then
        error "Insufficient disk space. Need at least 10GB, available: ${DISK_SPACE}GB"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Function to backup current deployment
backup_current_deployment() {
    log "Creating backup of current deployment..."
    
    BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"
    
    # Create backup of current state
    tar -czf "$BACKUP_FILE" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='backups' \
        --exclude='logs' \
        --exclude='uploads' \
        .
    
    if [[ $? -eq 0 ]]; then
        success "Backup created: $BACKUP_FILE"
    else
        error "Backup failed"
        exit 1
    fi
}

# Function to check system health
check_system_health() {
    log "Checking system health..."
    
    # Check CPU usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
        warning "High CPU usage: ${CPU_USAGE}%"
    fi
    
    # Check memory usage
    MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
        warning "High memory usage: ${MEMORY_USAGE}%"
    fi
    
    # Check disk usage
    DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $DISK_USAGE -gt 80 ]]; then
        warning "High disk usage: ${DISK_USAGE}%"
    fi
    
    success "System health check completed"
}

# Function to stop current services
stop_current_services() {
    log "Stopping current services..."
    
    if docker-compose ps | grep -q "Up"; then
        docker-compose down --timeout 30
        success "Current services stopped"
    else
        log "No running services found"
    fi
}

# Function to pull latest changes
pull_latest_changes() {
    log "Pulling latest changes from repository..."
    
    if [[ -d ".git" ]]; then
        git fetch origin
        git reset --hard origin/main
        success "Latest changes pulled"
    else
        warning "Not a git repository, skipping git operations"
    fi
}

# Function to build and start services
deploy_services() {
    log "Building and starting services..."
    
    # Build images
    log "Building Docker images..."
    docker-compose build --no-cache
    
    # Start services
    log "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    success "Services deployed successfully"
}

# Function to run health checks
run_health_checks() {
    log "Running health checks..."
    
    # Check if all containers are running
    if ! docker-compose ps | grep -q "Up"; then
        error "Not all services are running"
        docker-compose ps
        return 1
    fi
    
    # Check backend health
    BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health || echo "000")
    if [[ $BACKEND_HEALTH != "200" ]]; then
        error "Backend health check failed: HTTP $BACKEND_HEALTH"
        return 1
    fi
    
    # Check database connections
    DB_STATUS=$(curl -s http://localhost:3001/api/database/status | jq -r '.success' 2>/dev/null || echo "false")
    if [[ $DB_STATUS != "true" ]]; then
        error "Database status check failed"
        return 1
    fi
    
    # Check frontend (if nginx is running)
    if docker-compose ps | grep -q "nginx.*Up"; then
        FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 || echo "000")
        if [[ $FRONTEND_HEALTH != "200" ]]; then
            warning "Frontend health check failed: HTTP $FRONTEND_HEALTH"
        fi
    fi
    
    success "Health checks passed"
}

# Function to run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    log "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations through the backend
    MIGRATION_RESULT=$(curl -s http://localhost:3001/api/database/status | jq -r '.success' 2>/dev/null || echo "false")
    if [[ $MIGRATION_RESULT != "true" ]]; then
        error "Database migration check failed"
        return 1
    fi
    
    success "Database migrations completed"
}

# Function to perform post-deployment tasks
post_deployment_tasks() {
    log "Performing post-deployment tasks..."
    
    # Clear old backups (keep last 5)
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f | sort -r | tail -n +6 | xargs -r rm
    
    # Clear old logs (keep last 10)
    find "$LOG_DIR" -name "deploy_*.log" -type f | sort -r | tail -n +11 | xargs -r rm
    
    # Set proper permissions
    chmod 755 "$SCRIPT_DIR"
    chmod 644 "$SCRIPT_DIR/.env"
    
    success "Post-deployment tasks completed"
}

# Function to rollback deployment
rollback_deployment() {
    error "Deployment failed, initiating rollback..."
    
    # Stop current services
    docker-compose down --timeout 30
    
    # Find the most recent backup
    LATEST_BACKUP=$(find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f | sort -r | head -n 1)
    
    if [[ -n "$LATEST_BACKUP" ]]; then
        log "Restoring from backup: $LATEST_BACKUP"
        
        # Extract backup
        tar -xzf "$LATEST_BACKUP"
        
        # Restart services
        docker-compose up -d
        
        success "Rollback completed successfully"
    else
        error "No backup found for rollback"
        exit 1
    fi
}

# Function to display deployment summary
display_summary() {
    log "=== Deployment Summary ==="
    log "Timestamp: $TIMESTAMP"
    log "Project: $PROJECT_NAME"
    log "Backup: ${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"
    log "Log: $DEPLOY_LOG"
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo "Services:"
    docker-compose ps
    echo ""
    echo "Health Check: http://localhost:3001/health"
    echo "API Status: http://localhost:3001/api/database/status"
    echo ""
    echo "Logs:"
    echo "  Application: docker-compose logs -f backend"
    echo "  Database: docker-compose logs -f postgres"
    echo "  All: docker-compose logs -f"
}

# Main deployment function
main() {
    log "Starting deployment of $PROJECT_NAME"
    log "Deployment log: $DEPLOY_LOG"
    
    # Trap to handle errors and rollback
    trap 'rollback_deployment' ERR
    
    # Run deployment steps
    check_prerequisites
    check_system_health
    backup_current_deployment
    stop_current_services
    pull_latest_changes
    deploy_services
    run_migrations
    run_health_checks
    post_deployment_tasks
    
    # Remove error trap
    trap - ERR
    
    # Display summary
    display_summary
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -f, --force    Force deployment without confirmation"
    echo "  -r, --rollback Rollback to previous deployment"
    echo "  -c, --check    Only run health checks"
    echo ""
    echo "Examples:"
    echo "  $0              # Interactive deployment"
    echo "  $0 --force      # Force deployment"
    echo "  $0 --rollback   # Rollback to previous version"
    echo "  $0 --check      # Run health checks only"
}

# Function to run health checks only
run_health_checks_only() {
    log "Running health checks only..."
    
    if [[ ! -f "docker-compose.yml" ]]; then
        error "docker-compose.yml not found"
        exit 1
    fi
    
    run_health_checks
    display_summary
}

# Function to perform rollback
perform_rollback() {
    log "Performing rollback..."
    
    # Find the most recent backup
    LATEST_BACKUP=$(find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f | sort -r | head -n 1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        error "No backup found for rollback"
        exit 1
    fi
    
    log "Rolling back to: $LATEST_BACKUP"
    
    # Stop current services
    stop_current_services
    
    # Extract backup
    tar -xzf "$LATEST_BACKUP"
    
    # Restart services
    deploy_services
    run_health_checks
    
    success "Rollback completed successfully"
    display_summary
}

# Parse command line arguments
FORCE=false
ROLLBACK=false
HEALTH_CHECK_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -r|--rollback)
            ROLLBACK=true
            shift
            ;;
        -c|--check)
            HEALTH_CHECK_ONLY=true
            shift
            ;;
        *)
            error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Change to script directory
cd "$SCRIPT_DIR"

# Handle different modes
if [[ "$HEALTH_CHECK_ONLY" == "true" ]]; then
    run_health_checks_only
elif [[ "$ROLLBACK" == "true" ]]; then
    perform_rollback
else
    # Interactive deployment
    if [[ "$FORCE" != "true" ]]; then
        echo -e "${YELLOW}⚠️  This will deploy the Trainer Platform to production.${NC}"
        echo -e "${YELLOW}⚠️  Make sure you have backed up any important data.${NC}"
        echo ""
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Run main deployment
    main
fi 