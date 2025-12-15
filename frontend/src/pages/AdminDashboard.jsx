import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';


const AdminDashboard = () => {
    const { t } = useTranslation();
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const redirectToDashboard = () => {
            const API_BASE_ROOT = import.meta.env.VITE_API_BASE.replace(
                '/api',
                '',
            );
            
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
