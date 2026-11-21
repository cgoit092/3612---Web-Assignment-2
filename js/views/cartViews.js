/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    cartView.js - shopping cart view.

*/

import { registerAction, registerView, showView } from "../router.js";
import { cloneTemplate, formatMoney, showToast } from "../ui.js"

export function setupCartView(cart) {
    const table = document.querySelector("#cartTable");
    const rows = document.querySelector("#cartItems");
    const emptyMessage = document.querySelector("#cartEmpty");
    const methodSelect = document.querySelector("#shippingMethod");
    const destinationSelect = document.querySelector("#shippingDestination");
    const checkoutButton = document.querySelector("#checkoutButton");

    registerView("cart", showCart);

    registerAction("remove-item", button => {
        cart.remove(button.dataset.id);
        showCart();
    });

    registerAction("checkout", () => {
        cart.clear();
        showToast("Thank you! Your order has been placed.");
        showView("home");
    });

    // Typing a new quantity in a row.
    rows.addEventListener("change", e => {
        if (e.target.matches(".quantity-input")) {
            cart.setQuantity(e.target.dataset.id, Number(e.targret.value));
            showCart();
        }
    })

    // A different shipping method or destination only changes the summary
    methodSelect.addEventListener("change", showSummary);
    destinationSelect.addEventListener("change", showSummary);

    function showCart() {
        rows.replaceChildren();
        cart.items.forEach( item => rows.appendChild(createRow(item)) );

        const isEmpty = cart.isEmpty();
        emptyMessage.classList.toggle("hidden", !isEmpty);
        table.classList.toggle("hidden", isEmpty);

        methodSelect.disabled = isEmpty;
        destinationSelect.disabled = isEmpty;
        checkoutButton.disabled = isEmpty;

        showSummary();
    }

    function createRow(item) {
        const row = cloneTemplate("#cartRowTemplate");

        const image = row.querySelector("img");
        image.src = item.thumbnail;
        image.alt = item.title;

        row.querySelector(".cart-title a").textContent = item.title;
        row.querySelector(".item-price").textContent = formatMoney(item.price);
        row.querySelector(".item-subtotal").textContent = formatMoney(item.price * item.quantity);
        row.querySelector(".quantity-input").value = item.quantity;

        row.querySelectorAll("[data-view], [data-action, .quantity-input").forEach( element => {
            element.dataset.id = item.id;
        });
        return row;
    }

    function showSummary() {
        const method = methodSelect.value;
        const destination = destinationSelect.value;
        const shipping = cart.shippingCost(method, destination);
        const isFree = !cart.isEmpty() && shipping === 0;

        document.querySelector("#summaryMerchandise").textContent = formatMoney(cart.merchandiseTotal());
        document.querySelector("#summaryShipping").textContent = isFree ? "Free" : formatMoney(shipping);
        document.querySelector("#summaryTax").textContent = formatMoney(cart.tax(destination));
        document.querySelector("#summaryTotal").textContent = formatMoney(cart.total(method, destination));
    }
}