/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    main.js - loads the product data, creates a cart, lets each view set itself up, and then shows the Home view.

*/

import { loadProducts } from "./data.js";
import { Cart } from "./cart.js";
import { registerAction, showView, startRouter } from "./router.js";
import { setupSharedActions, showToast } from "./ui.js";
import { setupHomeView } from "./views/home.js";
//import { setupCategoryView } from "./views/category.js";
import { setupBrowseView } from "./views/browse.js";
//import { setupProductView } from "./views/product.js"
//import { setupCartView } from "./views/cart"

document.addEventListener("DOMContentLoaded", start);

async function start() {
    const loading = document.querySelector("#loading");

    // Get the data
    let products;
    try {
        products = await loadProducts();
    } catch (error) {
        loading.textContent = "Sorry, the products could not be loaded. Check your connection and refresh the page.";
        loading.classList.add("error");
        console.error(error);
        return;
    }
    loading.classList.add("hidden");
    
    // Cart
    const cart = new Cart();
    const cartCount = document.querySelector("#cartCount");
    const showCartCount = () => cartCount.textContent = cart.itemCount();
    cart.onChange = showCartCount;
    showCartCount();

    // Every view finds its elements and registers with the router
    setupSharedActions();
    setupHomeView(products);
    //setupCategoryView(products);
    setupBrowseView(products);
    //setupProductView(products, cart);
    //setupCartView(cart);

    // "+" button on a product card is handled once here (its the same in every view)
    registerAction("add-to-cart", button => {
        const product = products.find( p => p.id == button.dataset.id );
        cart.add(product, 1);
        showToast(`${product.title} added to your cart`);
    });

    // Listen for click and show first view
    startRouter();
    showView("home");
}