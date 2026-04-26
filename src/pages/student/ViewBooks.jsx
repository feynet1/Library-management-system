import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Table from '../../components/ui/Table';
import { fetchBooks } from '../../lib/student';
import { supabase } from '../../supabase';

const columns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' },
    {
        key: 'availability',
        label: 'Availability',
        render: (row) => {
            const isAvail = row.available_copies > 0;
            return (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isAvail
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                }`}>
                    {isAvail ? 'Available' : 'Out of Stock'}
                </span>
            );
        },
    },
];

const ViewBooks = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const loadBooks = useCallback(async () => {
        const result = await fetchBooks();
        if (result.error) setError(result.error.message);
        else setData(result.data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async () => { await loadBooks(); })();

        const channel = supabase
            .channel('student-view-books')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, loadBooks)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [loadBooks]);

    const categories = useMemo(() => {
        return ['All', ...new Set(data.map((b) => b.category).filter(Boolean))];
    }, [data]);

    const filteredData = selectedCategory === 'All'
        ? data
        : data.filter((book) => book.category === selectedCategory);

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-text dark:text-slate-100">View Books</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{filteredData.length} books found</p>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Category:
                    </label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-text dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        aria-label="Filter by category"
                    >
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                </div>
            )}

            <Table columns={columns} data={filteredData} isLoading={isLoading} emptyMessage="No books found." />
        </div>
    );
};

export default ViewBooks;
