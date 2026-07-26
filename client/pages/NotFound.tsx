import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const NotFound = () => {
 const location = useLocation();

 useEffect(() => {
 console.error("404 Error: User attempted to access non-existent route:", location.pathname);
 }, [location.pathname]);

 return (
 <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
 <AnimatedBackground />
 <div className="relative z-10 text-center px-6">
 <p className="text-red-500 font-orbitron text-xs uppercase tracking-[0.35em] mb-3">Error</p>
 <h1 className="font-bebas text-8xl text-white tracking-wide mb-2">404</h1>
 <p className="text-gray-400 mb-8">This page isn’t in our catalog.</p>
 <Link
 to="/"
 className="inline-block px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-orbitron text-xs uppercase tracking-widest transition-colors"
 >
 Back to Home
 </Link>
 </div>
 </div>
 );
};

export default NotFound;
