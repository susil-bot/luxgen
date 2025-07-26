// Base Modal
export { default as BaseModal } from './BaseModal';

// Search Modal
export { default as SearchModal } from './SearchModal';
export type { SearchModalProps, SearchResult } from './SearchModal';

// Basic Modals
export { BasicModal, ScrollableModal, CookiesModal } from './BasicModals';
export type { BasicModalProps, CookiesModalProps } from './BasicModals';

// Feedback Modals
export { SuccessModal, DangerModal, InfoModal, WarningModal } from './FeedbackModals';
export type { FeedbackModalProps } from './FeedbackModals';

// Product Modals
export { 
  SendFeedbackModal, 
  NewsletterModal, 
  AnnouncementModal, 
  IntegrationModal, 
  WhatsNewModal, 
  ChangePlanModal, 
  QuickFindModal 
} from './ProductModals';
export type { 
  FeedbackFormModalProps, 
  NewsletterModalProps, 
  AnnouncementModalProps, 
  IntegrationModalProps, 
  WhatsNewModalProps, 
  ChangePlanModalProps, 
  QuickFindModalProps 
} from './ProductModals'; 