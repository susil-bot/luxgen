import React, { useState } from 'react';
import {
  SearchModal,
  BasicModal,
  ScrollableModal,
  CookiesModal,
  SuccessModal,
  DangerModal,
  InfoModal,
  WarningModal,
  SendFeedbackModal,
  NewsletterModal,
  AnnouncementModal,
  IntegrationModal,
  WhatsNewModal,
  ChangePlanModal,
  QuickFindModal
} from '../modals';

const ModalShowcase: React.FC = () => {
  // Modal states
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [scrollableModalOpen, setScrollableModalOpen] = useState(false);
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
  const [whatsNewModalOpen, setWhatsNewModalOpen] = useState(false);
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false);
  const [quickFindModalOpen, setQuickFindModalOpen] = useState(false);

  const modalSections = [
    {
      title: "Search",
      description: "Search functionality with recent searches and pages",
      modals: [
        { name: "Search Modal", open: searchModalOpen, setOpen: setSearchModalOpen }
      ]
    },
    {
      title: "Basic",
      description: "Basic modal dialogs for simple interactions",
      modals: [
        { name: "Basic Modal", open: basicModalOpen, setOpen: setBasicModalOpen },
        { name: "Modal w/ Scroll Bar", open: scrollableModalOpen, setOpen: setScrollableModalOpen },
        { name: "Cookies", open: cookiesModalOpen, setOpen: setCookiesModalOpen }
      ]
    },
    {
      title: "Feedback",
      description: "Feedback modals for user notifications and confirmations",
      modals: [
        { name: "Success Modal", open: successModalOpen, setOpen: setSuccessModalOpen },
        { name: "Danger Modal", open: dangerModalOpen, setOpen: setDangerModalOpen },
        { name: "Info Modal", open: infoModalOpen, setOpen: setInfoModalOpen },
        { name: "Warning Modal", open: warningModalOpen, setOpen: setWarningModalOpen }
      ]
    },
    {
      title: "Product",
      description: "Product-specific modals for various features",
      modals: [
        { name: "Send Feedback", open: feedbackModalOpen, setOpen: setFeedbackModalOpen },
        { name: "Newsletter", open: newsletterModalOpen, setOpen: setNewsletterModalOpen },
        { name: "Announcement", open: announcementModalOpen, setOpen: setAnnouncementModalOpen },
        { name: "Integration", open: integrationModalOpen, setOpen: setIntegrationModalOpen },
        { name: "What's New", open: whatsNewModalOpen, setOpen: setWhatsNewModalOpen },
        { name: "Change your Plan", open: changePlanModalOpen, setOpen: setChangePlanModalOpen },
        { name: "Quick Find", open: quickFindModalOpen, setOpen: setQuickFindModalOpen }
      ]
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Handle search logic here
  };

  const handleFeedback = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    // Handle feedback submission
  };

  const handleNewsletter = (email: string, preferences: string[]) => {
    console.log('Newsletter subscription:', { email, preferences });
    // Handle newsletter subscription
  };

  const handleIntegration = (integration: string) => {
    console.log('Integration selected:', integration);
    // Handle integration connection
  };

  const handlePlanChange = (plan: string) => {
    console.log('Plan changed to:', plan);
    // Handle plan change
  };

  const handleQuickFind = (item: any) => {
    console.log('Quick find selected:', item);
    // Handle quick find selection
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Modal Components</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive collection of modal components for your training platform. 
            Each modal is designed with proper props handling, accessibility, and responsive design.
          </p>
        </div>

        {/* Modal Sections */}
        <div className="space-y-12">
          {modalSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                <p className="text-gray-600 mt-1">{section.description}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.modals.map((modal) => (
                    <button
                      key={modal.name}
                      onClick={() => modal.setOpen(true)}
                      className="w-full px-4 py-3 text-left bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      {modal.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Instructions</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              All modals are built with TypeScript and include proper prop interfaces. 
              They handle accessibility, keyboard navigation, and responsive design out of the box.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Basic Usage:</h4>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`import { SearchModal } from '../components/modals';

const [isOpen, setIsOpen] = useState(false);

<SearchModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSearch={(query) => console.log(query)}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* All Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
      />

      <BasicModal
        isOpen={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        title="Basic Modal"
        content="This is a basic modal dialog. You can customize the content and actions as needed."
        onConfirm={() => console.log('Basic modal confirmed')}
      />

      <ScrollableModal
        isOpen={scrollableModalOpen}
        onClose={() => setScrollableModalOpen(false)}
        onConfirm={() => console.log('Scrollable modal confirmed')}
      />

      <CookiesModal
        isOpen={cookiesModalOpen}
        onClose={() => setCookiesModalOpen(false)}
        onAcceptAll={() => console.log('All cookies accepted')}
        onAcceptNecessary={() => console.log('Necessary cookies accepted')}
        onCustomize={() => console.log('Customize cookies')}
      />

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onConfirm={() => console.log('Success confirmed')}
      />

      <DangerModal
        isOpen={dangerModalOpen}
        onClose={() => setDangerModalOpen(false)}
        onConfirm={() => console.log('Danger confirmed')}
      />

      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        onConfirm={() => console.log('Info confirmed')}
      />

      <WarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onConfirm={() => console.log('Warning confirmed')}
      />

      <SendFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedback}
      />

      <NewsletterModal
        isOpen={newsletterModalOpen}
        onClose={() => setNewsletterModalOpen(false)}
        onSubscribe={handleNewsletter}
      />

      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title="New Feature Available"
        message="We've just released a new training module. Check it out!"
        type="success"
      />

      <IntegrationModal
        isOpen={integrationModalOpen}
        onClose={() => setIntegrationModalOpen(false)}
        onConnect={handleIntegration}
      />

      <WhatsNewModal
        isOpen={whatsNewModalOpen}
        onClose={() => setWhatsNewModalOpen(false)}
      />

      <ChangePlanModal
        isOpen={changePlanModalOpen}
        onClose={() => setChangePlanModalOpen(false)}
        currentPlan="Basic"
        onUpgrade={handlePlanChange}
      />

      <QuickFindModal
        isOpen={quickFindModalOpen}
        onClose={() => setQuickFindModalOpen(false)}
        onSelect={handleQuickFind}
      />
    </div>
  );
};

export default ModalShowcase; 