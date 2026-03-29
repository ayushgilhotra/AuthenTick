import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { verifyToken } from '../api';

const globalData = [
  { year: '2018', cases: 1200 }, { year: '2019', cases: 2100 }, { year: '2020', cases: 3800 },
  { year: '2021', cases: 5200 }, { year: '2022', cases: 7100 }, { year: '2023', cases: 9500 },
  { year: '2024', cases: 12000 },
];

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [demoToken, setDemoToken] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoVerify = async () => {
    if (!demoToken.trim()) return;
    setDemoLoading(true);
    try {
      await verifyToken(demoToken);
      navigate(`/result/${demoToken}`);
    } catch {
      navigate(`/result/${demoToken}`);
    }
    setDemoLoading(false);
  };

  const features = [
    { icon: '🛡️', title: 'Authenticity Check', desc: 'Secure QR codes ensuring the medicine you consume is 100% genuine.' },
    { icon: '🧩', title: 'Anomaly Detection', desc: 'Smarter tracking to identify suspicious distribution and scan patterns.' },
    { icon: '📅', title: 'Smart Expiry', desc: 'Receive immediate warnings if a product is nearing or past its shelf life.' },
    { icon: '📢', title: 'Instant Recalls', desc: 'Direct alerts from manufacturers in case of batch issues or safety recalls.' },
    { icon: '📊', title: 'Actionable Insights', desc: 'Role-based dashboards for manufacturers to track product integrity.' },
    { icon: '🤝', title: 'Community Safe', desc: 'Easily report suspicious products to help protect the entire community.' },
  ];

  const steps = [
    { num: '01', title: 'Scan QR', desc: 'Use our mobile-friendly scanner on any medicine pack.', icon: '📱' },
    { num: '02', title: 'Instant Check', desc: 'Our algorithms verify the unique token in milliseconds.', icon: '⚡' },
    { num: '03', title: 'Stay Safe', desc: 'Get detailed safety info and historical scan data.', icon: '🏥' },
  ];

  return (
    <div className="page-container bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="container-saas relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Global Security Standard</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-dark leading-[1.1] tracking-tight mb-6">
                Trust for Every <br />
                <span className="text-primary">Medicine Dose.</span>
              </h1>
              
              <p className="text-lg text-gray mb-8 font-light leading-relaxed">
                AuthenTick architectures secure cryptographic verification protocols to eliminate counterfeit medicines from the global supply chain with real-time tracking.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/verify" className="btn-saas-primary no-underline">
                  Start Verification
                </Link>
                <a href="#how-it-works" className="btn-saas-secondary no-underline">
                  View Protocol
                </a>
              </div>
              
              <div className="mt-12 flex items-center gap-8 grayscale opacity-40">
                {['FDA', 'WHO', 'ISO', 'HIPAA'].map(brand => (
                  <div key={brand} className="text-xs font-bold tracking-widest">{brand}</div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="saas-card border-none shadow-premium-hover p-10 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                
                <div className="scanner-border-animate p-8 bg-gray-50 rounded-[20px] mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 17h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Node Activity</h3>
                  <div className="space-y-3">
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-1/2 bg-primary" />
                    </div>
                    <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray uppercase font-bold tracking-widest mb-1">Integrity Score</p>
                    <p className="text-sm font-bold text-success">99.9% Verified</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verification Tool */}
      <section className="py-24 bg-gray-50/50">
        <div className="container-saas">
          <div className="saas-card max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 block">Toolkit</span>
                <h2 className="text-3xl font-extrabold mb-4">Manual Token Audit</h2>
                <p className="text-gray font-light">
                  Execute a cryptographic check on any product token to simulate the underlying verification engine.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={demoToken}
                    onChange={(e) => setDemoToken(e.target.value)}
                    placeholder="Enter medicine token..."
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleDemoVerify()}
                  />
                  <button
                    onClick={handleDemoVerify}
                    disabled={demoLoading}
                    className="btn-saas-primary"
                  >
                    {demoLoading ? '...' : 'Verify'}
                  </button>
                </div>
                <Link to="/verify" className="text-primary font-semibold text-xs no-underline flex items-center gap-2 hover:translate-x-1 transition-transform">
                  Access camera scanner →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="py-32">
        <div className="container-saas">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 block">Process</span>
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">How it works.</h2>
            <p className="text-gray font-light">Three simple phases to secure medicine authenticity for you and your family.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="saas-card text-center p-xl border-none shadow-sm hover:shadow-md">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-gray text-sm font-light leading-relaxed">{step.desc}</p>
                <div className="mt-6 text-primary/10 font-bold text-4xl">{step.num}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gray-50/50">
        <div className="container-saas">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 block">Global Network</span>
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Full-stack Integrity.</h2>
            <p className="text-gray font-light">More than just a scan. A complete ecosystem for supply chain security.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="saas-card border-none shadow-sm hover:translate-y-[-8px]">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="text-md font-bold mb-2 uppercase tracking-wide">{f.title}</h3>
                <p className="text-gray text-sm font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-dark text-white">
        <div className="container-saas">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-6 block">The Problem</span>
              <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Protecting the global <br />health ecosystem.</h2>
              <p className="text-lg text-white/60 font-light mb-10">
                Pharmaceutical crime is a multi-billion dollar illicit industry with fatal consequences. We bridge the trust gap.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter end={35} suffix="%" />
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Risk Mitigation</p>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter end={200} suffix="K+" />
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Lives Impacted</p>
                </div>
              </div>
            </div>
            
            <div className="saas-card bg-white/5 border-white/10 p-10 backdrop-blur-md">
              <h3 className="text-xs font-bold text-white/80 mb-8 uppercase tracking-widest flex justify-between">
                Telemetry 
                <span className="text-primary font-extrabold">Live</span>
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={globalData}>
                  <XAxis dataKey="year" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ background: '#111', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                  />
                  <Line type="monotone" dataKey="cases" stroke="#2563EB" strokeWidth={4} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-8 flex justify-between text-white/20 text-[8px] font-bold uppercase tracking-widest">
                <span>Ref: Node_2.4.9</span>
                <span>Active Protection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="container-saas text-center">
          <div className="w-16 h-16 bg-primary/5 rounded-[24px] flex items-center justify-center text-3xl mx-auto mb-8">🛡️</div>
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Ready to verify?</h2>
          <p className="text-lg text-gray font-light mb-10 mx-auto">Join the secure network and ensure your medicine is genuine in seconds.</p>
          <Link to="/verify" className="btn-saas-primary px-12 py-4 no-underline">
            Initiate Scan Now
          </Link>
        </div>
      </section>
    </div>
  );
}
