// Utility functions to get product translations based on locale

import productsEn from '../../messages/products_en.json';
import productsEs from '../../messages/products_es.json';

const productTranslations = {
  en: productsEn,
  es: productsEs
};

export const getProductTranslation = (productId, locale = 'es') => {
  const translations = productTranslations[locale] || productTranslations['es'];
  return translations[productId] || null;
};

export const getProductTitle = (productId, locale = 'es') => {
  const translation = getProductTranslation(productId, locale);
  return translation?.title || '';
};

export const getProductDescription = (productId, locale = 'es') => {
  const translation = getProductTranslation(productId, locale);
  return translation?.description || '';
};
