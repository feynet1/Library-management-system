import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import Table from '../../components/ui/Table';
import { fetchAllTransactions } from '../../lib/admin';
import { returnBook } from '../../lib/librarian';
import { supabase } from '../../supabase';

const statusStyles = {
    issued:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    overdue:  'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
};

const fmt = (iso) => iso ? new Date(iso).toLocaleDateString() : '—';

const Transactions = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [returningId, setReturningId] = useState(null);

    const loadTxns = useCallback(async () => {
        const result = await fetchAllTransactions();
        if (result.error) setError('Failed to load transactions.');
        else setData(result.data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async () => { await loadTxns(); })();

        const channel = supabase
            .channel('admin-txns')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, loadTxns)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [loadTxns]);

    const handleMarkReturned = async (row) => {
        setReturningId(row.id);
        const { error: retError } = await returnBook(row.id, row.books?.id);
        if (retError) {
            setError(`Failed to return book: ${retError.message}`);
        } else {
            await loadTxns();
        }
        setReturningId(null);
    };

    const columns = [
        { key: 'student', label: 'Student', render: (row) => row.profiles?.full_name || '—' },
        { key: 'book', label: 'Book', render: (row) => row.books?.title || '—' },
        { key: 'issueDate', label: 'Issue Date', render: (row) => fmt(row.issued_at) },
        { key: 'returnDate', label: 'Return Date', render: (row) => row.returned_at ? fmt(row.returned_at) : fmt(row.due_date) },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[row.status] || ''}`}>
                    {row.status}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => {
                if (row.status === 'returned') return <span className="text-xs text-gray-400 dark:text-gray-600">—</span>;
                return (
                    <button
                        onClick={() => handleMarkReturned(row)}
                        disabled={returningId === row.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/10 dark:bg-secondary/20 text-secondary hover:bg-secondary/20 dark:hover:bg-secondary/30 transition-all duration-200 disabled:opacity-50"
                        aria-label={`Mark ${row.books?.title} as returned`}
                    >
                        {returningId === row.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <CheckCircle className="w-3.5 h-3.5" />
                        }
                        Mark Returned
                    </button>
                );
            },
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text dark:text-slate-100">Transactions</h2>
                <span className="text-sm text-gray-400 dark:text-gray-500">{data.length} total</span>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                </div>
            )}

            <Table columns={columns} data={data} isLoading={isLoading} />
        </div>
    );
};

export default Transactions;
