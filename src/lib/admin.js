import { supabase } from '../supabase';

/* ─── ADMIN STATS ────────────────────────────────────────────────── */

export const fetchAdminStats = async () => {
    const [booksRes, studentsRes, issuedRes] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('status', 'issued'),
    ]);

    return {
        totalBooks: booksRes.count ?? 0,
        totalStudents: studentsRes.count ?? 0,
        issuedBooks: issuedRes.count ?? 0,
        error: booksRes.error || studentsRes.error || issuedRes.error,
    };
};

/* ─── USERS (LIBRARIANS & STUDENTS) ──────────────────────────────── */

export const fetchUsersByRole = async (role) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('full_name', { ascending: true });
    return { data, error };
};

export const deleteUserProfile = async (userId) => {
    if (!userId) return { error: { message: "No user ID provided" } };
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    return { error };
};

/* ─── TRANSACTIONS ───────────────────────────────────────────────── */

export const fetchAllTransactions = async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            id,
            issued_at,
            due_date,
            returned_at,
            status,
            books ( id, title ),
            profiles!student_id ( id, full_name, email )
        `)
        .order('issued_at', { ascending: false });
        
    return { data, error };
};
