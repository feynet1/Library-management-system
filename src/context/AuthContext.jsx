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
        const handleSession = async (newSession) => {
            try {
                setSession(newSession);

                if (newSession?.user) {
                    const { data, error } = await getProfile(newSession.user.id);
                    if (error) {
                        console.warn("Could not fetch profile (might not exist yet):", error.message);
                    }
                    const userProfile = data ?? { ...newSession.user.user_metadata, id: newSession.user.id };
                    if (!userProfile.role) {
                        userProfile.role = 'student';
                    }
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }
            } catch (err) {
                console.error("AuthContext error:", err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        // Initialize session on mount to ensure we don't miss the initial event
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            handleSession(initialSession);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                await handleSession(newSession);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
