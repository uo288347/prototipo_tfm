
// UtilsFavorites.js
// Obtiene los favoritos desde localStorage
export const getFavorites = () => {
    const favs = localStorage.getItem("favorites");
     return new Set(favs ? JSON.parse(favs) : []);
};

export const getFavorite = (id) => {
    const favs = getFavorites();
    return favs.has(id)
}

// Guarda los favoritos en localStorage
const saveFavorites = (favs) => {
    localStorage.setItem("favorites", JSON.stringify([...favs]));
};
// Añade un item al carrito

export const toggleFavorite = (id) => {
    const favs = getFavorites();

    if (favs.has(id)) {
        favs.delete(id);
    } else {
        favs.add(id);
    }

    saveFavorites(favs);
    return [...favs];
};

// Elimina items específicos de favorites
export const deleteFromFavorites = (targets) => {
    let favs = getFavorites();
    const idsToDelete = Array.isArray(targets) ? targets : [targets];

    idsToDelete.forEach(id => favs.delete(id));

    saveFavorites(favs);
    return [...favs];
};
// Actualiza todo el carrito con un array nuevo

export const updateFavorites = (newFavs) => {
    const favsSet = new Set(newFavs);
    saveFavorites(favsSet);
    return [...favsSet];
};
// Elimina un item por id (independientemente del tamaño)

/*export const removeFromFavorites = (id) => {
    let cart = getShoppingCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
};*/

// Vacía los favoritos
export const clearFavorites = () => {
    saveFavorites([]);
};
