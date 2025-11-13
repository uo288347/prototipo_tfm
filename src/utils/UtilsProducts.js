const products = [
    // 🧥 Women's Fashion
    {
        id: "mw1",
        title: "Elegant Green Coat",
        description: "Long winter coat with fleece lining and classic style.",
        price: 19.03,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },
    {
        id: "mw2",
        title: "Sarah Beach Short Dress",
        description: "Sleeveless pink dress, perfect for the beach.",
        price: 32.99,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "women",
        filter: "Clothing"
    },

    // 👔 Men's Fashion
    {
        id: "mh1",
        title: "Green Bomber Jacket",
        description: "Lightweight jacket with high collar and embroidery.",
        price: 11.06,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },
    {
        id: "mh2",
        title: "Casual Hooded Jacket",
        description: "Color-block design, perfect for autumn.",
        price: 19.91,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "men",
        filter: "Clothing"
    },

    // 🧒 Children's Fashion
    {
        id: "mi1",
        title: "Boys Dinosaur Tracksuit",
        description: "Hooded sweatshirt and jogging pants with dinosaur print.",
        price: 5.66,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },
    {
        id: "mi2",
        title: "Yellow Embroidered Dress",
        description: "Summer dress with floral embroidery for girls.",
        price: 5.12,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "children",
        filter: "Clothing"
    },

    // 🏋️ Sports Fashion
    {
        id: "md1",
        title: "Women's Gym Jacket",
        description: "Sports jacket with high collar and zipper closure.",
        price: 11.57,
        images: ["/picture1.jpg", "/picture2.jpg", "/picture3.jpg"],
        category: "sports",
        filter: "Clothing"
    },
    {
        id: "md2",
        title: "Red Sports Set",
        description: "Jacket and jeggings with letter print design.",
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

    // 🏠 Home (no products available)
];


export const getProducts = () => {
    return products;
}

export const getProduct = (id) => {
    return products.find(product => product.id === id);
}

