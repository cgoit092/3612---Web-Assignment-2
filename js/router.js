/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    router.js - helps determine which view is showing and what a click should do.

*/

const views = {};       // view name -> function that fills in that view
const actions = {};     // action name -> function to run when it is clicked

export function registerView(name, show) {
    views[name] = show;
}

export function registerAction(name,run) {
    actions[name] = run;
}

/* Hides all views except the named one */
export function showView(name, params = {}) {
    document.querySelectorAll("main > article").forEach( article => {
        article.classList.toggle("active", article.id === name);
    });

    // highlight the header link that matches the name
    document.querySelectorAll(".site-header nav a").forEach( link => {
        link.classList.toggle("active", link.dataset.view === name);
    });

    if (views[name]) {
        views[name](params);
    }
    window.scrollTo(0, 0);
}

/* the click listener (for event delegation). */
export function startRouter() {
    document.addEventListener("click", e => {
        const viewLink = e.target.closest("[data-view]");
        const actionButton = e.target.closest("[data-action]");

        if (viewLink) {
            e.preventDefault();
            showView(viewLink.dataset.view, viewLink.dataset);
        } else if (actionButton && actions[actionButton.dataset.action]) {
            e.preventDefault();
            actions[actionButton.dataset.action](actionButton);
        }
    });
}