import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { fetchAlerts } from "../services/alertService";

function Warnings() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts();
        setAlerts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      <h1 className="text-4xl font-bold text-center">{t('warningsTitle')}</h1>
      <div className="mt-8">
        {alerts.length === 0 ? (
          <p className="text-center">{t('noWarnings')}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{alert.phenomenon}</h2>
                <p className="text-gray-600">{alert.level}</p>
                <p>{t('start')}: {new Date(alert.start_date).toLocaleString()}</p>
                <p>{t('end')}: {new Date(alert.end_date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Warnings;