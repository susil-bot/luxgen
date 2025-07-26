import { 
  GlobalObject, 
  SharedResource, 
  AccessControl, 
  TenantId,
  TenantFilter
} from '../types/multiTenancy';

// Global Objects Service for Multi-Tenancy
export class GlobalObjectsService {
  private static instance: GlobalObjectsService;
  private globalObjects: Map<string, GlobalObject> = new Map();
  private sharedResources: Map<string, SharedResource> = new Map();

  private constructor() {
    this.initializeDefaultObjects();
  }

  static getInstance(): GlobalObjectsService {
    if (!GlobalObjectsService.instance) {
      GlobalObjectsService.instance = new GlobalObjectsService();
    }
    return GlobalObjectsService.instance;
  }

  // Initialize default global objects
  private initializeDefaultObjects(): void {
    // Default training templates
    const trainingTemplates: GlobalObject[] = [
      {
        id: 'template_leadership_101',
        type: 'template',
        name: 'Leadership Fundamentals',
        description: 'Basic leadership training template for new managers',
        category: 'leadership',
        tags: ['leadership', 'management', 'beginner'],
        data: {
          modules: [
            { title: 'Introduction to Leadership', duration: 60 },
            { title: 'Communication Skills', duration: 90 },
            { title: 'Team Building', duration: 120 }
          ],
          assessments: [
            { title: 'Leadership Assessment', questions: 20 }
          ]
        },
        metadata: {
          difficulty: 'beginner',
          targetAudience: 'new_managers',
          estimatedDuration: 270
        },
        isPublic: true,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      },
      {
        id: 'template_advanced_leadership',
        type: 'template',
        name: 'Advanced Leadership Strategies',
        description: 'Advanced leadership training for experienced managers',
        category: 'leadership',
        tags: ['leadership', 'advanced', 'strategy'],
        data: {
          modules: [
            { title: 'Strategic Thinking', duration: 120 },
            { title: 'Change Management', duration: 150 },
            { title: 'Conflict Resolution', duration: 90 }
          ],
          assessments: [
            { title: 'Strategic Leadership Assessment', questions: 25 }
          ]
        },
        metadata: {
          difficulty: 'advanced',
          targetAudience: 'experienced_managers',
          estimatedDuration: 360
        },
        isPublic: true,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      }
    ];

    // Default presentation templates
    const presentationTemplates: GlobalObject[] = [
      {
        id: 'template_presentation_basic',
        type: 'template',
        name: 'Basic Presentation Template',
        description: 'Standard presentation template with polling support',
        category: 'presentation',
        tags: ['presentation', 'basic', 'polling'],
        data: {
          slides: [
            { title: 'Introduction', type: 'title', duration: 30 },
            { title: 'Key Points', type: 'content', duration: 120 },
            { title: 'Interactive Poll', type: 'poll', duration: 60 },
            { title: 'Summary', type: 'summary', duration: 30 }
          ],
          polls: [
            { question: 'How would you rate this session?', type: 'rating', options: ['1', '2', '3', '4', '5'] }
          ]
        },
        metadata: {
          estimatedDuration: 240,
          supportsPolling: true,
          supportsQR: true
        },
        isPublic: true,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      }
    ];

    // Default workflow templates
    const workflowTemplates: GlobalObject[] = [
      {
        id: 'workflow_onboarding',
        type: 'workflow',
        name: 'New Employee Onboarding',
        description: 'Standard onboarding workflow for new employees',
        category: 'onboarding',
        tags: ['onboarding', 'employee', 'workflow'],
        data: {
          steps: [
            { name: 'Welcome Email', type: 'email', trigger: 'immediate' },
            { name: 'Profile Setup', type: 'task', trigger: 'manual' },
            { name: 'Training Assignment', type: 'assignment', trigger: 'profile_complete' },
            { name: 'Mentor Assignment', type: 'assignment', trigger: 'training_started' },
            { name: 'First Review', type: 'review', trigger: 'training_completed' }
          ],
          notifications: [
            { type: 'email', template: 'welcome_email', recipients: ['new_employee'] },
            { type: 'slack', template: 'team_notification', recipients: ['team_members'] }
          ]
        },
        metadata: {
          estimatedDuration: 30,
          requiredRoles: ['hr', 'manager'],
          autoAssign: true
        },
        isPublic: true,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      }
    ];

    // Add all default objects
    [...trainingTemplates, ...presentationTemplates, ...workflowTemplates].forEach(obj => {
      this.globalObjects.set(obj.id, obj);
    });
  }

