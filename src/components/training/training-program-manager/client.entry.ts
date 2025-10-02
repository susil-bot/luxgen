/**
 * Training Program Manager - Client Entry Point
 * Main entry point for client-side functionality
 */

import TrainingProgramManager from './index';
import { TrainingProgramManagerHelper } from './helpers';
import { TrainingProgramManagerFetcher } from './fetchers';
import { TrainingProgramManagerTransformer } from './transformers';

// Export main component and utilities
export {
  TrainingProgramManager,
  TrainingProgramManagerHelper,
  TrainingProgramManagerFetcher,
  TrainingProgramManagerTransformer
};

// Export types
export type {
  TrainingProgram,
  TrainingProgramFormData,
  TrainingProgramFilters,
  TrainingProgramStats
} from './types';

// Export constants
export {
  PROGRAM_STATUSES,
  PROGRAM_TYPES,
  DIFFICULTY_LEVELS,
  DEFAULT_FILTERS
} from './constants';
