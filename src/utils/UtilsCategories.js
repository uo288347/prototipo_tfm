


// Importar traducciones
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';

const messages = {
  en: enMessages,
  es: esMessages
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
    image: messages[locale]?.categories?.[cat.key] || cat.key
  }));
};

export const getCategory = (key, locale = 'es') => {
  const category = categoriesBase.find(c => c.key === key);
  if (!category) return null;
  
  return {
    ...category,
    label: messages[locale]?.categories?.[key] || key
  };
};

export const getCategoryLabel = (value, locale = 'es') => {
  const category = categoriesBase.find(c => c.key === value);
  if (!category) return null;
  
  return messages[locale]?.categories?.[value] || value;
};

