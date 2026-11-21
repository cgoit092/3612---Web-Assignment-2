/* Author: Cameron Goit

    category.js - category view.

*/

import { getCategories } from "../data.js";
import { cloneTemplate, formatCategory, fromatCategory } from "../ui.js";

export function setupCategoryView(products) {
    const grid = document.querySelector("#categoryGrid");

    getCategories(products).forEach( category => {
        const inCategory = products.filter( product => product.category === category );
        grid.appendChild(createCategoryTile(category, inCategory));
    });
}

/* The picture in the tile is the thumbnail of the first product in that category. */
function createCategoryTile(category, productsInCategory) {
    const tile = cloneTemplate("#categoryTileTemplate");
    tile.dataset.category = category;

    const image = tile.querySelector("img");
    image.src = productsInCategory[0].thumbnail;
    image.alt = "";

    tile.querySelector("h3").textContent = formatCategory(category);
    tile.querySelector("p").textContent = productsInCategory.length + "products";
    return tile;
}