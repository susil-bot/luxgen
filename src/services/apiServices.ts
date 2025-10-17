/**
 * TEMPORARY API SERVICES
 * This file provides backward compatibility while migrating to the new architecture
 */

import { apiServices as newApiServices } from '../core/api/ApiService';

// Export the new API services for backward compatibility
export default newApiServices;
export { apiServices } from '../core/api/ApiService';
