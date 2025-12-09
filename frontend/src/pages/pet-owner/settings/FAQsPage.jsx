import { useState } from 'react';
import { FaChevronLeft, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200 last:border-0">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition px-4 rounded-xl"
    >
      <span className="font-medium text-gray-900 pr-4">{question}</span>
      <FaChevronDown
        className={`text-gray-400 shrink-0 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    {isOpen && (
      <div className="px-4 pb-4">
        <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    )}
  </div>
);

export default function FAQsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      category: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking the "Sign Up" button on the home page. Choose whether you\'re a pet owner or a clinic, then fill in your information and verify your email address.'
        },
        {
          question: 'Is VetSync free to use?',
          answer: 'VetSync is free for pet owners. Veterinary clinics can choose from various subscription plans based on their needs and the features they require.'
        },
        {
          question: 'What devices can I use VetSync on?',
          answer: 'VetSync works on desktop computers, tablets, and smartphones. We have web applications and mobile apps for both iOS and Android devices.'
        }
      ]
    },
    {
      category: 'Appointments',
      faqs: [
        {
          question: 'How do I book an appointment?',
          answer: 'Navigate to the Appointments section, select your pet and preferred clinic, choose an available time slot, and confirm your booking. You\'ll receive a confirmation notification.'
        },
        {
          question: 'Can I reschedule or cancel appointments?',
          answer: 'Yes, you can reschedule or cancel appointments through the Appointments section. Please note that cancellation policies may vary by clinic, so check with them for specific requirements.'
        },
        {
          question: 'Will I receive appointment reminders?',
          answer: 'Yes, you\'ll receive appointment reminders 24 hours before your scheduled time via push notification, email, or SMS based on your notification preferences.'
        }
      ]
    },
    {
      category: 'Pet Health Records',
      faqs: [
        {
          question: 'How do I add my pet\'s information?',
          answer: 'Go to the "My Pets" section and click "Add Pet". Fill in your pet\'s details including name, species, breed, age, and upload a photo. You can also add medical information like allergies and current medications.'
        },
        {
          question: 'Can I access my pet\'s medical history?',
          answer: 'Yes, all medical records, vaccination history, and visit notes from participating clinics are stored in your pet\'s profile and accessible anytime.'
        },
        {
          question: 'How do I share my pet\'s records with a new vet?',
          answer: 'You can generate a shareable link or PDF of your pet\'s medical records from their profile. This can be shared with any veterinarian or clinic.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      faqs: [
        {
          question: 'Is my data secure?',
          answer: 'Yes, we use industry-standard encryption to protect your data. All information is stored securely and we never share your personal or pet information without your explicit consent.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time from the Settings page. Please note that this action is permanent and will delete all your data including pet records.'
        },
        {
          question: 'Who can see my pet\'s information?',
          answer: 'Only you and the veterinary clinics you\'ve authorized can access your pet\'s information. Clinics can only see records for appointments you\'ve booked with them.'
        }
      ]
    },
    {
      category: 'Billing & Payments',
      faqs: [
        {
          question: 'How do I pay for appointments?',
          answer: 'Payment methods vary by clinic. Some clinics accept online payment through VetSync, while others require payment at the clinic. Check with your specific clinic for their payment options.'
        },
        {
          question: 'Can I get invoices for my appointments?',
          answer: 'Yes, invoices are available in the Appointments section. You can view, download, or email invoices for your records or insurance claims.'
        }
      ]
    }
  ];

  const allFAQs = faqCategories.flatMap((cat, catIdx) =>
    cat.faqs.map((faq, faqIdx) => ({
      ...faq,
      category: cat.category,
      index: `${catIdx}-${faqIdx}`
    }))
  );

  const filteredFAQs = searchQuery
    ? allFAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white min-h-screen pb-20">
          <div className="sticky top-0 p-4 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => navigate(-1)} className="flex gap-2 items-center justify-center rounded-full hover:bg-gray-300 transition">
                <FaChevronLeft className="text-gray-500" />
                <span className="text-xl font-medium">FAQs</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="p-4">
            {filteredFAQs ? (
              filteredFAQs.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200">
                  {filteredFAQs.map((faq) => (
                    <FAQItem
                      key={faq.index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openItems.includes(faq.index)}
                      onClick={() => toggleItem(faq.index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {faqCategories.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h2 className="font-semibold text-lg mb-3">{category.category}</h2>
                    <div className="bg-white rounded-2xl border border-gray-200">
                      {category.faqs.map((faq, faqIdx) => (
                        <FAQItem
                          key={`${catIdx}-${faqIdx}`}
                          question={faq.question}
                          answer={faq.answer}
                          isOpen={openItems.includes(`${catIdx}-${faqIdx}`)}
                          onClick={() => toggleItem(`${catIdx}-${faqIdx}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-6">
              <h3 className="font-semibold mb-2">Still have questions?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Can't find what you're looking for? Contact our support team.
              </p>
              <button 
                onClick={() => navigate('/settings/report')}
                className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2">
              <FaChevronLeft className="text-gray-500" />
              <h1 className="text-2xl font-medium">Frequently Asked Questions</h1>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {filteredFAQs ? (
            filteredFAQs.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                {filteredFAQs.map((faq) => (
                  <FAQItem
                    key={faq.index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems.includes(faq.index)}
                    onClick={() => toggleItem(faq.index)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No FAQs found matching your search.</p>
              </div>
            )
          ) : (
            <div className="space-y-6">
              {faqCategories.map((category, catIdx) => (
                <div key={catIdx} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-lg mb-4">{category.category}</h2>
                  <div>
                    {category.faqs.map((faq, faqIdx) => (
                      <FAQItem
                        key={`${catIdx}-${faqIdx}`}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openItems.includes(`${catIdx}-${faqIdx}`)}
                        onClick={() => toggleItem(`${catIdx}-${faqIdx}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Section */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-gray-600">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>
              <button 
                onClick={() => navigate('/settings/report')}
                className="bg-primary text-white px-8 py-3 rounded-2xl hover:bg-[#FEA08E] transition whitespace-nowrap"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}