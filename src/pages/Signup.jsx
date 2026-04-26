import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import SignupForm from '../components/forms/SignupForm';
import { fetchSystemSetting } from '../lib/settings';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkRegistration = async () => {
            const { data } = await fetchSystemSetting('registration_enabled');
            // Data is true by default if the fetch fails or setting doesn't exist
            setIsEnabled(data === true || data === 'true');
            setIsLoading(false);
        };
        checkRegistration();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <Card>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text dark:text-slate-100 mb-2">
                        Create Student Account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Join our library community
                    </p>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : !isEnabled ? (
                    <div className="text-center py-6 px-4 bg-error/10 border border-error/20 rounded-xl">
                        <ShieldAlert className="w-12 h-12 text-error mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-text dark:text-slate-200 mb-2">Registration Disabled</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Public student registrations are currently disabled by the administrator. Please contact your library staff for an account.
                        </p>
                        <Link to="/login" className="text-primary hover:underline text-sm font-medium">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <SignupForm />
                )}
            </Card>
        </div>
    );
};

export default Signup;
