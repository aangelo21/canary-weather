import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No token found');
          return;
        }
        const API_BASE_ROOT = import.meta.env.VITE_API_BASE.replace('/api', '');
        const response = await fetch(`${API_BASE_ROOT}/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{t('adminDashboard')}</h1>
      <p>Dashboard is empty for now.</p>
      <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
    </div>
  );
};

export default AdminDashboard;