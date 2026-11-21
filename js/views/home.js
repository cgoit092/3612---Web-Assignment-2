/* Author: Cameron Goit

    home.js - the home view

*/

import { getCategories } from "../data.js";
import { showProducts } from "../ui.js";

const FEATURED_IDS = [78, 88, 7];  // picked myself: laptop, shoes, fragrance
const TOP_RATED_COUNT = 4;

export function setupHomeView(products) {
    const categoryCount = getCategories(products).length;
    document.querySelector("#heroStats").textContent =
        `${products.length} products · ${categoryCount} departments`;
    
    const featured = products.filter( product => FEATURED_IDS.includes(product.id) );
    showProducts(document.querySelector("#featuredGrid"), featured);

    // slice() makes a copy first, sort() would reorder the array
    const topRated = products
        .slice()
        .sort( (a, b) => b.rating - a.rating )
        .slice(0, TOP_RATED_COUNT);
    showProducts(document.querySelector("#topRatedGrid"), topRated);
}