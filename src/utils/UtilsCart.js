
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

export const addToCart = (id, size, quantity) => {
    const cart = getShoppingCart();
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if (existingItem) {
        existingItem.quantity += quantity; // Suma si ya existe
    } else {
        cart.push({ id, size, quantity });
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
