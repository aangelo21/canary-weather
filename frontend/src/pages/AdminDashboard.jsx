import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectToDashboard = () => {
      const API_BASE_ROOT = import.meta.env.VITE_API_BASE.replace('/api', '');
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
      <h1>{t('adminDashboard')}</h1>
      <p>Redirecting to server-side dashboard...</p>
    </div>
  );
};

export default AdminDashboard;