/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    cart.js - the shopping cart logic.

*/

const STORAGE_KEY = "assign2-cart";
const TAX_RATE = 0.05;                  // 5% charged on Canadian orders
const FREE_SHIPPING_OVER = 500;         // merchandise above this ships free

// Shipping cost for each method and destination
const SHIPPING_RATES = {
    standard: { canada: 10, usa: 15, international: 20 },
    express: { canada: 25, usa: 25, international: 30 },
    priority: { canada: 35, usa: 50, international: 50 }
};

export class Cart {

    constructor() {
        const saved = localStorage.getItem(STORAGE_KEY);

        this.items = saved ? JSON.parse(saved) : [];

        this.onChange = null;
    }

    /* Needs to be called after evey change made to the cart */
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        if (this.onChange) {
            this.onChange();
        }
    }

    /* Adds a product to the cart, if it already is in the cart, quantity goes up. */
    add(product, quantity) {
        const found = this.items.find( item => item.id == product.id );
        if (found) {
            found.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: quantity
            });
        }
        this.save();
    }

    /* Changes how many of one item are in the cart (never less than 1). */
    setQuantity(id, quantity) {
        const item = this.items.find( item => item.id == id );
        if (item) {
            item.quantity = Math.max(1, Math.floor(quantity) || 1);
            this.save();
        }
    }

    remove(id) {
        this.items = this.items.filter( item => item.id != id );
        this.save();
    }

    clear() {
        this.items = [];
        this.save();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    itemCount() {
        return this.items.reduce( (total, item) => total + item.quantity, 0 );
    }

    merchandiseTotal() {
        return this.items.reduce( (total, item) => total + item.price * item.quantity, 0 );
    }

    shippingCost(method, destination) {
        if (this.isEmpty() || this.merchandiseTotal() > FREE_SHIPPING_OVER) {
            return 0;
        }
        return SHIPPING_RATES[method][destination];
    }

    tax(location) {
        return location === "canada" ? this.merchandiseTotal() * TAX_RATE : 0;
    }

    total(method, destination) {
        return this.merchandiseTotal() + this.shippingCost(method, destination) + this.tax(destination);
     }
}