const products = [
    // 🧥 Moda Mujer
    {
        id: "mw1",
        title: "Abrigo Elegante Verde",
        description: "Abrigo largo de invierno con forro polar, estilo clásico.",
        price: 19.03,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Women's Fashion",
    },
    {
        id: "mw2",
        title: "Vestido Corto Sarah Beach",
        description: "Vestido rosa sin mangas, ideal para la playa.",
        price: 32.99,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Women's Fashion",
    },

    // 👔 Moda Hombre
    {
        id: "mh1",
        title: "Chaqueta Bomber Verde",
        description: "Chaqueta ligera con cuello alto y bordado.",
        price: 11.06,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Men's Fashion",
    },
    {
        id: "mh2",
        title: "Chaqueta Casual con Capucha",
        description: "Diseño de colores contrastantes, ideal para otoño.",
        price: 19.91,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Men's Fashion",
    },

    // 🧒 Moda Infantil
    {
        id: "mi1",
        title: "Chándal Dinosaurio Niño",
        description: "Sudadera con capucha y pantalón jogging con estampado de dinosaurios.",
        price: 5.66,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Children's Fashion",
    },
    {
        id: "mi2",
        title: "Vestido Amarillo Bordado",
        description: "Vestido de verano con bordado floral para niñas.",
        price: 5.12,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Children's Fashion",
    },

    // 🏋️ Moda Deporte
    {
        id: "md1",
        title: "Chaqueta Gym Mujer",
        description: "Chaqueta deportiva con cuello alto y cremallera.",
        price: 11.57,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Sports",
    },
    {
        id: "md2",
        title: "Conjunto Deportivo Rojo",
        description: "Chaqueta y jeggings con estampado de letras.",
        price: 13.12,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "Sports",
    },

    // 🏠 Hogar (sin resultados disponibles)
    ];

export const getProducts = () => {
    return products;
}

export const getProduct = (id) => {
    return products.find(product => product.id === id);
}

let shoppingCart = [
  {
    id: "mw1",
    size: "M",
    quantity: 2,
  },
  {
    id: "md2",
    size: "L",
    quantity: 1,
  }]
  
export const getShoppingCart = () => {
    return shoppingCart
}

export const addToCart = (id, size, quantity) => {
  const existingItem = shoppingCart.find(
    item => item.id === id && item.size === size
  );

  if (existingItem) {
    // Si existe, suma la cantidad
    existingItem.quantity += quantity;
  } else {
    // Si no existe, lo añade con la cantidad especificada
    shoppingCart.push({ id, size, quantity });
  }
};

export const removeFromCart = (id) => {
  shoppingCart = shoppingCart.filter(item => item.id !== id);
};

export const clearCart = () => {
  shoppingCart = [];
};