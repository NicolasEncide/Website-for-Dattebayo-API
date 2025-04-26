import * as utils from "./utils.js";
import * as api from "./api.js";

export const searchState = {
    searchOption: "characters"
};

utils.windowLoad();

export const searchFull = () => {
    const text = document.getElementById("searchInput").value;
    if (!text) {
        alert("Please, enter a name.");
        return;
    }
    api.searchCharactersFull(searchState.searchOption, text);
}

export const searchPartial = () => {
    const text = document.getElementById("searchInput").value;
    if (!text) {
        alert("Please, enter a name.");
        return;
    }
    api.searchCharactersPartial(searchState.searchOption, text);
}

// Função para limpar todos os resultados
export const clear = () => {
    const container = document.getElementById("data-container");
    const results = container.querySelectorAll(".result");
    results.forEach(result => result.remove());
}