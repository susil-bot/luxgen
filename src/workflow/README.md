# LuxGen Frontend Workflow System

A comprehensive workflow system for managing global state, tenant configuration, user context, and data flow coordination in the LuxGen React application.

## 🎯 Purpose

This workflow system provides:
- **Global State Management** across all components
- **Tenant Configuration** handling and sharing
- **User Context** and authentication state management
- **Data Flow Coordination** between components
- **Workflow-based Architecture** for complex operations

## 🏗️ Architecture

### Core Components

1. **WorkflowManager** - Central workflow orchestration
2. **WorkflowProvider** - React context provider
3. **Custom Hooks** - Specialized hooks for different workflows
4. **Workflow Types** - TypeScript interfaces and types

### Workflows

1. **AuthWorkflow** - Authentication and user management
2. **TenantWorkflow** - Tenant configuration and switching
3. **DataFlowWorkflow** - Data synchronization between components

## 🚀 Usage

### 1. Setup the WorkflowProvider

```tsx
import { WorkflowProvider } from './workflow';

function App() {
  return (
    <WorkflowProvider>
      <YourAppComponents />
    </WorkflowProvider>
  );
}
```

### 2. Use Authentication Hook

```tsx
import { useAuth } from './workflow';

function LoginComponent() {
  const { login, loading, error, isAuthenticated, user } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password, 'luxgen');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.firstName}!</div>;
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  );
}
```

### 3. Use Tenant Management Hook

```tsx
import { useTenant } from './workflow';

function TenantSelector() {
  const { 
    currentTenant, 
    availableTenants, 
    switchTenant, 
    loading 
  } = useTenant();

  const handleTenantSwitch = async (tenantId: string) => {
    try {
      await switchTenant(tenantId);
    } catch (error) {
      console.error('Tenant switch failed:', error);
    }
  };

  return (
    <select onChange={(e) => handleTenantSwitch(e.target.value)}>
      {availableTenants.map(tenant => (
        <option key={tenant.id} value={tenant.id}>
          {tenant.name}
        </option>
      ))}
    </select>
  );
}
```

### 4. Use Data Flow Hook

```tsx
import { useDataFlow } from './workflow';

function DataComponent() {
  const { syncData, broadcastData, subscribeToData } = useDataFlow();

  const handleDataUpdate = async (newData: any) => {
    try {
      // Sync data with another component
      await syncData('current-component', 'target-component', newData);
      
      // Broadcast to all subscribed components
      await broadcastData('current-component', newData);
    } catch (error) {
      console.error('Data sync failed:', error);
    }
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## 🔧 API Reference

### WorkflowProvider Props

```tsx
interface WorkflowProviderProps {
  children: React.ReactNode;
  initialContext?: Partial<WorkflowContext>;
}
```

### useAuth Hook

```tsx
interface AuthHook {
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  register: (userData: any, tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loading: boolean;
  error: string | null;
  user: UserContext | null;
  isAuthenticated: boolean;
}
```

### useTenant Hook

```tsx
interface TenantHook {
  switchTenant: (tenantId: string) => Promise<void>;
  getCurrentTenant: () => Promise<void>;
  getAllTenants: () => Promise<void>;
  updateTenantConfig: (config: Partial<TenantConfig>) => Promise<void>;
  loading: boolean;
  error: string | null;
  currentTenant: TenantConfig | null;
  availableTenants: TenantConfig[];
}
```

### useDataFlow Hook

```tsx
interface DataFlowHook {
  syncData: (source: string, target: string, payload: any) => Promise<void>;
  broadcastData: (source: string, payload: any) => Promise<void>;
  subscribeToData: (target: string, subscription: any) => Promise<void>;
  unsubscribeFromData: (target: string, subscription: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  lastSync: string | null;
}
```

## 🌟 Features

### Global State Management
- Centralized state management across all components
- Automatic persistence to localStorage
- Real-time state updates

### Tenant Configuration
- Multi-tenant support with proper isolation
- Tenant-specific features and limits
- Dynamic tenant switching
- Branding and configuration sharing

### Authentication
- User login and registration
- Token management and refresh
- Session persistence
- Role-based access control

### Data Flow Coordination
- Component-to-component data synchronization
- Global data broadcasting
- Subscription-based updates
- Automatic cleanup

## 🔒 Security

- Token-based authentication
- Tenant isolation
- Secure data flow
- Input validation

## 📱 Responsive Design

- Mobile-first approach
- Adaptive UI based on tenant configuration
- Dynamic theming support

## 🧪 Testing

The workflow system is designed to be easily testable:
- Mock-friendly architecture
- Isolated workflow functions
- Comprehensive error handling

## 🚀 Performance

- Optimized re-renders
- Efficient state updates
- Lazy loading support
- Memory leak prevention

## 📚 Examples

See the `/examples` directory for complete usage examples and integration patterns.