  // Global Objects Management
  getGlobalObjects(filters?: {
    type?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
    isSystem?: boolean;
  }): GlobalObject[] {
    let objects = Array.from(this.globalObjects.values());

    if (filters) {
      if (filters.type) {
        objects = objects.filter(obj => obj.type === filters.type);
      }
      if (filters.category) {
        objects = objects.filter(obj => obj.category === filters.category);
      }
      if (filters.tags) {
        objects = objects.filter(obj => 
          filters.tags!.some(tag => obj.tags.includes(tag))
        );
      }
      if (filters.isPublic !== undefined) {
        objects = objects.filter(obj => obj.isPublic === filters.isPublic);
      }
      if (filters.isSystem !== undefined) {
        objects = objects.filter(obj => obj.isSystem === filters.isSystem);
      }
    }

    return objects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getGlobalObject(id: string): GlobalObject | null {
    return this.globalObjects.get(id) || null;
  }

  createGlobalObject(
    object: Omit<GlobalObject, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
    tenantId: string
  ): GlobalObject {
    const newObject: GlobalObject = {
      ...object,
      id: `global_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0'
    };

    this.globalObjects.set(newObject.id, newObject);
    return newObject;
  }

  updateGlobalObject(id: string, updates: Partial<GlobalObject>): GlobalObject | null {
    const object = this.globalObjects.get(id);
    if (!object) return null;

    const updatedObject: GlobalObject = {
      ...object,
      ...updates,
      updatedAt: new Date(),
      version: this.incrementVersion(object.version)
    };

    this.globalObjects.set(id, updatedObject);
    return updatedObject;
  }

  deleteGlobalObject(id: string): boolean {
    const object = this.globalObjects.get(id);
    if (!object || object.isSystem) return false;

    return this.globalObjects.delete(id);
  }

  // Shared Resources Management
  getSharedResources(filters?: {
    type?: string;
    isPublic?: boolean;
  }): SharedResource[] {
    let resources = Array.from(this.sharedResources.values());

    if (filters) {
      if (filters.type) {
        resources = resources.filter(resource => resource.type === filters.type);
      }
      if (filters.isPublic !== undefined) {
        resources = resources.filter(resource => resource.isPublic === filters.isPublic);
      }
    }

    return resources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getSharedResource(id: string): SharedResource | null {
    return this.sharedResources.get(id) || null;
  }

  createSharedResource(
    resource: Omit<SharedResource, 'id' | 'createdAt' | 'updatedAt'>,
    tenantId: string
  ): SharedResource {
    const newResource: SharedResource = {
      ...resource,
      id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sharedResources.set(newResource.id, newResource);
    return newResource;
  }

  updateSharedResource(id: string, updates: Partial<SharedResource>): SharedResource | null {
    const resource = this.sharedResources.get(id);
    if (!resource) return null;

    const updatedResource: SharedResource = {
      ...resource,
      ...updates,
      updatedAt: new Date()
    };

    this.sharedResources.set(id, updatedResource);
    return updatedResource;
  }

  deleteSharedResource(id: string): boolean {
    return this.sharedResources.delete(id);
  }

  // Access Control Management
  checkResourceAccess(
    resourceId: string, 
    tenantId: string, 
    userId: string, 
    action: 'read' | 'write' | 'delete' | 'admin'
  ): boolean {
    const resource = this.sharedResources.get(resourceId);
    if (!resource) return false;

    // Check if resource is public
    if (resource.isPublic && action === 'read') return true;

    // Check access control list
    for (const accessControl of resource.accessControl) {
      if (accessControl.type === 'tenant' && accessControl.id === tenantId) {
        if (accessControl.permissions.includes(action)) return true;
      }
      if (accessControl.type === 'public' && action === 'read') return true;
    }

    return false;
  }

  grantResourceAccess(
    resourceId: string,
    accessControl: AccessControl
  ): boolean {
    const resource = this.sharedResources.get(resourceId);
    if (!resource) return false;

    resource.accessControl.push(accessControl);
    resource.updatedAt = new Date();
    return true;
  }

  revokeResourceAccess(
    resourceId: string,
    accessControlType: string,
    accessControlId?: string
  ): boolean {
    const resource = this.sharedResources.get(resourceId);
    if (!resource) return false;

    const initialLength = resource.accessControl.length;
    resource.accessControl = resource.accessControl.filter(ac => 
      !(ac.type === accessControlType && (!accessControlId || ac.id === accessControlId))
    );

    if (resource.accessControl.length !== initialLength) {
      resource.updatedAt = new Date();
      return true;
    }

    return false;
  }

  // Template Management
  getTemplates(category?: string): GlobalObject[] {
    return this.getGlobalObjects({
      type: 'template',
      category,
      isPublic: true
    });
  }

  cloneTemplate(templateId: string, tenantId: string, customizations?: Record<string, any>): GlobalObject | null {
    const template = this.getGlobalObject(templateId);
    if (!template || template.type !== 'template') return null;

    const clonedTemplate: GlobalObject = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${template.name} (Copy)`,
      isPublic: false,
      isSystem: false,
      createdBy: tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
      data: {
        ...template.data,
        ...customizations
      }
    };

    this.globalObjects.set(clonedTemplate.id, clonedTemplate);
    return clonedTemplate;
  }

  // Workflow Management
  getWorkflows(): GlobalObject[] {
    return this.getGlobalObjects({
      type: 'workflow',
      isPublic: true
    });
  }

  executeWorkflow(workflowId: string, tenantId: string, context: Record<string, any>): boolean {
    const workflow = this.getGlobalObject(workflowId);
    if (!workflow || workflow.type !== 'workflow') return false;

    // Simulate workflow execution
    console.log(`Executing workflow ${workflow.name} for tenant ${tenantId}`, context);
    
    // In a real implementation, this would:
    // 1. Parse the workflow steps
    // 2. Execute each step based on triggers
    // 3. Send notifications
    // 4. Update progress
    // 5. Handle errors and rollbacks

    return true;
  }

  // Version Management
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2]) + 1;
    return `${major}.${minor}.${patch}`;
  }

  // Search and Discovery
  searchGlobalObjects(query: string, filters?: {
    type?: string;
    category?: string;
    tags?: string[];
  }): GlobalObject[] {
    const objects = this.getGlobalObjects(filters);
    
    return objects.filter(obj => 
      obj.name.toLowerCase().includes(query.toLowerCase()) ||
      obj.description.toLowerCase().includes(query.toLowerCase()) ||
      obj.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Analytics and Usage Tracking
  getObjectUsageStats(objectId: string): {
    totalUses: number;
    uniqueTenants: number;
    averageRating: number;
    lastUsed: Date | null;
  } {
    // This would typically fetch from a usage tracking database
    // For now, return mock data
    return {
      totalUses: Math.floor(Math.random() * 1000),
      uniqueTenants: Math.floor(Math.random() * 50),
      averageRating: 4.2 + Math.random() * 0.8,
      lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    };
  }

  // Export and Import
  exportGlobalObject(objectId: string): string {
    const object = this.getGlobalObject(objectId);
    if (!object) throw new Error('Object not found');

    return JSON.stringify(object, null, 2);
  }

  importGlobalObject(jsonData: string, tenantId: string): GlobalObject {
    try {
      const objectData = JSON.parse(jsonData);
      const { id, createdAt, updatedAt, version, ...importData } = objectData;
      
      return this.createGlobalObject(importData, tenantId);
    } catch (error) {
      throw new Error('Invalid JSON data for import');
    }
  }
}

// Export singleton instance
export const globalObjectsService = GlobalObjectsService.getInstance(); 