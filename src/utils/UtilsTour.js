import tourEn from '../../messages/tour_en.json';
import tourEs from '../../messages/tour_es.json';

const tourTranslations = {
  en: tourEn,
  es: tourEs
};

const getTourText = (key, locale = 'es') => {
  const translations = tourTranslations[locale] || tourTranslations['es'];
  return translations[key] || key;
};

export const getTourSteps = ({ bannerRef, locale = 'es' }) => [
    {
        title: getTourText('step1_title', locale),
        description: getTourText('step1_description', locale),
        target: () => bannerRef.current,
        style: { margin: '0 0px' }
    },
    {
        title: getTourText('step2_title', locale),
        description: getTourText('step2_description', locale),
        target: () => bannerRef.current,
        style: { margin: '0 0px' }
    },
];