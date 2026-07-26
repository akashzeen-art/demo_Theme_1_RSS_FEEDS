// SubscriptionFlow — Mobile → Plan → Video (3-step flow)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SubscriptionFlowProps {
  videoUrl: string | null;
  title?: string;
  thumbnail?: string;
  onClose: () => void;
}

type Step = 'mobile' | 'plan' | 'video';

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹159',
    original: '₹318',
    discount: '50% OFF',
    desc: 'Unlimited Videos & Web Series',
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: '₹199',
    original: '₹398',
    discount: '50% OFF',
    desc: 'Unlimited Videos & Web Series',
  },
];

const LS_MOBILE = 'StreamsIndia_mobile';
const LS_PLAN = 'StreamsIndia_plan';

export function SubscriptionFlow({
  videoUrl,
  title,
  thumbnail,
  onClose,
}: SubscriptionFlowProps) {
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [plan, setPlan] = useState('monthly');
  const [mobileError, setMobileError] = useState('');

  useEffect(() => {
    if (!videoUrl) return;
    const savedMobile = localStorage.getItem(LS_MOBILE);
    const savedPlan = localStorage.getItem(LS_PLAN);
    if (savedMobile && savedPlan) {
      setMobile(savedMobile);
      setPlan(savedPlan);
      setStep('video');
    } else {
      setStep('mobile');
    }
  }, [videoUrl]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!videoUrl) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [videoUrl]);

  const handleClose = () => {
    setMobileError('');
    onClose();
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    setMobileError('');
    setStep('plan');
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(LS_MOBILE, mobile);
    localStorage.setItem(LS_PLAN, plan);
    setStep('video');
  };

  return (
    <AnimatePresence>
      {videoUrl && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/85"
            onClick={handleClose}
          />

          <AnimatePresence mode="wait">
            {/* ── Step 1: Mobile Number ── */}
            {step === 'mobile' && (
              <motion.div
                key="mobile"
                className="relative glass-panel rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-0 sm:mx-4 z-10 overflow-hidden max-h-[92dvh] overflow-y-auto"
                initial={{ scale: 0.96, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: -16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400" />
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <form onSubmit={handleMobileSubmit}>
                  <h3 className="text-2xl font-bebas font-black text-white mb-6 text-center tracking-wide pr-8">
                    <span className="gradient-text">Enter Mobile Number</span>
                  </h3>

                  <div className="mb-6">
                    <label
                      htmlFor="mobileInput"
                      className="block text-gray-400 text-sm font-orbitron uppercase tracking-widest mb-2"
                    >
                      Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-red-500/20 overflow-hidden bg-white/5 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent">
                      <div className="flex items-center px-4 border-r border-white/15 bg-white/8 text-gray-300 text-sm font-orbitron font-semibold select-none">
                        +91
                      </div>
                      <input
                        type="tel"
                        id="mobileInput"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, ''));
                          setMobileError('');
                        }}
                        className="w-full px-3 py-3.5 text-base sm:text-xs text-white placeholder-gray-600 bg-transparent focus:outline-none"
                        required
                        inputMode="numeric"
                        pattern="\d{10}"
                        autoComplete="tel"
                      />
                    </div>
                    {mobileError && (
                      <p className="text-red-400 text-xs mt-1.5 font-orbitron">
                        {mobileError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-neon w-full text-white font-bebas font-bold py-3.5 px-6 rounded-xl text-lg tracking-widest"
                  >
                    Subscribe Now
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Plan Selection ── */}
            {step === 'plan' && (
              <motion.div
                key="plan"
                className="relative glass-panel rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-0 sm:mx-4 z-10 overflow-hidden max-h-[92dvh] overflow-y-auto"
                initial={{ scale: 0.96, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: -16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-red-600 to-rose-500" />
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <form onSubmit={handlePlanSubmit}>
                  <h3 className="text-2xl font-bebas font-black text-white mb-4 text-center tracking-wide pr-8">
                    <span className="gradient-text">Choose Your Plan</span>
                  </h3>

                  <div className="text-center mb-5 text-gray-500 text-xs font-orbitron uppercase tracking-widest">
                    Mobile:{' '}
                    <span className="text-red-400 font-bold">+91 {mobile}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {PLANS.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          plan === p.id
                            ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                            : 'border-white/10 bg-white/5 hover:border-red-500/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          checked={plan === p.id}
                          onChange={() => setPlan(p.id)}
                          className="mt-0.5 mr-3 accent-red-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-bebas text-lg text-white tracking-wide">
                              {p.label}
                            </span>
                            <span className="font-bold text-red-400">{p.price}</span>
                            <span className="line-through text-gray-600 text-sm">
                              {p.original}
                            </span>
                            <span className="text-green-400 text-xs font-orbitron font-bold">
                              {p.discount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-orbitron mt-1">
                            {p.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn-neon w-full text-white font-bebas font-bold py-3.5 px-6 rounded-xl text-lg tracking-widest"
                  >
                    Continue to Watch
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: Video Player (mobile-safe full stage) ── */}
            {step === 'video' && (
              <motion.div
                key="video"
                className="relative z-10 w-full h-[100dvh] sm:h-auto sm:max-h-[min(92dvh,900px)] sm:max-w-3xl sm:rounded-2xl overflow-hidden bg-black border-0 sm:border sm:border-red-500/30 sm:shadow-2xl sm:shadow-red-500/20 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              >
                <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-black/95 border-b border-white/10 shrink-0">
                  <div className="min-w-0 flex-1">
                    {title && (
                      <p className="text-white font-bebas text-base sm:text-xl truncate">
                        {title}
                      </p>
                    )}
                    <p className="text-gray-500 text-[10px] font-orbitron mt-0.5 truncate">
                      +91 {mobile} · {PLANS.find((p) => p.id === plan)?.label} Plan
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="shrink-0 p-2.5 rounded-full bg-white/10 border border-white/20 text-white active:bg-white/20"
                    aria-label="Close player"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative flex-1 min-h-0 w-full bg-black flex items-center justify-center">
                  <div className="w-full h-full sm:h-auto sm:aspect-video max-h-full">
                    <video
                      key={videoUrl}
                      src={videoUrl}
                      autoPlay
                      controls
                      playsInline
                      poster={thumbnail}
                      className="w-full h-full object-contain bg-black"
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
