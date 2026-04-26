import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Table from '../../components/ui/Table';
import { fetchBooks } from '../../lib/librarian';
import { supabase } from '../../supabase';

const columns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' },
    { key: 'total_copies', label: 'Total Qty' },
    { key: 'available_copies', label: 'Available Qty' },
    {
        key: 'status',
        label: 'Status',
        render: (row) => {
            const isAvailable = row.available_copies > 0;
            return (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isAvailable
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                }`}>
                    {isAvailable ? 'Available' : 'Out of Stock'}
                </span>
            );
        },
    },
    {
        key: 'actions',
        label: 'Actions',
        render: (row, onAction) => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onAction?.('edit', row)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
                    aria-label={`Edit ${row.title}`}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onAction?.('delete', row)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200"
                    aria-label={`Delete ${row.title}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
    },
];

const ViewBooks = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadBooks = useCallback(async () => {
        const result = await fetchBooks();
        if (result.error) setError('Failed to load books.');
        else setData(result.data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async () => { await loadBooks(); })();

        const channel = supabase
            .channel('admin-books')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, loadBooks)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [loadBooks]);

    const handleAction = (action, row) => {
        if (action === 'edit') alert(`Editing "${row.title}" is not yet implemented.`);
        if (action === 'delete') alert(`Deleting "${row.title}" is not yet implemented.`);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text dark:text-slate-100">View Books</h2>
                <span className="text-sm text-gray-400 dark:text-gray-500">{data.length} total</span>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                </div>
            )}

            <Table columns={columns} data={data} isLoading={isLoading} onAction={handleAction} />
        </div>
    );
};

export default ViewBooks;
