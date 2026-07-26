import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { BurgerMenu } from '@/components/BurgerMenu';
import { CategoryNav } from '@/components/CategoryNav';

const LS_MOBILE = 'StreamsIndia_mobile';
const LS_PLAN = 'StreamsIndia_plan';

const PLANS = [
 { id: 'monthly', label: 'Monthly', price: '₹159', original: '₹318', discount: '50% OFF', desc: 'Unlimited Videos & Web Series' },
 { id: 'quarterly', label: 'Quarterly', price: '₹199', original: '₹398', discount: '50% OFF', desc: 'Unlimited Videos & Web Series' },
];

const PLAN_LABELS: Record<string, string> = {
 monthly: 'Monthly Plan — ₹159/mo',
 quarterly: 'Quarterly Plan — ₹199/qtr',
};

type FlowStep = 'mobile' | 'plan';

export default function Account() {
 const navigate = useNavigate();
 const [mobile, setMobile] = useState('');
 const [plan, setPlan] = useState('');
 const [showFlow, setShowFlow] = useState(false);

 // Flow state
 const [step, setStep] = useState<FlowStep>('mobile');
 const [flowMobile, setFlowMobile] = useState('');
 const [flowPlan, setFlowPlan] = useState('monthly');
 const [mobileError, setMobileError] = useState('');

 useEffect(() => {
 const m = localStorage.getItem(LS_MOBILE);
 const p = localStorage.getItem(LS_PLAN);
 if (m) setMobile(m);
 if (p) setPlan(p);
 }, []);

 const openFlow = () => {
 setStep('mobile');
 setFlowMobile('');
 setFlowPlan('monthly');
 setMobileError('');
 setShowFlow(true);
 };

 const closeFlow = () => setShowFlow(false);

 const handleMobileSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!/^\d{10}$/.test(flowMobile)) {
 setMobileError('Please enter a valid 10-digit mobile number');
 return;
 }
 setMobileError('');
 setStep('plan');
 };

 const handlePlanSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 localStorage.setItem(LS_MOBILE, flowMobile);
 localStorage.setItem(LS_PLAN, flowPlan);
 setMobile(flowMobile);
 setPlan(flowPlan);
 setShowFlow(false);
 };

 const handleSignOut = () => {
 localStorage.removeItem(LS_MOBILE);
 localStorage.removeItem(LS_PLAN);
 setMobile('');
 setPlan('');
 };

 const isLoggedIn = !!mobile;

 return (
 <div className="relative min-h-screen text-gray-200 w-full overflow-x-hidden">
 <AnimatedBackground />
 <BurgerMenu />
 <CategoryNav />

 {/* Header */}
 <div className="relative z-10 w-full bg-black/40 border-b border-white/10 px-6 sm:px-12 py-5 flex items-center pt-[104px] sm:pt-[116px] lg:pt-20">
 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest"
 >
 <ArrowLeft size={14} /> Back to Home
 </button>
 </div>

 <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-12 py-16">

 {/* Title */}
 <div className="text-center mb-12">
 <h1 className="font-bebas text-6xl sm:text-7xl text-white tracking-wide">
 My <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">Account</span>
 </h1>
 </div>

 {isLoggedIn ? (
 /* ── Dashboard ── */
 <motion.div
 className="bg-white/[0.04] rounded-2xl border border-white/10 p-8 sm:p-12 space-y-6"
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 {/* Header */}
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600/30 to-rose-600/20 border border-red-500/30 flex items-center justify-center">
 <User size={26} className="text-red-400" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-white">Dashboard</h2>
 <p className="text-gray-500 font-orbitron text-xs uppercase tracking-widest">Subscriber</p>
 </div>
 </div>

 {/* Info card */}
 <div className="bg-white/5 rounded-xl p-6 border border-white/10">
 <p className="text-white/90 text-lg mb-5">Welcome to your account dashboard.</p>
 <div className="space-y-3">
 <InfoRow label="Mobile" value={`+91 ${mobile}`} />
 {plan && <InfoRow label="Active Plan" value={PLAN_LABELS[plan] ?? plan} highlight />}
 </div>
 </div>

 {/* Active badge */}
 {plan && (
 <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/20 rounded-xl px-5 py-4">
 <CheckCircle size={18} className="text-red-400 shrink-0" />
 <p className="text-red-300 text-sm">Your subscription is active. Enjoy unlimited thriller, crime &amp; drama content.</p>
 </div>
 )}

 <div className="pt-4 border-t border-white/10 text-center">
 <p className="text-white/50 text-sm mb-6">Explore our latest originals and web series.</p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <button
 onClick={() => navigate('/')}
 className="px-6 py-3 btn-neon text-white font-orbitron font-bold uppercase text-xs rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20 tracking-widest"
 >
 Browse Content
 </button>
 <button
 onClick={handleSignOut}
 className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 font-orbitron uppercase text-xs rounded-xl transition-colors tracking-widest"
 >
 <LogOut size={13} /> Sign Out
 </button>
 </div>
 </div>
 </motion.div>

 ) : (
 /* ── Sign In card ── */
 <motion.div
 className="bg-white/[0.04] rounded-2xl border border-white/10 p-8 sm:p-12"
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 <div className="flex items-center gap-4 mb-8">
 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600/30 to-rose-600/20 border border-red-500/30 flex items-center justify-center">
 <User size={26} className="text-red-400" />
 </div>
 <div>
 <h2 className="text-2xl font-bold text-white">Sign In</h2>
 <p className="text-gray-500 font-orbitron text-xs uppercase tracking-widest">Access your account</p>
 </div>
 </div>

 <p className="text-gray-400 text-sm leading-relaxed mb-8">
 Sign in with your registered mobile number to access your subscription and enjoy unlimited content.
 </p>

 <button
 onClick={openFlow}
 className="w-full btn-neon text-white font-bebas font-bold py-4 rounded-xl text-xl tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20"
 >
 Sign In / Subscribe
 </button>

 <p className="text-center text-gray-600 text-xs font-orbitron mt-6 leading-relaxed">
 New here?{' '}
 <button onClick={openFlow} className="text-red-400 hover:underline">
 Subscribe now
 </button>{' '}to get started.
 </p>
 </motion.div>
 )}
 </div>

 <FooterSection />

 {/* ── Subscription / Sign-in Popup Flow ── */}
 <AnimatePresence>
 {showFlow && (
 <motion.div
 className="fixed inset-0 z-[200] flex items-center justify-center p-4"
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 >
 <motion.div
 className="absolute inset-0 bg-black/80 "
 onClick={closeFlow}
 />

 <AnimatePresence mode="wait">

 {/* Step 1 — Mobile */}
 {step === 'mobile' && (
 <motion.div
 key="mobile"
 className="relative glass-panel rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 z-10"
 initial={{ scale: 0.88, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.88, opacity: 0, y: -20 }}
 transition={{ type: 'spring', damping: 28, stiffness: 300 }}
 >
 <button onClick={closeFlow} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
 <X size={22} />
 </button>

 <form onSubmit={handleMobileSubmit}>
 <h3 className="text-2xl font-bebas font-black text-white mb-2 text-center tracking-wide">
 Enter Mobile Number
 </h3>
 <p className="text-gray-500 text-xs font-orbitron text-center uppercase tracking-widest mb-6">
 Sign in or subscribe
 </p>

 <div className="mb-6">
 <label className="block text-gray-400 text-[10px] font-orbitron uppercase tracking-widest mb-2">
 Mobile Number
 </label>
 <div className="flex rounded-xl border border-white/15 overflow-hidden bg-white/5 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all">
 <div className="flex items-center px-4 border-r border-white/15 text-gray-300 text-sm font-orbitron font-semibold select-none">
 +91
 </div>
 <input
 type="tel"
 placeholder="10-digit mobile number"
 maxLength={10}
 value={flowMobile}
 onChange={e => { setFlowMobile(e.target.value.replace(/\D/g, '')); setMobileError(''); }}
 className="w-full px-4 py-3.5 text-sm text-white placeholder-gray-600 bg-transparent focus:outline-none"
 inputMode="numeric"
 autoFocus
 required
 />
 </div>
 {mobileError && <p className="text-red-400 text-xs mt-2 font-orbitron">{mobileError}</p>}
 </div>

 <button
 type="submit"
 className="w-full btn-neon text-white font-bebas font-bold py-3.5 rounded-xl text-lg tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
 >
 Continue
 </button>
 </form>
 </motion.div>
 )}

 {/* Step 2 — Plan */}
 {step === 'plan' && (
 <motion.div
 key="plan"
 className="relative glass-panel rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 z-10"
 initial={{ scale: 0.88, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.88, opacity: 0, y: -20 }}
 transition={{ type: 'spring', damping: 28, stiffness: 300 }}
 >
 <button onClick={closeFlow} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
 <X size={22} />
 </button>

 <form onSubmit={handlePlanSubmit}>
 <h3 className="text-2xl font-bebas font-black text-white mb-2 text-center tracking-wide">
 Choose Your Plan
 </h3>
 <p className="text-center mb-5 text-gray-500 text-xs font-orbitron uppercase tracking-widest">
 Mobile: <span className="text-red-400 font-bold">+91 {flowMobile}</span>
 </p>

 <div className="space-y-3 mb-6">
 {PLANS.map(p => (
 <label
 key={p.id}
 className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
 flowPlan === p.id
 ? 'border-red-500 bg-red-500/10'
 : 'border-white/10 bg-white/5 hover:border-red-500/40'
 }`}
 >
 <input
 type="radio"
 name="plan"
 value={p.id}
 checked={flowPlan === p.id}
 onChange={() => setFlowPlan(p.id)}
 className="mt-0.5 mr-3 accent-red-600"
 />
 <div className="flex-1">
 <div className="flex items-center flex-wrap gap-2">
 <span className="font-bebas text-lg text-white tracking-wide">{p.label}</span>
 <span className="font-bold text-red-400">{p.price}</span>
 <span className="line-through text-gray-600 text-sm">{p.original}</span>
 <span className="text-green-400 text-xs font-orbitron font-bold">{p.discount}</span>
 </div>
 <p className="text-xs text-gray-500 font-orbitron mt-1">{p.desc}</p>
 </div>
 </label>
 ))}
 </div>

 <button
 type="submit"
 className="w-full btn-neon text-white font-bebas font-bold py-3.5 rounded-xl text-lg tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
 >
 Confirm &amp; Sign In
 </button>
 </form>
 </motion.div>
 )}

 </AnimatePresence>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
 return (
 <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
 <span className="text-gray-500 font-orbitron text-[10px] uppercase tracking-widest">{label}</span>
 <span className={`text-sm font-medium ${highlight ? 'text-red-400' : 'text-gray-200'}`}>{value}</span>
 </div>
 );
}
