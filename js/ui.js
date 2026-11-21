/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    ui.js - helpers that for some of the view files.

*/
import { registerAction } from "./router.js";

const TOAST_TIME = 2500;
let toastTimer = null;

/* Formatting */

/* 1899.99 -> $1,899.99 */
export function formatMoney(amount) {
    return amount.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

/* home-decoration -> Home Decoration */
export function formatCategory(category) {
    return category
        .split("-")
        .map( word => word[0].toUpperCase() + word.slice(1) )
        .join(" ");
}

/* 3.6 -> ★★★★☆ (rounded to nearest whole star) */
export function starText(rating) {
    const filled = Math.round(rating);
    return "★".repeat(filled) + "☆".repeat(5 - filled);
}

/* Bulding Help */

/* Shortcut for createElement + class + text, which is repeated often */
export function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

/* Returns an empty copy of an element inside a template */
export function cloneTemplate(selector) {
    const template = document.querySelector(selector);
    return template.content.firstElementChild.cloneNode(true);
}

/* Builds a product card using the template in index.html */
export function createProductCard(product) {
    const card = cloneTemplate("#productCardTemplate");

    const image = card.querySelector("img");
    image.src = product.thumbnail;
    image.alt = product.title;

    card.querySelector(".card-category").textContent = formatCategory(product.category);
    card.querySelector("h3 a").textContent = product.title;
    card.querySelector(".price").textContent = formatMoney(product.price);

    const stars = card.querySelector(".stars");
    stars.textContent = starText(product.rating);
    stars.title = product.rating + " out of 5";

    // The image link, the title link and the + button must know which product this is
    card.querySelectorAll("[data-view], [data-action]").forEach( element => {
        element.dataset.id = product.id;
    });
    return card;
}

/* Empties a container and fills it with one card per product */
export function showProducts(container, products) {
    container.replaceChildren();
    products.forEach( product => container.appendChild(createProductCard(product)) );
}

/* Toast */

/* Shows a short message in the corner, then hides it again. */
export  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);   // if it already showing, restart its timer
    toastTimer = setTimeout( () => toast.classList.remove("show"), TOAST_TIME );
}


/* Actions */
export function setupSharedActions() {
    // About dialog. showModal() is what dims the page behind it.
    registerAction("about", () => document.querySelector("#about").showModal() );

    // Any close button inside any dialog
    registerAction("close-dialog", button => button.closest("dialog").close() );

    // Clicking the dimmed area outside a dialog also closes it
    document.querySelectorAll("dialog").forEach( dialog => {
        dialog.addEventListener("click", e => {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });

    // click to open, click again to close
    registerAction("toggle-accordion", button => {
        const isOpen = button.closest(".accordion").classList.toggle("open");
        button.setAttribute("aria-expanded", isOpen);
    })
}
