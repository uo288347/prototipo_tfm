import { saveItemsAsOffer } from "./UtilsOffer";
import { task2, task4, task5, task7 } from "./UtilsTasks";

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
  task4(id, price);
  task5(id);
};

// Elimina items específicos del carrito
export const deleteFromCart = (targets) => {
  if (!isBrowser()) return [];
  let cart = getShoppingCart();
  cart = cart.filter(
    item => !targets.some(target => target.id === item.id && target.size === item.size)
  );
  saveCart(cart);
  task7(targets.map(t => t.id));
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
  if (!isBrowser()) return 0;
  const cart = getShoppingCart();
  return cart.reduce((total, item) => total + (item.quantity ?? 1), 0);
};

// Actualiza el precio de todas las instancias de un producto en el carrito
export const updateProductPrice = (id, newPrice) => {
  if (!isBrowser()) return;
  const cart = getShoppingCart();
  let updated = false;
  
  cart.forEach(item => {
    if (item.id === id) {
      item.price = newPrice;
      updated = true;
    }
  });
  
  if (updated) {
    saveCart(cart);
  }
};
