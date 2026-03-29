import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {}
    setLoading(false);
  };

  return (
    <div className="page-container bg-bg">
      <div className="container-saas py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Side: Brand Presence & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                Contact Support
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-dark mb-6 leading-tight">
                Let's secure the <br /><span className="text-primary text-glow">future together.</span>
              </h1>
              <p className="text-xl text-gray font-medium leading-relaxed">
                Have questions about our verification technology or need enterprise-grade security? Our team is ready to assist.
              </p>
            </div>

            <div className="grid gap-8">
              {[
                { label: 'Technical Support', value: '2319959.cse.coe@gmail.com', icon: '✉️', desc: 'Direct access to our security engineers.' },
                { label: 'Primary Contact', value: 'Ayush Gilhotra', icon: '👤', desc: 'Lead architect of the AuthenTick network.' },
                { label: 'Response Time', value: 'Within 24 Hours', icon: '⚡', desc: 'We prioritize security-critical inquiries.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-primary/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray uppercase tracking-[0.2em] mb-1">{item.label}</h4>
                    <p className="text-lg font-bold text-dark mb-1 group-hover:text-primary transition-colors">{item.value}</p>
                    <p className="text-sm text-gray/70 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-dark rounded-[32px] text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
               <h4 className="text-lg font-bold mb-2">Emergency?</h4>
               <p className="text-white/60 text-sm mb-0">For immediate reporting of widespread counterfeit incidents, use the emergency flag in the report system.</p>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card bg-white p-10 lg:p-12 border border-white relative"
          >
            {success ? (
              <div className="text-center py-16">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-3xl font-black text-dark mb-4">Transmission Received</h3>
                <p className="text-gray font-medium mb-10 leading-relaxed">Your message has been encrypted and sent to our support queue. expect a response shortly.</p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                   <h3 className="text-2xl font-black text-dark mb-2">Send a Message</h3>
                   <p className="text-gray font-medium text-sm">Fill out the form below and we'll be in touch.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-2 block ml-1">Your Identity</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className={`w-full bg-bg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm ${errors.name ? 'border-error/50' : 'border-transparent focus:border-primary'}`}
                        style={{ padding: '0 32px', minHeight: '56px' }}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-2 block ml-1">Channel Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className={`w-full bg-bg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm ${errors.email ? 'border-error/50' : 'border-transparent focus:border-primary'}`}
                        style={{ padding: '0 32px', minHeight: '56px' }}
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-2 block ml-1">Inquiry Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                      className={`w-full bg-bg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm ${errors.subject ? 'border-error/5s0' : 'border-transparent focus:border-primary'}`}
                      style={{ padding: '0 32px', minHeight: '56px' }}
                      placeholder="e.g. Enterprise Integration"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-2 block ml-1">Detailed Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      rows={5}
                      className={`w-full bg-bg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm resize-none ${errors.message ? 'border-error/50' : 'border-transparent focus:border-primary'}`}
                      style={{ padding: '24px 32px', minHeight: '160px' }}
                      placeholder="Describe your inquiry in detail..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-5 bg-primary text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-xs btn-glow disabled:opacity-50 shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-[0.98]"
                  >
                    {loading ? 'Transmitting...' : 'Encrypted Transmission'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
