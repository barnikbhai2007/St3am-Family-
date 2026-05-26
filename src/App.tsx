/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { WebAppUser } from './types';

export default function App() {
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Artificial small delay for aesthetic entry animation if loading is instant
    const timer = setTimeout(() => setLoading(false), 800);

    const initTelegram = () => {
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();     // Tells Telegram the app is ready
        webApp.expand();    // Expands the mini app to full height

        const initDataUser = webApp.initDataUnsafe?.user;
        if (initDataUser) {
          setUser(initDataUser);
          setError('');
        } else {
          setError('We could not retrieve your Telegram profile. Please make sure to open this app directly inside a Telegram chat.');
        }
      } else {
        setError('Telegram Web App engine not detected.');
      }
    };

    // Attempt to initialize straight away
    initTelegram();

    return () => clearTimeout(timer);
  }, []);

  const loadMockData = () => {
    setUser({
      id: 987654321,
      first_name: 'Alex',
      last_name: 'Developer',
      username: 'alex_dev',
      language_code: 'en',
      is_premium: true,
      photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=141414',
    });
    setError('');
  };

  if (loading) {
    return (
       <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4">
         <Loader2 className="w-10 h-10 text-[#0088cc] animate-spin" />
         <p className="text-[#888] font-sans text-[10px] tracking-[0.2em] uppercase font-semibold">Initializing Protocol...</p>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden border-[#222]">
      {user ? (
        <div className="flex flex-col md:grid md:grid-cols-[80px_1.5fr_1fr] min-h-screen md:min-h-[100dvh]">
          {/* RAIL */}
          <div className="hidden md:flex flex-col justify-between items-center py-10 border-r border-[#222]">
             <div className="[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.5em] text-[10px] text-[#888] font-semibold">
               Telegram Auth Protocol
             </div>
             <div className="[writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.5em] text-[10px] text-[#888] font-semibold">
               2024 Edition
             </div>
          </div>

          {/* MAIN DISPLAY */}
          <div className="flex flex-col justify-between p-8 md:p-16 relative">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#0088cc] font-extrabold mb-12">
              Session ID: TX-{user.id.toString().substring(0, 3)}-ALPHA
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               className="mt-4 mb-20"
            >
               <h1 className="font-serif text-[60px] md:text-[84px] leading-[0.9] m-0 font-normal tracking-tight">
                 {user.first_name}<br/>{user.last_name || ''}
               </h1>
               <div className="font-sans text-xl md:text-2xl font-light text-[#888] mt-6">
                 @{user.username || user.id}
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3, duration: 0.6 }}
               className="mt-auto grid grid-cols-2 gap-y-10 gap-x-6 border-t border-[#222] pt-10"
            >
               <div>
                 <div className="text-[10px] uppercase tracking-[0.1em] text-[#888] mb-2 font-semibold">Language</div>
                 <div className="text-sm font-normal">{user.language_code ? (user.language_code.toUpperCase() + ' Locale') : 'Unknown'}</div>
               </div>
               <div>
                 <div className="text-[10px] uppercase tracking-[0.1em] text-[#888] mb-2 font-semibold">Profile ID</div>
                 <div className="text-sm font-normal">{user.id}</div>
               </div>
               <div>
                 <div className="text-[10px] uppercase tracking-[0.1em] text-[#888] mb-2 font-semibold">Verification</div>
                 <div className="text-sm font-normal flex items-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] mr-2 block"></span>
                   Telegram Connected
                 </div>
               </div>
               <div>
                 <div className="text-[10px] uppercase tracking-[0.1em] text-[#888] mb-2 font-semibold">Status</div>
                 <div className="text-sm font-normal">{user.is_premium ? 'Premium' : 'Standard'}</div>
               </div>
            </motion.div>
          </div>

          {/* SIDE PANEL */}
          <div className="bg-[#141414] p-8 md:p-12 border-t md:border-t-0 md:border-l border-[#222] flex flex-col">
            <div className="self-start inline-flex items-center px-3 py-1 rounded-full bg-[#0088cc]/10 border border-[#0088cc] text-[#0088cc] text-[10px] font-semibold uppercase tracking-wider mb-12">
              Identity Verified
            </div>

            <div className="mb-12">
              <h3 className="font-serif text-lg mb-4 italic text-white font-normal">Digital Identity</h3>
              <p className="text-sm leading-[1.7] text-[#888] m-0 font-light">
                Your Telegram profile has been successfully handshake-authenticated. This dashboard reflects your verified cross-platform credentials via the secure layer.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="font-serif text-lg mb-4 italic text-white font-normal">Profile Asset</h3>
              {user.photo_url ? (
                <img src={user.photo_url} alt="Profile" className="w-20 h-20 rounded-md object-cover border border-[#333] grayscale sm:grayscale-0" />
              ) : (
                <div className="w-20 h-20 rounded-md border border-[#333] flex items-center justify-center bg-[#111] text-[#666] font-serif text-2xl italic">
                  {user.first_name.charAt(0)}{user.last_name?.charAt(0)}
                </div>
              )}
            </div>

            <div className="mt-auto flex items-center gap-4 border border-[#333] p-4 rounded-md bg-[#0A0A0A]">
               <div className="w-5 h-5 bg-white [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]"></div>
               <div>
                  <div className="text-[11px] font-semibold tracking-wider">DEPLOYED ON VERCEL</div>
                  <div className="text-[10px] text-[#666] mt-0.5">telegram-auth-protocol</div>
               </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 text-center bg-[#0A0A0A]">
           <div className="max-w-md w-full border border-[#222] bg-[#141414] p-8 md:p-10 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-[#ff4444]"></div>
             <h2 className="font-serif text-2xl mb-4 italic text-white font-normal text-left">Authentication Required</h2>
             <p className="text-[#888] text-sm mb-10 leading-relaxed text-left font-light">
               {error || 'We could not retrieve your authenticated Telegram profile. This interface must be accessed via a Telegram Web App session.'}
             </p>
             <div className="border border-[#222] p-6 bg-[#0A0A0A] text-left">
               <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#0088cc] font-semibold mb-3">Developer Tools</h3>
               <p className="text-xs text-[#666] mb-5 leading-relaxed font-light">
                 If you are previewing this in a standard browser, you may inject a bypass token to preview the dashboard.
               </p>
               <button 
                 onClick={loadMockData}
                 className="w-full bg-white hover:bg-[#eee] text-black font-semibold py-3 px-4 transition-colors text-[11px] tracking-wider uppercase cursor-pointer"
               >
                 Inject Mock Session
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
