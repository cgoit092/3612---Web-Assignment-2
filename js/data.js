/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    data.js - getting the product data.

*/

const API_URL = "https://dummyjson.com/products?limit=100";
const STORAGE_KEY = "assign2-products";

export async function loadProducts() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        return JSON.parse(saved);
    }

    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Product API responded with status " + response.status);
    }
    const data = await response.json();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products));
    return data.products;
}

export function getCategories(products) {
    const categories = new Set();
    products.forEach( product => categories.add(product.category) );
    return Array.from(categories).sort();
}