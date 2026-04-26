import React, { useState, useEffect, useCallback } from 'react';
import { Search, LayoutGrid, List, Loader2 } from 'lucide-react';
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

const SearchBooks = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table');

    const loadBooks = useCallback(async () => {
        const result = await fetchBooks();
        if (result.error) setError(result.error.message);
        else setData(result.data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async () => { await loadBooks(); })();

        const channel = supabase
            .channel('student-search-books')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, loadBooks)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [loadBooks]);

    const filteredData = data.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-text dark:text-slate-100">Search Books</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Find books by title or author</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' : 'text-gray-400 hover:text-text dark:hover:text-slate-200'}`}
                        aria-label="Table view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'card' ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' : 'text-gray-400 hover:text-text dark:hover:text-slate-200'}`}
                        aria-label="Card view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Search Input */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                    {error}
                </div>
            )}
            <div className="mb-6">
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl px-4 py-3 gap-3 border border-gray-200 dark:border-gray-700 shadow-soft focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm text-text dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full"
                        aria-label="Search books by title or author"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-text dark:hover:text-slate-200 transition-colors text-sm flex-shrink-0" aria-label="Clear search">
                            Clear
                        </button>
                    )}
                </div>
                {!isLoading && searchQuery && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-1">
                        {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : viewMode === 'table' ? (
                <Table
                    columns={columns}
                    data={filteredData}
                    isLoading={false}
                    emptyMessage={searchQuery ? `No books matching "${searchQuery}"` : 'No books available.'}
                />
            ) : filteredData.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
                    {searchQuery ? `No books matching "${searchQuery}"` : 'No books available.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-lg transition-all duration-200 group cursor-default"
                        >
                            <div className="w-full h-32 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-3xl font-bold text-primary/30 select-none">
                                    {book.title.charAt(0)}
                                </span>
                            </div>
                            <h3 className="text-sm font-semibold text-text dark:text-slate-100 mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-1">
                                {book.title}
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{book.author}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                    {book.category}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    book.available_copies > 0
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                }`}>
                                    {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBooks;
