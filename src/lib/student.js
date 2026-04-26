import { supabase } from '../supabase';

/* ─── DASHBOARD STATS ────────────────────────────────────────────── */

export const fetchStudentStats = async (studentId) => {
    if (!studentId) return { error: { message: "No student ID provided" } };

    const [booksRes, issuedRes, overdueRes] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('id', { count: 'exact', head: true })
            .eq('student_id', studentId)
            .eq('status', 'issued'),
        supabase.from('transactions').select('id', { count: 'exact', head: true })
            .eq('student_id', studentId)
            .eq('status', 'overdue'),
    ]);

    return {
        totalBooks:   booksRes.count   ?? 0,
        issuedBooks:  issuedRes.count  ?? 0,
        overdueBooks: overdueRes.count ?? 0,
        error: booksRes.error || issuedRes.error || overdueRes.error,
    };
};

/* ─── BOOKS ──────────────────────────────────────────────────────── */

export const fetchBooks = async () => {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title', { ascending: true });
    return { data, error };
};

/* ─── TRANSACTIONS ───────────────────────────────────────────────── */

export const fetchMyTransactions = async (studentId) => {
    if (!studentId) return { data: null, error: { message: "No student ID provided" } };

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            id,
            issued_at,
            due_date,
            returned_at,
            status,
            books ( id, title, author )
        `)
        .eq('student_id', studentId)
        .order('issued_at', { ascending: false });
        
    return { data, error };
};
