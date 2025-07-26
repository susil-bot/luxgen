import React, { useState } from 'react';
import { 
  QrCode, 
  Plus, 
  Download, 
  Copy, 
  RefreshCw, 
  Settings,
  Eye,
  Trash2,
  Smartphone,
  Users,
  Activity
} from 'lucide-react';

interface QRCode {
  id: string;
  name: string;
  url: string;
  presentationId: string;
  isActive: boolean;
  scans: number;
  createdAt: Date;
  expiresAt?: Date;
}

const QRManagement: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([
    {
      id: '1',
      name: 'Leadership Workshop - Main',
      url: 'https://luxgen.app/present/abc123',
      presentationId: 'presentation_1',
      isActive: true,
      scans: 45,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Team Building Session',
      url: 'https://luxgen.app/present/def456',
      presentationId: 'presentation_2',
      isActive: true,
      scans: 32,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: 'Sales Training - Advanced',
      url: 'https://luxgen.app/present/ghi789',
      presentationId: 'presentation_3',
      isActive: false,
      scans: 28,
      createdAt: new Date('2024-01-05'),
      expiresAt: new Date('2024-02-05')
    }
  ]);

  const generateQRCode = () => {
    const newQR: QRCode = {
      id: `qr_${Date.now()}`,
      name: `QR Code ${qrCodes.length + 1}`,
      url: `https://luxgen.app/present/${Math.random().toString(36).substr(2, 9)}`,
      presentationId: `presentation_${qrCodes.length + 1}`,
      isActive: true,
      scans: 0,
      createdAt: new Date(),
    };
    setQrCodes(prev => [...prev, newQR]);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage QR codes for audience participation</p>
        </div>
        <button
          onClick={generateQRCode}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Generate QR Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  qr.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {qr.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {qr.expiresAt && (
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  Expires: {qr.expiresAt.toLocaleDateString()}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {qr.name}
            </h3>

            <div className="mb-4">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                  {qr.url}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Smartphone className="h-4 w-4" />
                  <span>{qr.scans} scans</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{qr.scans} participants</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(qr.url)}
                  className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Code Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <QrCode className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Easy Access</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Audience can join presentations instantly</p>
          </div>
          <div className="text-center">
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Real-time Tracking</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor participation and engagement</p>
          </div>
          <div className="text-center">
            <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Mobile Optimized</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Works seamlessly on all devices</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <QrCode className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total QR Codes</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{qrCodes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Scans</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Codes</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {qrCodes.filter(qr => qr.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Scans</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {Math.round(qrCodes.reduce((sum, qr) => sum + qr.scans, 0) / qrCodes.length)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRManagement; 