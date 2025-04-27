import * as main from "./main.js";
import * as api from "./api.js";

export const normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const createAndInsertElement = (tag, text = null, HTML = null, attributes = {}, fatherElement = null) => {
    const element = document.createElement(tag);
    if (text && HTML) {
        return;
    } else if (!text && HTML) {
        element.innerHTML = HTML;
    } else {
        element.textContent = text;
    }
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if (!fatherElement) {
        return element;
    }
    fatherElement.appendChild(element);
}

export const loadingLock = (bool) => {
    document.querySelectorAll("button", "input").forEach(item => {
        item.disabled = bool;
    });

    if (bool) {
        document.getElementById("loading").style.display = "block";
        return;
    }

    document.getElementById("loading").style.display = "none";
}

const searchOptionSet = (searchOption) => {
    main.searchState.searchOption = searchOption;
    if (searchOption === "characters") {
        document.getElementById("searchInput").placeholder = "Search by name";
    } else {
        document.getElementById("searchInput").placeholder = `Search by ${searchOption.slice(0,-1)}`;
    }
    console.log(`The current search option is ${main.searchState.searchOption}`)
}

export const windowLoad = () => {
    localStorage.clear();
    loadingLock(true);
    api.APIPreload("characters");
    api.APIPreload("clans");
    api.APIPreload("villages");
    document.getElementById("characters").onclick = () => searchOptionSet("characters");
    document.getElementById("clans").onclick = () => searchOptionSet("clans")
    document.getElementById("villages").onclick = () => searchOptionSet("villages");
    document.getElementById("clear").onclick = () => main.clear();
    document.getElementById("btnFullSearch").onclick = () => main.searchFull();
    document.getElementById("btnPartialSearch").onclick = () => main.searchPartial();
    loadingLock(false);
}