


const categories = [
    { key:"sports", label: "Sports", image: "/sports.jpg" },
    { key: "children", label: "Children's fashion", image: "/clothes_children.png" },
    { key: "women", label: "Women's fashion", image: "/clothes_woman.png" },
    { key: "men", label: "Men's fashion", image: "/clothes_man.png" },
];

export const getCategory = (key) => {
  return categories.find(c => c.key === key) || null;
};

export const getCategoryLabel = (value) => {
    const category = categories.find(c => c.key === value);
  return category ? category.label : null;
}

// Devuelve todas las categorías
export const getCategories = () => {
  return categories;
};
