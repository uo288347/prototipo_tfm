// UtilsFavorites.js
import { task5 } from "@/utils/UtilsTasks";

// Helper para comprobar si estamos en el cliente (navegador)
const isBrowser = () => typeof window !== "undefined";

// Obtiene los favoritos desde localStorage
export const getFavorites = () => {
  if (!isBrowser()) return new Set();
  const favs = localStorage.getItem("favorites");
  return new Set(favs ? JSON.parse(favs) : []);
};

// Obtiene un favorito por id
export const getFavorite = (id) => {
  if (!isBrowser()) return false;
  const favs = getFavorites();
  return favs.has(id);
};

// Guarda los favoritos en localStorage
const saveFavorites = (favs) => {
  if (!isBrowser()) return;
  localStorage.setItem("favorites", JSON.stringify([...favs]));
};

// Añade o elimina un item de favoritos
export const toggleFavorite = (id) => {
  if (!isBrowser()) return [];
  const favs = getFavorites();

  if (favs.has(id)) {
    favs.delete(id);
  } else {
    favs.add(id);
  }

  saveFavorites(favs);
  task5(id);
  return [...favs];
};

// Elimina uno o varios items de favoritos
export const deleteFromFavorites = (targets) => {
  if (!isBrowser()) return [];
  let favs = getFavorites();
  const idsToDelete = Array.isArray(targets) ? targets : [targets];

  idsToDelete.forEach((id) => favs.delete(id));

  saveFavorites(favs);
  return [...favs];
};

// Actualiza toda la lista de favoritos
export const updateFavorites = (newFavs) => {
  if (!isBrowser()) return [];
  const favsSet = new Set(newFavs);
  saveFavorites(favsSet);
  return [...favsSet];
};

// Vacía los favoritos
export const clearFavorites = () => {
  if (!isBrowser()) return;
  saveFavorites([]);
};
