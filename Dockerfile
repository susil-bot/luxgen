# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S luxgen -u 1001 -G nginx

# Set permissions
RUN chown -R luxgen:nginx /usr/share/nginx/html && \
    chown -R luxgen:nginx /var/cache/nginx && \
    chown -R luxgen:nginx /var/log/nginx && \
    chown -R luxgen:nginx /etc/nginx/conf.d

# Switch to non-root user
USER luxgen

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
