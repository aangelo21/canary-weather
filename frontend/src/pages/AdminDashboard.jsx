import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

/**
 * AdminDashboard Page Component.
 *
 * This component serves as a client-side redirect to the backend's server-side rendered (EJS) Admin Dashboard.
 * Since the admin interface is built with EJS templates on the backend, this React component simply
 * constructs the correct URL and performs a full page navigation (`window.location.href`).
 *
 * @component
 * @returns {JSX.Element} A placeholder component displaying a redirection message.
 */
const AdminDashboard = () => {
    const { t } = useTranslation();
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Effect hook to trigger the redirection immediately upon component mount.
     */
    useEffect(() => {
        const redirectToDashboard = () => {
            const API_BASE_ROOT = import.meta.env.VITE_API_BASE.replace(
                '/api',
                '',
            );
            // Redirect to the backend EJS dashboard
            window.location.href = `${API_BASE_ROOT}/admin`;
        };

        redirectToDashboard();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <SEO
                title="Admin Dashboard"
                description="Administrative dashboard for managing Canary Weather content and settings."
                name="Canary Weather Admin"
                type="website"
            />
            <h1>{t('adminDashboard')}</h1>
            <p>{t('redirectingToServer')}</p>
        </div>
    );
};

export default AdminDashboard;
