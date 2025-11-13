// ==========================
// CHECK IF BROWSER
const isBrowser = () => typeof window !== "undefined";

// ==========================
// LISTA DE PRODUCTOS ELEGIBLES PARA SER GRATUITOS
const ELIGIBLE_FREE_PRODUCTS = [
  "mw1",
  "mh1",
  "mi1",
  "md1",
];
// Comprueba si un producto es elegible para ser gratis
export const isEligibleForFree = (id) => {
  return ELIGIBLE_FREE_PRODUCTS.includes(id);
};

// ==========================
// LISTA DE PRODUCTOS QUE YA SE HICIERON GRATIS
export const saveItemsAsOffer = (items) => {
  if (!isBrowser()) return;
  localStorage.setItem("freeProductOffers", JSON.stringify(items));
};

// Marca un producto como oferta gratuita (solo si es elegible)
export const setItemAsOffer = (id) => {
  if (!isBrowser()) return;
  if (!isEligibleForFree(id)) {
    console.warn(`Product ${id} is not eligible for free offer`);
    return;
  }
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

// Obtiene las ofertas gratuitas actuales
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

// Comprueba si un producto ya se hizo gratuito
export const isProductFree = (id) => {
  if (!isBrowser()) return false;
  try {
    const offers = getFreeProductOffers();
    return offers.includes(id);
  } catch (error) {
    console.error("Error checking if product is free:", error);
    return false;
  }
};
