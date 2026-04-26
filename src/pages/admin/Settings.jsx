import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Loader2 } from 'lucide-react';
import { fetchSystemSetting, updateSystemSetting } from '../../lib/settings';

const Settings = () => {
    const [registrationEnabled, setRegistrationEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            const { data } = await fetchSystemSetting('registration_enabled');
            setRegistrationEnabled(data === true || data === 'true');
            setIsLoading(false);
        };
        loadSettings();
    }, []);

    const handleToggle = async () => {
        setIsSaving(true);
        setMessage('');
        const newValue = !registrationEnabled;
        const { error } = await updateSystemSetting('registration_enabled', newValue);
        
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setRegistrationEnabled(newValue);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
        setIsSaving(false);
    };

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <SettingsIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-text dark:text-slate-100">System Settings</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-medium text-text dark:text-slate-200 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                    Authentication & Access
                </h3>

                {isLoading ? (
                    <div className="flex items-center gap-3 py-4 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading settings...
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Registration Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-text dark:text-slate-200">Public Student Registration</h4>
                                    {!registrationEnabled && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-error/10 text-error">
                                            <ShieldAlert className="w-3 h-3" />
                                            Disabled
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Allow new users to sign up for student accounts from the public signup page.
                                </p>
                            </div>
                            
                            <button
                                onClick={handleToggle}
                                disabled={isSaving}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                    registrationEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="sr-only">Toggle registration</span>
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        registrationEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                        
                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-error/10 text-error' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
