const products = [
    // 🧥 Moda Mujer
    {
        id: "mw1",
        title: "Abrigo Elegante Verde",
        description: "Abrigo largo de invierno con forro polar, estilo clásico.",
        price: 19.03,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw2",
        title: "Vestido Corto Sarah Beach",
        description: "Vestido rosa sin mangas, ideal para la playa.",
        price: 32.99,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },

    // 👔 Moda Hombre
    {
        id: "mh1",
        title: "Chaqueta Bomber Verde",
        description: "Chaqueta ligera con cuello alto y bordado.",
        price: 11.06,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh2",
        title: "Chaqueta Casual con Capucha",
        description: "Diseño de colores contrastantes, ideal para otoño.",
        price: 19.91,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },

    // 🧒 Moda Infantil
    {
        id: "mi1",
        title: "Chándal Dinosaurio Niño",
        description: "Sudadera con capucha y pantalón jogging con estampado de dinosaurios.",
        price: 5.66,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi2",
        title: "Vestido Amarillo Bordado",
        description: "Vestido de verano con bordado floral para niñas.",
        price: 5.12,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },

    // 🏋️ Moda Deporte
    {
        id: "md1",
        title: "Chaqueta Gym Mujer",
        description: "Chaqueta deportiva con cuello alto y cremallera.",
        price: 11.57,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "sports",
        filter: "Clothing"
    },
    {
        id: "md2",
        title: "Conjunto Deportivo Rojo",
        description: "Chaqueta y jeggings con estampado de letras.",
        price: 13.12,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "sports",
        filter: "Clothing"
    },
     // 👠 Women's Accessories & Footwear
    {
        id: "aw1",
        title: "Leather Handbag with Chain Strap",
        description: "Elegant shoulder bag made of soft leather with gold chain details.",
        price: 24.50,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Accessories"
    },
    {
        id: "aw2",
        title: "Classic Heeled Sandals",
        description: "Beige open-toe sandals with adjustable strap and medium heel.",
        price: 28.75,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Footwear"
    },

    // 👞 Men's Accessories & Footwear
    {
        id: "am1",
        title: "Brown Leather Belt",
        description: "Classic genuine leather belt with metal buckle.",
        price: 12.90,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Accessories"
    },
    {
        id: "am2",
        title: "Casual Sneakers",
        description: "Comfortable men's sneakers with breathable mesh design.",
        price: 22.35,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Footwear"
    },

    // 🧢 Children's Accessories & Footwear
    {
        id: "ac1",
        title: "Kids Dinosaur Cap",
        description: "Fun green cap with 3D dinosaur spikes and adjustable strap.",
        price: 6.25,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Accessories"
    },
    {
        id: "ac2",
        title: "Light-Up Sneakers for Girls",
        description: "Pink LED sneakers with glitter details and velcro closure.",
        price: 14.80,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Footwear"
    },


    // 🏠 Hogar (sin resultados disponibles)
    ];

export const getProducts = () => {
    return products;
}

export const getProduct = (id) => {
    return products.find(product => product.id === id);
}

