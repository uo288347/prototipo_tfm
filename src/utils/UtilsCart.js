import { saveItemsAsOffer } from "./UtilsOffer";
import { task2, task3, task4, task6 } from "./UtilsTasks";

const isBrowser = () => typeof window !== "undefined";


export const getShoppingCart = () => {
  if (!isBrowser()) return []; // Previene error SSR
  const cart = localStorage.getItem("shoppingCart");
  return cart ? JSON.parse(cart) : [];
};

// Guarda el carrito en localStorage
const saveCart = (cart) => {
  if (!isBrowser()) return;
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
};

// Añade un item al carrito
export const addToCart = (id, size, quantity, price) => {
  if (!isBrowser()) return;
  const cart = getShoppingCart();
  const existingItem = cart.find(item => item.id === id && item.size === size);

  if (existingItem) {
    if(price===0) existingItem.price=0;
    existingItem.quantity += quantity;
  } else {
    cart.push({ id, size, quantity, price });
  }

  saveCart(cart);

  task2(id, size, quantity);
  task3(id, price);
  task4(id);
};

// Elimina items específicos del carrito
export const deleteFromCart = (targets) => {
  if (!isBrowser()) return [];
  let cart = getShoppingCart();
  cart = cart.filter(
    item => !targets.some(target => target.id === item.id && target.size === item.size)
  );
  saveCart(cart);
  task6(targets.map(t => t.id));
  return getShoppingCart();
};

// Actualiza todo el carrito con un array nuevo
export const updateCart = (items) => {
  if (!isBrowser()) return;
  saveCart(items);
};

// Elimina un item por id
export const removeFromCart = (id) => {
  if (!isBrowser()) return;
  let cart = getShoppingCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
};

// Vacía el carrito
export const clearCart = () => {
  if (!isBrowser()) return;
  saveCart([]);
  saveItemsAsOffer([])
};

// Actualiza unidades de un producto
export const updateUnits = (id, size, units) => {
  if (!isBrowser()) return;
  const cart = getShoppingCart();
  const existingItem = cart.find(item => item.id === id && item.size === size);
  if (existingItem) {
    existingItem.quantity = units;
  }
  saveCart(cart);
};

export const isInCart = (id, size = null) => {
  if (!isBrowser()) return false;

  const cart = getShoppingCart();

  return size
    ? cart.find(item => item.id === id && item.size === size) || null
    : cart.find(item => item.id === id) || null;
};

export const getShoppingCartLength = () => {
  console.log("Cart length called");
  if (!isBrowser()) return 0;
  const cart = getShoppingCart();
  console.log("Cart: ", cart);
  return cart.reduce((total, item) => total + (item.quantity ?? 1), 0);
};

// ==========================


/*
// Guarda el carrito en localStorage
const saveItemsAsOffer = (items) => {
  if (!isBrowser()) return;
  localStorage.setItem("freeProductOffers", JSON.stringify(items));
};

// Marca un producto como oferta gratuita
export const setItemAsOffer = (id) => {
  if (!isBrowser()) return;
  try {
    const storedOffers = localStorage.getItem("freeProductOffers");
    let offers = storedOffers ? JSON.parse(storedOffers) : [];
    if (!offers.includes(id)) {
      offers.push(id);
      localStorage.setItem("freeProductOffers", JSON.stringify(offers));
    }
  } catch (error) {
    console.error("Error saving free product offer:", error);
  }
};

// Obtiene las ofertas gratuitas
export const getFreeProductOffers = () => {
  if (!isBrowser()) return [];
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
  if (!isBrowser()) return false;
  try {
    const offers = getFreeProductOffers();
    return offers.includes(id);
  } catch (error) {
    console.error("Error checking if product is free:", error);
    return false;
  }
};*/