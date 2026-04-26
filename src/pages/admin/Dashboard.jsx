import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, GraduationCap, BookMarked } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import { fetchAdminStats } from '../../lib/admin';
import { supabase } from '../../supabase';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalBooks: 0, totalStudents: 0, issuedBooks: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadStats = useCallback(async () => {
        const result = await fetchAdminStats();
        if (result.error) setError('Failed to load stats.');
        else setStats(result);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async () => { await loadStats(); })();

        const booksSub = supabase
            .channel('admin-dash-books')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, loadStats)
            .subscribe();

        const profilesSub = supabase
            .channel('admin-dash-profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadStats)
            .subscribe();

        const txnSub = supabase
            .channel('admin-dash-txns')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, loadStats)
            .subscribe();

        return () => {
            supabase.removeChannel(booksSub);
            supabase.removeChannel(profilesSub);
            supabase.removeChannel(txnSub);
        };
    }, [loadStats]);

    const statCards = [
        { id: 1, label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'primary' },
        { id: 2, label: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'secondary' },
        { id: 3, label: 'Total Issued Books', value: stats.issuedBooks, icon: BookMarked, color: 'amber' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-text dark:text-slate-100 mb-6">Overview</h2>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                <div className="space-y-2">
                                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {statCards.map((s) => (
                        <StatsCard key={s.id} icon={s.icon} label={s.label} value={s.value} color={s.color} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
