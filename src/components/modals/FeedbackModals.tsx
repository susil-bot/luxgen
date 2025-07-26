import React from 'react';
import BaseModal from './BaseModal';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export const SuccessModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title = "Success!",
  message = "Your action has been completed successfully.",
  confirmText = "Continue",
  onConfirm,
  showCancelButton = false,
  cancelText = "Cancel",
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
      size="md"
      showCloseButton={false}
    >
      <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-3">
          {showCancelButton && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const DangerModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title = "Are you sure?",
  message = "This action cannot be undone. This will permanently delete the selected item.",
  confirmText = "Delete",
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
      size="md"
      showCloseButton={false}
    >
      <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const InfoModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title = "Information",
  message = "Here's some important information you should know.",
  confirmText = "Got it",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCancelButton = false
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
      size="md"
      showCloseButton={false}
    >
      <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <Info className="h-8 w-8 text-blue-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-3">
          {showCancelButton && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const WarningModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title = "Warning",
  message = "Please be careful with this action. It may have unintended consequences.",
  confirmText = "Proceed",
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
      size="md"
      showCloseButton={false}
    >
      <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}; 