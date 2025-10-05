/**
 * LUXGEN FRONTEND WORKFLOW MANAGER
 * Manages workflow execution and coordination
 */

import { Workflow, WorkflowContext, WorkflowResult, WorkflowError } from './types';

class WorkflowManagerImpl {
  private workflows: Map<string, Workflow> = new Map();

  /**
   * Register a workflow
   */
  register(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
    // Workflow registered successfully
  }

  /**
   * Execute a workflow
   */
  async execute<T>(workflowId: string, context: WorkflowContext): Promise<WorkflowResult<T>> {
    const workflow = this.workflows.get(workflowId);
    
    if (!workflow) {
      return {
        success: false,
        message: `Workflow not found: ${workflowId}`,
        errors: [{
          code: 'WORKFLOW_NOT_FOUND',
          message: `Workflow with ID '${workflowId}' is not registered`
        }],
        statusCode: 404
      };
    }

    try {
      const result = await workflow.execute(context);
      return result;
    } catch (error) {
      console.error(`❌ Workflow failed: ${workflowId}`, error);
      return {
        success: false,
        message: `Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [{
          code: 'WORKFLOW_EXECUTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { workflowId, context }
        }],
        statusCode: 500
      };
    }
  }

  /**
   * Get a specific workflow
   */
  getWorkflow(workflowId: string): Workflow | null {
    return this.workflows.get(workflowId) || null;
  }

  /**
   * Get all registered workflows
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Check if a workflow is registered
   */
  hasWorkflow(workflowId: string): boolean {
    return this.workflows.has(workflowId);
  }

  /**
   * Unregister a workflow
   */
  unregister(workflowId: string): boolean {
    return this.workflows.delete(workflowId);
  }

  /**
   * Clear all workflows
   */
  clear(): void {
    this.workflows.clear();
  }

  /**
   * Get workflow statistics
   */
  getStats(): {
    total: number;
    registered: string[];
  } {
    return {
      total: this.workflows.size,
      registered: Array.from(this.workflows.keys())
    };
  }
}

// Singleton instance
export const workflowManager = new WorkflowManagerImpl();

// Export the class for testing
export { WorkflowManagerImpl };
