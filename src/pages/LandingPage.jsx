import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
    Library,
    BookOpen,
    Users,
    GraduationCap,
    ArrowRight,
    Search,
    ArrowLeftRight,
    ShieldCheck,
    BookPlus,
    BookCheck,
    ChevronDown,
    Star,
    Sun,
    Moon,
    Sparkles
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { supabase } from '../supabase';

/* ─── Animation Variants ───────────────────────────────────────── */
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

/* ─── Animated counter ─────────────────────────────────────────── */
const Counter = ({ target, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, isInView]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

/* ─── Role card ─────────────────────────────────────────────────── */
const RoleCard = ({ icon, title, description, color, features, path, navigate }) => {
    const RoleIcon = icon;
    const colorMap = {
        primary: {
            bg: 'bg-primary/10 dark:bg-primary/20',
            text: 'text-primary',
            border: 'border-primary/20 dark:border-primary/30',
            btn: 'bg-primary text-white hover:shadow-primary/30',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)]',
            dot: 'bg-primary',
        },
        secondary: {
            bg: 'bg-secondary/10 dark:bg-secondary/20',
            text: 'text-secondary',
            border: 'border-secondary/20 dark:border-secondary/30',
            btn: 'bg-secondary text-white hover:shadow-secondary/30',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]',
            dot: 'bg-secondary',
        },
        amber: {
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-700/40',
            btn: 'bg-amber-500 text-white hover:shadow-amber-500/30',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)]',
            dot: 'bg-amber-500',
        },
    };
    const c = colorMap[color];

    return (
        <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative bg-white/60 dark:bg-gray-800/50 backdrop-blur-2xl rounded-[2rem] p-8 shadow-soft border ${c.border} flex flex-col gap-6 transition-all duration-300 group overflow-hidden ${c.glow}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/40 to-transparent dark:from-white/5 pointer-events-none rounded-bl-full" />
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${c.bg} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                <RoleIcon className={`w-8 h-8 ${c.text}`} />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-text dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{description}</p>
            </div>
            <ul className="space-y-3 flex-1 mt-2">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot} shadow-sm`} />
                        {f}
                    </li>
                ))}
            </ul>
            <button
                onClick={() => navigate(path)}
                className={`mt-4 w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${c.btn}`}
            >
                Enter {title} Portal <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
        </motion.div>
    );
};

/* ─── Feature item ──────────────────────────────────────────────── */
const FeatureItem = ({ icon, title, description }) => {
    const FeatureIcon = icon;
    return (
        <motion.div variants={fadeInUp} className="flex gap-5 items-start group p-5 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 border border-primary/10 shadow-sm">
                <FeatureIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-text dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{description}</p>
            </div>
        </motion.div>
    );
};

/* ─── Stat item ─────────────────────────────────────────────────── */
const StatItem = ({ value, label }) => (
    <motion.div variants={fadeInUp} className="text-center relative p-6">
        <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
        <p className="text-5xl font-black text-white drop-shadow-md mb-2 relative z-10">
            <Counter target={value} />
        </p>
        <p className="text-sm text-indigo-200 font-bold tracking-widest uppercase relative z-10">{label}</p>
    </motion.div>
);

/* ─── Main Landing Page ─────────────────────────────────────────── */
const LandingPage = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [stats, setStats] = useState({ books: 1248, students: 534, issued: 87, librarians: 12 });
    
    // Parallax effect for hero section
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    { count: booksCount },
                    { count: studentsCount },
                    { count: issuedCount },
                    { count: librariansCount },
                ] = await Promise.all([
                    supabase.from('books').select('*', { count: 'exact', head: true }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
                    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'issued'),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'librarian'),
                ]);

                setStats({
                    books: booksCount || 0,
                    students: studentsCount || 0,
                    issued: issuedCount || 0,
                    librarians: librariansCount || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    const roles = [
        {
            icon: ShieldCheck,
            title: 'Admin',
            description: 'Full control over the library system. Manage users, books, and monitor all transactions centrally.',
            color: 'primary',
            path: '/admin/dashboard',
            features: [
                'Manage system users',
                'View entire catalog',
                'Monitor transactions',
                'System analytics',
            ],
        },
        {
            icon: Library,
            title: 'Librarian',
            description: 'Day-to-day library operations. Handle book inventory, issue and return books effortlessly.',
            color: 'secondary',
            path: '/librarian/dashboard',
            features: [
                'Manage inventory',
                'Issue to students',
                'Process returns',
                'Track overdues',
            ],
        },
        {
            icon: GraduationCap,
            title: 'Student',
            description: 'Explore the library catalog, track your issued books, and stay on top of due dates.',
            color: 'amber',
            path: '/student/dashboard',
            features: [
                'Browse catalog',
                'View issued books',
                'Search resources',
                'Track due dates',
            ],
        },
    ];

    const features = [
        { icon: BookOpen, title: 'Comprehensive Catalog', description: 'Browse over 1,200 books across all genres and subjects with high-res covers.' },
        { icon: BookPlus, title: 'Lightning Fast Issuing', description: 'Librarians can issue books to students in just a few clicks. No more paper logs.' },
        { icon: BookCheck, title: 'Automated Returns', description: 'Streamlined return process with automatic due-date tracking and reminders.' },
        { icon: Search, title: 'Deep Search', description: 'Find any book instantly by title, author, category, or even ISBN.' },
        { icon: ArrowLeftRight, title: 'Audit Trails', description: 'Full historical audit trail of every issue, return, and inventory change.' },
        { icon: Users, title: 'Role-Based Access', description: 'Secure, dedicated dashboards tailored specifically for admins, librarians, and students.' },
    ];

    return (
        <div className="min-h-screen bg-background dark:bg-gray-950 font-sans antialiased text-text dark:text-slate-100 transition-colors duration-500 overflow-x-hidden selection:bg-primary/30 selection:text-primary">

            {/* ── Navbar ── */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Library className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-text dark:text-white">LibraryMS</span>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-text dark:hover:text-white rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-text dark:bg-white dark:text-gray-900 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-32 pb-24 overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-blob pointer-events-none" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/20 dark:bg-secondary/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000 pointer-events-none" />
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000 pointer-events-none" />

                <motion.div 
                    style={{ y: yHero, opacity: opacityHero }}
                    className="max-w-5xl mx-auto text-center relative z-10"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-primary dark:text-indigo-400 text-sm font-bold px-5 py-2 rounded-full mb-8 border border-white/40 dark:border-gray-700/50 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        Next-Generation Library Management
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-6xl sm:text-7xl lg:text-8xl font-black text-text dark:text-white leading-[1.1] mb-8 tracking-tight"
                    >
                        Your Library, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Organized</span> &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-emerald-400">Accessible</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
                    >
                        A beautifully engineered platform connecting admins, librarians, and students. Making book management effortless from catalog to return.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5"
                    >
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-indigo-500 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 shadow-xl shadow-primary/25"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-text dark:text-white text-lg font-bold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-sm"
                        >
                            Sign In
                        </button>
                    </motion.div>
                </motion.div>
                
                {/* Scroll indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
                >
                    <span className="text-xs font-bold tracking-widest uppercase">Scroll</span>
                    <motion.div 
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Stats Banner ── */}
            <section className="relative px-6 py-20 bg-text dark:bg-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-50" />
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 relative z-10"
                >
                    <StatItem value={stats.books} label="Books in Catalog" />
                    <StatItem value={stats.students} label="Registered Students" />
                    <StatItem value={stats.issued} label="Books Issued" />
                    <StatItem value={stats.librarians} label="Librarians Active" />
                </motion.div>
            </section>

            {/* ── Role Portals ── */}
            <section className="px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-text dark:text-white mb-6">Built for Everyone</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                            Tailored dashboards ensuring admins, librarians, and students have exactly the tools they need.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {roles.map((role) => (
                            <RoleCard key={role.title} {...role} navigate={navigate} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="px-6 py-32 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200/50 dark:border-gray-800/50 relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-text dark:text-white mb-6">Everything You Need</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                            A complete suite of tools designed to modernize your library workflow from top to bottom.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((f) => (
                            <FeatureItem key={f.title} {...f} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="px-6 py-32">
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-text dark:text-white mb-6">How It Flows</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                            Three simple steps to establish a fully digital, automated library ecosystem.
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connector line (desktop) */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full z-0 opacity-50" />

                        {[
                            { step: '01', title: 'Setup & Onboard', desc: 'Admins configure the system, register librarians, and bulk-import the book catalog.' },
                            { step: '02', title: 'Daily Operations', desc: 'Librarians seamlessly issue books, manage returns, and track inventory in real-time.' },
                            { step: '03', title: 'Student Access', desc: 'Students browse digital shelves, check availability, and monitor their due dates.' },
                        ].map(({ step, title, desc }, index) => (
                            <motion.div 
                                key={step} 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="relative z-10 flex flex-col items-center text-center gap-6"
                            >
                                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-indigo-600">{step}</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-text dark:text-white mb-3">{title}</h4>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="px-6 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-700" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <Library className="w-16 h-16 text-white/90 mx-auto mb-8 drop-shadow-lg" />
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
                        Ready to digitize your library?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join hundreds of modern institutions already using LibraryMS to streamline their daily operations and empower their students.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-primary text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 shadow-2xl"
                        >
                            Create an Account <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-6 py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Library className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-text dark:text-white">LibraryMS</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Library Management System. Crafted with care.
                    </p>
                    <div className="flex items-center gap-6 text-sm font-bold text-gray-600 dark:text-gray-400">
                        <button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Sign In</button>
                        <button onClick={() => navigate('/signup')} className="hover:text-primary transition-colors">Sign Up</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
