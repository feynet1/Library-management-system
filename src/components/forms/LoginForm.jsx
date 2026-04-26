import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import TogglePassword from '../ui/TogglePassword';
import useFormValidation from '../../hooks/useFormValidation';
import { signIn } from '../../auth';
import useAuth from '../../hooks/useAuth';

const roleRoutes = {
    admin:     '/admin/dashboard',
    librarian: '/librarian/dashboard',
    student:   '/student/dashboard',
};

const LoginForm = () => {
    const navigate        = useNavigate();
    const { session, profile } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError]   = useState('');
    const [loggingIn, setLoggingIn]       = useState(false);

    useEffect(() => {
        if (session && profile) {
            const role = (profile.role || 'student').toLowerCase();
            navigate(roleRoutes[role] || '/student/dashboard', { replace: true });
        }
    }, [session, profile, navigate]);

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useFormValidation(
        { email: '', password: '' },
        {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
            },
            password: {
                required: true,
                minLength: 6,
                message: 'Password must be at least 6 characters',
            },
        }
    );

    const onSubmit = async (formData) => {
        setSubmitError('');
        setLoggingIn(true);

        const { error } = await signIn({
            email:    formData.email,
            password: formData.password,
        });

        if (error) {
            setSubmitError(error.message);
            setLoggingIn(false);
        }
    };

    const busy = isSubmitting || loggingIn;

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}
            className="space-y-6"
        >
            {submitError && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
                    {submitError}
                </div>
            )}

            <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
            />

            <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
                rightElement={
                    <TogglePassword
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                    />
                }
            />

            <Button type="submit" isLoading={busy}>
                {busy ? 'Loading your dashboard...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                    Sign up
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
