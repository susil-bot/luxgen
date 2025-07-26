import React from 'react';
import BaseModal from './BaseModal';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const BasicModal: React.FC<BasicModalProps> = ({
  isOpen,
  onClose,
  title = "Basic Modal",
  content = "This is a basic modal dialog. You can customize the content and actions as needed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6">{content}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const ScrollableModal: React.FC<BasicModalProps> = ({
  isOpen,
  onClose,
  title = "Modal with Scroll Bar",
  content = "This modal has a scroll bar for long content.",
  confirmText = "Got it",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) => {
  const longContent = Array.from({ length: 20 }, (_, i) => 
    `This is paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  ).join('\n\n');

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <div className="p-6">
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <div className="space-y-4">
            {longContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export interface CookiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptAll?: () => void;
  onAcceptNecessary?: () => void;
  onCustomize?: () => void;
}

export const CookiesModal: React.FC<CookiesModalProps> = ({
  isOpen,
  onClose,
  onAcceptAll,
  onAcceptNecessary,
  onCustomize
}) => {
  const handleAcceptAll = () => {
    onAcceptAll?.();
    onClose();
  };

  const handleAcceptNecessary = () => {
    onAcceptNecessary?.();
    onClose();
  };

  const handleCustomize = () => {
    onCustomize?.();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cookie Preferences"
      size="lg"
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEscape={false}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🍪</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We use cookies to enhance your experience
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use cookies and similar technologies to help personalize content, 
              tailor and measure ads, and provide a better experience. By clicking 
              "Accept All", you consent to our use of cookies.
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Necessary Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Required for the website to function properly</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Analytics Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Help us understand how visitors interact with our website</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Marketing Cookies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Used to deliver personalized advertisements</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAcceptNecessary}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Accept Necessary Only
          </button>
          <button
            onClick={handleCustomize}
            className="flex-1 px-4 py-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
          >
            Customize
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </BaseModal>
  );
}; 