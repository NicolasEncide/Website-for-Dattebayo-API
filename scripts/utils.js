import * as main from "./main.js";
import * as api from "./api.js";

// Função para normalizar uma string (tornar tudo minúsculo e retirar acentos)
export const normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Função para capitalizar uma string
export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para criar e inserir um elemento HTML em um elemento pai (opcional)
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

// Função para travar os botôes e inputs e mostrar a div de carregamento
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

// Função para modificar a opção de busca
const searchOptionSet = (searchOption) => {
    main.globalVar.searchOption = searchOption;
    if (searchOption === "characters") {
        document.getElementById("searchInput").placeholder = "Search by name";
        alert("You are now searching a character by name.");
    } else {
        document.getElementById("searchInput").placeholder = `Search by ${searchOption.slice(0,-1)}`;
        alert(`You are now searching a character by ${searchOption.slice(0,-1)}.`);
    }
    console.log(`The current search option is ${main.globalVar.searchOption}`)
}

// Função para o debounce
export const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
    };
}

// Função para inicialização da página
export const windowLoad = () => {
    localStorage.clear();
    loadingLock(true);
    api.APIPreload("characters");
    api.APIPreload("clans");
    api.APIPreload("villages");
    document.getElementById("characters").onclick = () => searchOptionSet("characters");
    document.getElementById("clans").onclick = () => searchOptionSet("clans");
    document.getElementById("villages").onclick = () => searchOptionSet("villages");
    document.getElementById("clear").onclick = () => main.clearPage();
    document.getElementById("btnFullSearch").onclick = () => main.searchFull();
    document.getElementById("btnPartialSearch").onclick = () => main.searchPartial();
    const debounceButton = document.getElementById("toggleDebounce");   // Assim, o debounce pode ser ativado ou desativado através de um botão
    debounceButton.onclick = () => {
        main.globalVar.isDebounceEnabled = !main.globalVar.isDebounceEnabled;
        debounceButton.textContent = main.globalVar.isDebounceEnabled ? "Disable debounce" : "Enable debounce";
        console.log(`Debounce is now ${main.globalVar.isDebounceEnabled ? "enabled" : "disabled"}`);
    };
    loadingLock(false);
}