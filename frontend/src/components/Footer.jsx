import { Link } from 'react-router-dom';

const links = [
  { path: '/', label: 'Home' },
  { path: '/verify', label: 'Verify' },
  { path: '/help', label: 'Help' },
  { path: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-[var(--spacing-fluid-xl)] pb-[var(--spacing-fluid-lg)] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-[var(--spacing-fluid-md)] lg:px-[var(--spacing-fluid-lg)] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-fluid-lg)] mb-[var(--spacing-fluid-xl)]">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-8 no-underline group">
              <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">AuthenTick</span>
            </Link>
            <p className="text-gray-light/50 leading-relaxed text-fluid-sm font-medium">
              Architecting a secure future for global medicine distribution through immutable digital verification protocols.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {links.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-gray-light/70 hover:text-white transition-colors no-underline text-fluid-sm font-bold">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8">Intelligence</h4>
            <ul className="space-y-5 text-fluid-sm font-medium">
              {[
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'ayushgilhotra70@gmail.com' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Chandigarh, India' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-4 group/item">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={item.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-gray-light/70 group-hover/item:text-white transition-colors">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8">Security Updates</h4>
            <div className="flex bg-white/5 backdrop-blur-md rounded-xl p-1.5 border border-white/10 group focus-within:border-primary/50 transition-all focus-within:bg-white/[0.08]">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-none outline-none text-fluid-xs px-4 flex-1 text-white placeholder:text-white/20 font-bold"
              />
              <button className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <p className="text-[10px] text-white/20 font-bold uppercase mt-4 ml-1 tracking-widest">Encrypted communication channel</p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-fluid-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} AuthenTick Intelligence. Designed by <span className="text-white/40">Ayush Gilhotra</span>
          </p>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }} className="text-fluid-xs font-bold uppercase tracking-widest text-white/20">
            {['Security', 'Privacy', 'Framework'].map((item, i) => (
              <a key={item} href="#" className="hover:text-primary transition-colors no-underline" style={{ marginLeft: i === 0 ? '0' : '48px' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
