import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Activity,
  Server,
  Clock
} from 'lucide-react';
import { useApiConnection, useHealthCheck, useDatabaseStatus } from '../../hooks/useApi';
import { DatabaseMonitorData, HealthCheck } from '../../services/apiServices';

interface ApiConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

const ApiConnectionStatus: React.FC<ApiConnectionStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { connected, lastCheck, error, checkConnection } = useApiConnection();
  const { health, loading: healthLoading, checkHealth } = useHealthCheck();
  const { dbStatus, loading: dbLoading, fetchDbStatus } = useDatabaseStatus();

  const getConnectionIcon = () => {
    if (connected) {
      return <Wifi className="w-4 h-4 text-green-600" />;
    }
    return <WifiOff className="w-4 h-4 text-red-600" />;
  };

  const getConnectionText = () => {
    if (connected) {
      return 'Connected';
    }
    return 'Disconnected';
  };

  const getConnectionColor = () => {
    if (connected) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getHealthStatus = () => {
    if (!health) return { status: 'unknown', color: 'text-gray-500', icon: <AlertTriangle className="w-4 h-4" /> };
    
    if (health.status === 'healthy') {
      return { 
        status: 'Healthy', 
        color: 'text-green-600', 
        icon: <CheckCircle className="w-4 h-4" /> 
      };
    }
    
    return { 
      status: 'Unhealthy', 
      color: 'text-red-600', 
      icon: <XCircle className="w-4 h-4" /> 
    };
  };

  const getDatabaseStatus = () => {
    if (!dbStatus) return { status: 'unknown', color: 'text-gray-500', icon: <AlertTriangle className="w-4 h-4" /> };
    
    if (dbStatus.status?.isConnected) {
      return { 
        status: 'Connected', 
        color: 'text-green-600', 
        icon: <Database className="w-4 h-4" /> 
      };
    }
    
    return { 
      status: 'Disconnected', 
      color: 'text-red-600', 
      icon: <XCircle className="w-4 h-4" /> 
    };
  };

  const formatTimestamp = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleRefresh = async () => {
    await Promise.all([
      checkConnection(),
      checkHealth(),
      fetchDbStatus()
    ]);
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getConnectionIcon()}
        <span className={`text-sm font-medium ${getConnectionColor()}`}>
          {getConnectionText()}
        </span>
        <button
          onClick={handleRefresh}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Refresh connection status"
        >
          <RefreshCw className="w-3 h-3 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">API Connection Status</h3>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${(healthLoading || dbLoading) ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* API Connection */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Server className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {getConnectionIcon()}
              <span className={`font-medium ${getConnectionColor()}`}>
                {getConnectionText()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last check: {formatTimestamp(lastCheck)}
            </div>
            {error && (
              <div className="text-xs text-red-600 mt-1">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Health Status */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Activity className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {getHealthStatus().icon}
              <span className={`font-medium ${getHealthStatus().color}`}>
                {getHealthStatus().status}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Service: {health?.service || 'Unknown'}
            </div>
            <div className="text-xs text-gray-500">
              Version: {health?.version || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Database className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {getDatabaseStatus().icon}
              <span className={`font-medium ${getDatabaseStatus().color}`}>
                {getDatabaseStatus().status}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              DB: {dbStatus?.status?.databaseName || 'Unknown'}
            </div>
            <div className="text-xs text-gray-500">
              Host: {dbStatus?.status?.host || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Health Details */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span>Health Details</span>
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={getHealthStatus().color}>
                {getHealthStatus().status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="text-gray-900">{health?.service || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="text-gray-900">{health?.version || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timestamp:</span>
              <span className="text-gray-900">{formatTimestamp(health?.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Database Details */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span>Database Details</span>
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Connection:</span>
              <span className={getDatabaseStatus().color}>
                {getDatabaseStatus().status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="text-gray-900">{dbStatus?.status?.databaseName || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Host:</span>
              <span className="text-gray-900">{dbStatus?.status?.host || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port:</span>
              <span className="text-gray-900">{dbStatus?.status?.port || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Health Stats */}
      {dbStatus?.health?.stats && (
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Database Statistics</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {dbStatus.health.stats.collections}
              </div>
              <div className="text-gray-600">Collections</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {Math.round(dbStatus.health.stats.dataSize / 1024)} KB
              </div>
              <div className="text-gray-600">Data Size</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {dbStatus.health.stats.indexes}
              </div>
              <div className="text-gray-600">Indexes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {Math.round(dbStatus.health.stats.storageSize / 1024)} KB
              </div>
              <div className="text-gray-600">Storage</div>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-500 flex items-center space-x-2">
        <Clock className="w-3 h-3" />
        <span>
          Last updated: {formatTimestamp(lastCheck)}
        </span>
      </div>
    </div>
  );
};

export default ApiConnectionStatus; 