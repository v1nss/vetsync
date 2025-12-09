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
        {typeof answer === 'string' ? (
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        ) : (
          <div className="text-gray-600 text-sm leading-relaxed">
            {answer.text && <p className="mb-2">{answer.text}</p>}
            {answer.list && (
              <ul className="space-y-1">
                {answer.list.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
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

  const faqs = [
    {
      question: 'What is VetSync?',
      answer: 'VetSync is a web-based system that supports veterinary clinics in managing operations, appointments, records, and pet health information.'
    },
    {
      question: 'Who can use VetSync?',
      answer: 'Veterinarians, clinic staff/admin, and pet owners in Parañaque City.'
    },
    {
      question: 'What problems does VetSync solve?',
      answer: {
        list: [
          'Long waiting times',
          'Lost or incomplete pet records',
          'Manual and error-prone clinic processes',
          'Difficulty tracking treatments, vaccinations, and appointments'
        ]
      }
    },
    {
      question: 'What features does VetSync offer?',
      answer: {
        list: [
          'Online appointments',
          'Pet health records',
          'Treatment and vaccination history',
          'Notifications and updates thru Gmail'
        ]
      }
    },
    {
      question: 'How does VetSync help veterinary clinics?',
      answer: 'It organizes records and reduces manual work so clinics can deliver faster and more reliable service.'
    },
    {
      question: 'How does VetSync help pet owners?',
      answer: 'Pet owners can view records, track vaccinations, monitor upcoming appointments, and connect with the clinic easily.'
    },
    {
      question: 'Is VetSync accessible on any device?',
      answer: 'Yes. It is web-based and works on phones, tablets, and computers with internet access.'
    },
    {
      question: 'Is the system secure?',
      answer: 'Yes. VetSync uses secure login, controlled user access, and protected data storage.'
    },
    {
      question: 'Is VetSync only for clinics?',
      answer: 'No. It is designed for both clinics and pet owners, providing a connected system for better pet care.'
    }
  ];

  const filteredFAQs = searchQuery
    ? faqs.filter((faq, idx) => {
        const searchLower = searchQuery.toLowerCase();
        const questionMatch = faq.question.toLowerCase().includes(searchLower);
        
        let answerMatch = false;
        if (typeof faq.answer === 'string') {
          answerMatch = faq.answer.toLowerCase().includes(searchLower);
        } else if (faq.answer.text) {
          answerMatch = faq.answer.text.toLowerCase().includes(searchLower);
        } else if (faq.answer.list) {
          answerMatch = faq.answer.list.some(item => 
            item.toLowerCase().includes(searchLower)
          );
        }
        
        return questionMatch || answerMatch;
      }).map((faq, idx) => ({ ...faq, originalIndex: faqs.indexOf(faq) }))
    : faqs.map((faq, idx) => ({ ...faq, originalIndex: idx }));

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white min-h-screen pb-20">
          <div className="sticky top-0 p-4 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => navigate(-1)} className="flex gap-2 items-center rounded-full hover:bg-gray-300 transition">
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
            {filteredFAQs.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200">
                {filteredFAQs.map((faq) => (
                  <FAQItem
                    key={faq.originalIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems.includes(faq.originalIndex)}
                    onClick={() => toggleItem(faq.originalIndex)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No FAQs found matching your search.</p>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-6">
              <h3 className="font-semibold mb-2">Still have questions?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Can't find what you're looking for? Contact our support team.
              </p>
              <button 
                onClick={() => navigate('/pet-owner/settings/report')}
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

          {filteredFAQs.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              {filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.originalIndex}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openItems.includes(faq.originalIndex)}
                  onClick={() => toggleItem(faq.originalIndex)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center mb-8">
              <p className="text-gray-500">No FAQs found matching your search.</p>
            </div>
          )}

          {/* Contact Section */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-gray-600">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>
              <button 
                onClick={() => navigate('/pet-owner/settings/report')}
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