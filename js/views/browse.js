/* Author: Cameron Goit (cgoit092@mtroyal.ca)

    browse.js - the brose view

*/

import { getCategories } from "../data.js";
import { registerAction, registerView } from "../router.js";
import { createElement, formatCategory, formatMoney, showProducts, starText } from "../ui.js";

const sorters = {
    name:       (a, b) => a.title.localeCompare(b.title),
    priceLow:   (a, b) => a.price - b.price,
    priceHigh:  (a, b) => b.price - a.price,
    category:   (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
};

export function setupBrowseView(products) {
    const filterSection = document.querySelector("#filter");
    const nameInput = document.querySelector("#filterName");
    const overInput = document.querySelector("#filterOver");
    const underInput = document.querySelector("#filterUnder");
    const categoryOptions = document.querySelector("#categoryOptions");
    const ratingOptions = document.querySelector("#ratingOptions");
    const sortSelect = document.querySelector("#sortSelect");
    const resultsGrid = document.querySelector("#resultGrid");
    const resultCount = document.querySelector("#resultCount");
    const noMatches = document.querySelector("#noMatches");
    const chipList = document.querySelector("#activeFilters");

    buildCategoryOptions();
    buildRatingOptions();

    filterSection.addEventListener("input", update);
    sortSelect.addEventListener("change", update);

    registerAction("clear-filters", () => {
        clearAllFilters();
        update();
    });

    registerAction("remove-filter", button => {
        clearControl(document.querySelector("#" + button.dataset.control));
        update();
    });

    //Runs each time the Browse view is shown.
    registerView("browse", params => {
        if (params.category)
        {
            clearAllFilters();
            document.querySelector("#category-" + params.category).checked = true;
        }
        update();
    });

    function buildCategoryOptions() {
        getCategories(products).forEach( category => {
            const count = products.filter( product => product.category === category ).length;
            categoryOptions.appendChild(
                createOption("category-" + category, category, formatCategory(category), count)
            );
        });
    }

    function buildRatingOptions() {
        for (let stars = 5; stars >= 1; stars--) {
            const count = products.filter( product => Math.round(product.rating) === stars ).length;
            const option = createOption("rating-" + stars, stars, starText(stars), count);
            option.querySelector(".option-text").classList.add("stars");
            ratingOptions.appendChild(option);
        }
    }

    function createOption(id, value, text, count) {
        const label = createElement("label", "option");
        const checkbox = createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.value = value;

        label.appendChild(checkbox);
        label.appendChild(createElement("span", "option-text", text));
        label.appendChild(createElement("span", "option-count", count));
        return label;
    }

    /* Reading filters */

    function checkedValues(container) {
        const checked = container.querySelectorAll("input:checked");
        return Array.from(checked).map( checkbox => checkbox.value );
    }

    function numberOrNull(input) {
        return input.value === "" ? null : Number(input.value);
    }

    function readFilters() {
        return {
            name: nameInput.value.trim().toLowerCase(),
            categories: checkedValues(categoryOptions),
            ratings: checkedValues(ratingOptions).map(Number),
            over: numberOrNull(overInput),
            under: numberOrNull(underInput)
        };
    }

    /* True if the product passes every filter. Unused filters always pass */
    function matches(product, filters) {
        const nameOk = product.title.toLowerCase().includes(filters.name);
        const categoryOk = filters.categories.length === 0 || filters.categories.includes(product.category);
        const ratingOk = filters.ratings.length === 0 || filters.ratings.includes(Math.round(product.rating));
        const overOk = filters.over === null || product.price > filters.under;
        const underOk = filters.under === null || product.price < filters.under;
        return nameOk && categoryOk && ratingOk && overOk && underOk;
    }

    /* Show the results */
    function update() {
        const filters = readFilters();
        const results = products
            .filter( product => matches(product, filters) )
            .sort( sorters[sortSelect.value] );
        
            showProducts(resultsGrid, results);
            resultCount.textContent = `Showing ${results.length} of ${products.length} products`;
            noMatches.classList.toggle("hidden", results.length > 0);
            showChips(filters);
    }

    function showChips(filters) {
        chipList.replaceChildren();

        if (filters.name !== "") {
            addChip(`Name: "${nameInput.value.trim()}"`, nameInput);
        }
        categoryOptions.querySelectorAll("input:checked").forEach( checkbox => {
            addChip(formatCategory(checkbox.value), checkbox);
        });
        ratingOptions.querySelectorAll("input:checked").forEach( checked => {
            addChip(checked.value + " star rating", checked);
        });
        if (filters.over !== null) {
            addChip("Over " + formatMoney(filters.over), overInput);
        }
        if (filters.under !== null) {
            addChip("Under " + formatMoney(filters.under), underInput);
        }

        // only show "Clear all" when there is something to clear
        if (chipList.children.length > 0) {
            const clearAll = createElement("button", "chip-clear", "Clear all");
            clearAll.type = "button";
            clearAll.dataset.action = "clear-filters";
            chipList.appendChild(clearAll);
        }
    }

    function addChip(text, control) {
        const chip = createElement("span", "chip", text);
        const remove = createElement("button", "", "x");
        remove.type = "button";
        remove.title = "Remove this filter";
        remove.dataset.action = "remove-filter";
        remove.dataset.control = control.id;
        chip.appendChild(remove);
        chipList.appendChild(chip);
    }

    /* Clear filters */
    function clearControl(control) {
        if (control.type === "checkbox") {
            control.checked = false;
        } else {
            control.value = "";
        }
    }

    function clearAllFilters() {
        filterSection.querySelectorAll("input").forEach(clearControl);
    }
}

