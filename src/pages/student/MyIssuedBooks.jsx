import React, { useState, useEffect, useCallback } from 'react';
import Table from '../../components/ui/Table';
import { fetchMyTransactions } from '../../lib/student';
import { supabase } from '../../supabase';
import useAuth from '../../hooks/useAuth';

const statusStyles = {
    returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    issued:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    overdue:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const fmt = (iso) => iso ? new Date(iso).toLocaleDateString() : '—';

const columns = [
    { key: 'title', label: 'Title', render: (row) => row.books?.title || '—' },
    { key: 'author', label: 'Author', render: (row) => row.books?.author || '—' },
    { key: 'issueDate', label: 'Issue Date', render: (row) => fmt(row.issued_at) },
    { key: 'dueDate', label: 'Due Date', render: (row) => fmt(row.due_date) },
    {
        key: 'status',
        label: 'Status',
        render: (row) => (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[row.status] || ''}`}>
                {row.status}
            </span>
        ),
    },
];

const MyIssuedBooks = () => {
    const { session } = useAuth();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTxns = useCallback(async () => {
        if (!session?.user?.id) return;
        const result = await fetchMyTransactions(session.user.id);
        if (result.error) setError(result.error.message);
        else setData(result.data || []);
        setIsLoading(false);
    }, [session]);

    useEffect(() => {
        if (session?.user?.id) {
            (async () => { await loadTxns(); })();

            const channel = supabase
                .channel('student-my-issued')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `student_id=eq.${session.user.id}` }, loadTxns)
                .subscribe();

            return () => supabase.removeChannel(channel);
        }
    }, [session, loadTxns]);

    const overdueCount = data.filter((b) => b.status === 'overdue').length;
    const issuedCount  = data.filter((b) => b.status === 'issued').length;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-text dark:text-slate-100">My Issued Books</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {issuedCount} currently issued · {overdueCount} overdue
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <Table columns={columns} data={[]} isLoading={true} />
            ) : data.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">No issued books found.</div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-soft">
                    <table className="w-full text-sm text-left" role="table" aria-label="My issued books">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    className={`border-b border-gray-100 dark:border-gray-700 transition-colors duration-150 ${
                                        row.status === 'overdue'
                                            ? 'bg-red-50/40 dark:bg-red-950/20 border-l-4 border-l-red-400'
                                            : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/40'
                                    }`}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-5 py-3.5 text-text dark:text-slate-200 whitespace-nowrap">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyIssuedBooks;
