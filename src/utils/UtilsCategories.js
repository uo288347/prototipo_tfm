


// Importar traducciones de categorías
import categoriesEn from '../../messages/categories_en.json';
import categoriesEs from '../../messages/categories_es.json';

const categoriesMessages = {
  en: categoriesEn,
  es: categoriesEs
};

// Categorías base (las claves no cambian, solo las etiquetas)
const categoriesBase = [
    { key: "sports", image: "/sports.jpg" },
    { key: "children", image: "/clothes_children.png" },
    { key: "women", image: "/clothes_woman.png" },
    { key: "men", image: "/clothes_man.png" },
];

// Obtener categorías traducidas según el locale
export const getCategories = (locale = 'es') => {
  return categoriesBase.map(cat => ({
    ...cat,
    label: categoriesMessages[locale]?.[cat.key] || cat.key
  }));
};

export const getCategory = (key, locale = 'es') => {
  const category = categoriesBase.find(c => c.key === key);
  if (!category) return null;
  
  return {
    ...category,
    label: categoriesMessages[locale]?.[key] || key
  };
};

export const getCategoryLabel = (value, locale = 'es') => {
  const category = categoriesBase.find(c => c.key === value);
  if (!category) return null;
  
  return categoriesMessages[locale]?.[value] || value;
};

