import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Table from '../../components/ui/Table';
import { fetchUsersByRole, deleteUserProfile } from '../../lib/admin';
import { supabase } from '../../supabase';

const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => <span className="capitalize">{row.role}</span> },
    {
        key: 'status',
        label: 'Status',
        render: () => (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                Active
            </span>
        ),
    },
    {
        key: 'actions',
        label: 'Actions',
        render: (row, onAction) => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onAction?.('edit', row)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
                    aria-label={`Edit ${row.full_name}`}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onAction?.('delete', row)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200"
                    aria-label={`Delete ${row.full_name}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
    },
];

const ManageLibrarians = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadLibrarians = useCallback(async () => {
        const result = await fetchUsersByRole('librarian');
        if (result.error) setError('Failed to load librarians.');
        else setData(result.data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        (async () => { await loadLibrarians(); })();

        const channel = supabase
            .channel('admin-librarians')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: "role=eq.librarian" }, loadLibrarians)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [loadLibrarians]);

    const handleAction = async (action, row) => {
        if (action === 'edit') alert(`Editing ${row.full_name} is not yet implemented.`);
        if (action === 'delete') {
            if (window.confirm(`Are you sure you want to delete ${row.full_name}?`)) {
                setIsLoading(true);
                const { error: delError } = await deleteUserProfile(row.id);
                if (delError) {
                    setError(`Failed to delete: ${delError.message}`);
                    setIsLoading(false);
                } else {
                    await loadLibrarians();
                }
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text dark:text-slate-100">Manage Librarians</h2>
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

export default ManageLibrarians;
