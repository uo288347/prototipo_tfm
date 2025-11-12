
// UtilsProducts.js
// Obtiene el carrito desde localStorage
export const getShoppingCart = () => {
    const cart = localStorage.getItem("shoppingCart");
    return cart ? JSON.parse(cart) : [];
};
// Guarda el carrito en localStorage
const saveCart = (cart) => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
};
// Añade un item al carrito

export const addToCart = (id, size, quantity, price) => {
    const cart = getShoppingCart();
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if (existingItem) {
        existingItem.quantity += quantity; // Suma si ya existe
    } else {
        cart.push({ id, size, quantity, price });
    }

    saveCart(cart);
};
// Elimina items específicos del carrito

export const deleteFromCart = (targets) => {
    let cart = getShoppingCart();
    cart = cart.filter(item => !targets.some(target => target.id === item.id && target.size === item.size)
    );
    saveCart(cart);
    return getShoppingCart();
};
// Actualiza todo el carrito con un array nuevo

export const updateCart = (items) => {
    saveCart(items);
};
// Elimina un item por id (independientemente del tamaño)

export const removeFromCart = (id) => {
    let cart = getShoppingCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
};
// Vacía el carrito

export const clearCart = () => {
    saveCart([]);
};

export const updateUnits = (id, size, units) => {
    const cart = getShoppingCart();
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if (existingItem) {
        existingItem.quantity = units;
    }
    saveCart(cart);
};


export const setItemAsOffer = (id) => {
  try {
    // Obtener la lista actual de ofertas desde localStorage
    const storedOffers = localStorage.getItem("freeProductOffers");
    let offers = storedOffers ? JSON.parse(storedOffers) : [];

    // Evitar duplicados
    if (!offers.includes(id)) {
      offers.push(id);
      localStorage.setItem("freeProductOffers", JSON.stringify(offers));
    }
  } catch (error) {
    console.error("Error saving free product offer:", error);
  }
};

export const getFreeProductOffers = () => {
  try {
    const storedOffers = localStorage.getItem("freeProductOffers");
    return storedOffers ? JSON.parse(storedOffers) : [];
  } catch (error) {
    console.error("Error reading free product offers:", error);
    return [];
  }
};

// Comprueba si un producto es gratuito
export const isProductFree = (id) => {
  try {
    const offers = getFreeProductOffers();
    return offers.includes(id);
  } catch (error) {
    console.error("Error checking if product is free:", error);
    return false;
  }
};