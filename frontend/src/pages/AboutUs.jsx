import { useTranslation } from "react-i18next";

function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {t('aboutUsTitle')}
        </h1>
        
        <div className="bg-white dark:bg-[#262626] shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('aboutUsDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('ourTeam')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Canary Weather Team
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('contact')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              info@canaryweather.xyz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
