import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How do I use AuthenTick to verify a medicine?',
    answer: 'Simply scan the QR code on the medicine packaging using our Verify page, or enter the verification token manually. You\'ll get an instant result showing whether the medicine is genuine, suspicious, expired, or recalled.'
  },
  {
    question: 'Understanding verification results',
    answer: '• Genuine (Green) — The medicine is verified and authentic.\n• Suspicious (Yellow) — The product has been scanned an unusually high number of times, which may indicate counterfeiting.\n• Expired (Red) — The medicine has passed its expiry date.\n• Recalled (Purple) — The manufacturer has recalled this batch.'
  },
  {
    question: 'Why does my medicine show as "Suspicious"?',
    answer: 'A medicine is flagged as suspicious when it has been scanned more than 50 times. This often indicates that counterfeit copies of the product may exist. If you see this result, we recommend purchasing the medicine from a different, trusted source and reporting the incident.'
  },
  {
    question: 'How do I report a suspicious medicine?',
    answer: 'After scanning a medicine, click the "Report Suspicious" button on the result page. Fill in the reason, any details about the issue, and optionally your email address. Our team will investigate the report.'
  },
  {
    question: 'What if the QR code is not working?',
    answer: '• Make sure the QR code is clean and clearly visible.\n• Ensure adequate lighting.\n• Hold your camera steady about 10-15cm from the code.\n• If the code is damaged, you can enter the token manually instead.\n• If issues persist, the code may have been tampered with — please report it.'
  },
  {
    question: 'Need more help?',
    answer: 'Visit our Contact page to reach out to our support team. We\'re here to help you stay safe from counterfeit medicines.'
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="page-container bg-bg">
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Knowledge Base
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-dark mb-4">How can we help?</h1>
          <p className="text-lg text-gray mx-auto leading-relaxed">
            Everything you need to know about using the AuthenTick verification system and staying safe from counterfeit medicines.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`premium-card bg-white border-2 transition-all overflow-hidden ${openIndex === i ? 'border-primary/20 ring-4 ring-primary/5' : 'border-transparent'}`}
            >
              <button
                id={`faq-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4 pr-8">
                  <span className="w-8 h-8 rounded-full bg-bg flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-primary/10 transition-colors">
                    {i + 1}
                  </span>
                  <span className={`text-base font-bold transition-colors ${openIndex === i ? 'text-primary' : 'text-dark'}`}>
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${openIndex === i ? 'bg-primary text-white' : 'bg-bg text-gray'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-8 pt-2 pl-[68px]">
                      <div className="h-px bg-border mb-6" />
                      <p className="text-sm font-medium text-gray leading-loose whitespace-pre-line">
                        {faq.answer}
                      </p>
                      
                      {i === 2 && (
                        <div className="mt-6 p-4 bg-warning/10 border-l-4 border-warning rounded-r-xl">
                          <p className="text-xs font-bold text-warning-dark">Safety Recommendation</p>
                          <p className="text-xs text-warning-dark/80 mt-1">If a product is flagged, do not consume it. Contact your local health authority immediately.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer Help */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-10 bg-dark rounded-[32px] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent)]" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-white/60 mb-8 mx-auto font-medium" style={{ maxWidth: '448px', lineHeight: '1.6' }}>Our help team is available 24/7 to assist with any security concerns or technical issues.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all no-underline shadow-xl shadow-primary/20">
              Contact Support
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
