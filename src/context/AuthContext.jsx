/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getProfile } from '../auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const handleSession = async (currentSession) => {
            if (!currentSession?.user) {
                if (mounted) {
                    setSession(null);
                    setProfile(null);
                    setLoading(false);
                }
                return;
            }

            try {
                if (mounted) setSession(currentSession);
                
                const { data, error } = await getProfile(currentSession.user.id);
                if (error && error.code !== 'PGRST116') {
                    console.warn("Profile fetch warning:", error);
                }
                
                let userProfile = { id: currentSession.user.id, role: 'student' };
                if (data) {
                    userProfile = { ...userProfile, ...data };
                } else if (currentSession.user.user_metadata) {
                    userProfile = { ...userProfile, ...currentSession.user.user_metadata };
                }
                
                // Ensure a role is always set
                if (!userProfile.role) userProfile.role = 'student';

                if (mounted) {
                    setProfile(userProfile);
                    setLoading(false);
                }
            } catch (err) {
                console.error("AuthContext error:", err);
                if (mounted) {
                    setProfile(null);
                    setLoading(false);
                }
            }
        };

        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            handleSession(initialSession);
        });

        // 2. Listen for changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            handleSession(newSession);
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
