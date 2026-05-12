import React, { useState, useEffect } from 'react';
import Card from './Card';
import { SparklesIcon } from './icons';
import { getOfflineTip } from '../services/wisdomService';
import { TranslationKey } from '../i18n';

interface MotivationCornerProps {
  t: (key: TranslationKey) => string;
  lang: string;
}

const MotivationCorner: React.FC<MotivationCornerProps> = ({ t, lang }) => {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTip = () => {
    setIsLoading(true);
    const newTip = getOfflineTip(lang);
    setTip(newTip);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTip();
  }, [lang]);

  return (
    <Card title={t('motivationCorner')} icon={<SparklesIcon className="w-7 h-7" />}>
      <div className="flex flex-col items-center justify-center text-center h-full bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-lg transition-colors">
        {isLoading ? (
          <p className="text-slate-500 dark:text-slate-400">{t('fetchingTip')}</p>
        ) : (
          <p className="text-lg font-medium text-brand-dark dark:text-slate-100 italic">"{tip}"</p>
        )}
        <button
          onClick={fetchTip}
          disabled={isLoading}
          className="mt-6 bg-white dark:bg-slate-800 border border-brand-secondary dark:border-emerald-700 text-brand-secondary dark:text-emerald-400 py-2 px-4 rounded-full text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {t('getNewTip')}
        </button>
      </div>
    </Card>
  );
};

export default MotivationCorner;
