import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Server,
  HardDrive,
  Clock,
  Users,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface DatabaseStatus {
  isConnected: boolean;
  retryAttempts: number;
  maxRetryAttempts: number;
  connectionState: number;
  databaseName: string;
  host: string;
  port: number;
  timestamp: string;
}

interface DatabaseHealth {
  status: string;
  message: string;
  timestamp: string;
  stats?: {
    collections: number;
    dataSize: number;
    storageSize: number;
    indexes: number;
    indexSize: number;
  };
}

interface DatabaseTest {
  success: boolean;
  message: string;
  collections: number;
  serverStatus: {
    version: string;
    uptime: number;
    connections: {
      current: number;
      available: number;
    };
  };
  timestamp: string;
}

interface DatabaseMonitorData {
  status: DatabaseStatus;
  health: DatabaseHealth;
  test: DatabaseTest;
  timestamp: string;
}

const DatabaseMonitor: React.FC = () => {
  const [data, setData] = useState<DatabaseMonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchDatabaseStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/database/status');
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        setLastRefresh(new Date());
      } else {
        setError(result.error || 'Failed to fetch database status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDatabaseStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getConnectionStateText = (state: number) => {
    switch (state) {
      case 0: return 'Disconnected';
      case 1: return 'Connected';
      case 2: return 'Connecting';
      case 3: return 'Disconnecting';
      default: return 'Unknown';
    }
  };

  const getConnectionStateColor = (state: number) => {
    switch (state) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading database status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <XCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Database Monitor Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchDatabaseStatus}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">No database data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Database Monitor</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
          <button
            onClick={fetchDatabaseStatus}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Connection Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Connection</h3>
            </div>
            {data.status.isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${getConnectionStateColor(data.status.connectionState)}`}>
                {getConnectionStateText(data.status.connectionState)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">{data.status.databaseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Host:</span>
              <span className="font-medium">{data.status.host}:{data.status.port}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retries:</span>
              <span className="font-medium">{data.status.retryAttempts}/{data.status.maxRetryAttempts}</span>
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Health</h3>
            </div>
            {getStatusIcon(data.health.status)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                data.health.status === 'healthy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.health.status}
              </span>
            </div>
            {data.health.stats && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collections:</span>
                  <span className="font-medium">{data.health.stats.collections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Size:</span>
                  <span className="font-medium">{formatBytes(data.health.stats.dataSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">{formatBytes(data.health.stats.storageSize)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Server Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Server</h3>
            </div>
            {data.test.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">{data.test.serverStatus.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium">{formatUptime(data.test.serverStatus.uptime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium">{data.test.serverStatus.connections.current}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium">{data.test.serverStatus.connections.available}</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Performance</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Collections:</span>
              <span className="font-medium">{data.test.collections}</span>
            </div>
            {data.health.stats && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Indexes:</span>
                  <span className="font-medium">{data.health.stats.indexes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Index Size:</span>
                  <span className="font-medium">{formatBytes(data.health.stats.indexSize)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Test Status:</span>
              <span className={`font-medium ${data.test.success ? 'text-green-600' : 'text-red-600'}`}>
                {data.test.success ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Connection Details</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Connection State:</span>
              <span className={`font-medium ${getConnectionStateColor(data.status.connectionState)}`}>
                {getConnectionStateText(data.status.connectionState)} ({data.status.connectionState})
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Database Name:</span>
              <span className="font-medium">{data.status.databaseName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Host Address:</span>
              <span className="font-medium">{data.status.host}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Port:</span>
              <span className="font-medium">{data.status.port}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Retry Attempts:</span>
              <span className="font-medium">{data.status.retryAttempts} / {data.status.maxRetryAttempts}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{new Date(data.status.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Health Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span>Health Details</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Health Status:</span>
              <span className={`font-medium ${
                data.health.status === 'healthy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.health.status}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Message:</span>
              <span className="font-medium text-sm">{data.health.message}</span>
            </div>
            {data.health.stats && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Collections:</span>
                  <span className="font-medium">{data.health.stats.collections}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Data Size:</span>
                  <span className="font-medium">{formatBytes(data.health.stats.dataSize)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Storage Size:</span>
                  <span className="font-medium">{formatBytes(data.health.stats.storageSize)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Indexes:</span>
                  <span className="font-medium">{data.health.stats.indexes}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Index Size:</span>
                  <span className="font-medium">{formatBytes(data.health.stats.indexSize)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <span>Connection Test Results</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Test Status:</span>
            <span className={`font-medium ${data.test.success ? 'text-green-600' : 'text-red-600'}`}>
              {data.test.success ? 'Passed' : 'Failed'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Message:</span>
            <span className="font-medium text-sm">{data.test.message}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Collections Found:</span>
            <span className="font-medium">{data.test.collections}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Server Version:</span>
            <span className="font-medium">{data.test.serverStatus.version}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Server Uptime:</span>
            <span className="font-medium">{formatUptime(data.test.serverStatus.uptime)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Current Connections:</span>
            <span className="font-medium">{data.test.serverStatus.connections.current}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Available Connections:</span>
            <span className="font-medium">{data.test.serverStatus.connections.available}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseMonitor; 