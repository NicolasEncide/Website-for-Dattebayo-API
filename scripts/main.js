import * as utils from "./utils.js";
import * as api from "./api.js";

// Variáveis globais - Precisa ser um objeto pois vira um atributo read-only quando é exportado, no qual não pode ser modificado
export const globalVar = {
    searchOption: "characters", // Opção de busca
    isDebounceEnabled: true, // Flag do debounce
    itemsPerPage: 4, // Número de personagens por página
    currentPage: 1 // Página atual
};

// Inicializar a página
utils.windowLoad();

export const searchFull = async () => {
    const text = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!text) {
        alert("Please, enter a name.");
        return;
    }
    const results = await api.searchCharactersFull(globalVar.searchOption, text);
    handleSearchResults(results);
    limitCache(30);
}

export const searchPartial = async () => {
    const text = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!text) {
        alert("Please, enter a name.");
        return;
    }
    const results = await api.searchCharactersPartial(globalVar.searchOption, text);
    handleSearchResults(results);
    limitCache(30);
}

// Debounce

const debouncedSearchPartial = utils.debounce(searchPartial, 500); // Busca com debounce
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    if (globalVar.isDebounceEnabled) {
        debouncedSearchPartial();
    }
});

const handleSearchResults = (data) => {
    if (!data || data.length === 0) {
        alert("No results found.");
        return;
    }

    globalVar.currentPage = 1; // Redefine para a primeira página
    displayCharacters(data, globalVar.currentPage, globalVar.itemsPerPage); // Exibe a primeira página
    createPaginationButtons(data, globalVar.itemsPerPage); // Configura a paginação
};

const createPaginationButtons = (data, itemsPerPage) => {
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = ""; // Limpa os botões antigos

    const totalPages = Math.ceil(data.length / itemsPerPage); // Calcula o número total de páginas

    for (let i = 1; i <= totalPages; i++) {
        const button = utils.createAndInsertElement("button", i, null, {class: "pagination-button"});

        button.addEventListener("click", () => {
            globalVar.currentPage = i; // Atualiza a página atual
            displayCharacters(data, globalVar.currentPage, itemsPerPage); // Exibe os personagens da página atual
        });

        paginationContainer.appendChild(button);
    }
};

const displayCharacters = (data, currentPage, itemsPerPage) => {
    if (!data) {
        console.log("Character not found.")
        return;
    }
    const container = document.getElementById("data-container");
    clearPage();
        // Calcula os índices dos personagens a serem exibidos
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
    
        // Obtém os personagens da página atual
        const charactersToDisplay = data.slice(startIndex, endIndex);
    
    for (const character of charactersToDisplay) {
        const div = utils.createAndInsertElement("div", null, null, {class: "result"}, null);
        // Nome
        utils.createAndInsertElement("h3", character.name, null, {}, div);
        // Imagens
        if (Array.isArray(character.images)) {
            for (const image of character.images) {
                utils.createAndInsertElement("img", null, null, {src: image, alt: character.name}, div)
            }
        } else {
            utils.createAndInsertElement("li", "No images Available", null, {}, div)
        }

        // Estréia e família
        let primaryUL = utils.createAndInsertElement("ul", null,
            `
            <li>Anime debut: ${character.debut?.anime || "None"}</li>
            </ul>
            </li>
            `
            , {}, null);
            const primaryLI6 = utils.createAndInsertElement("li", "Family")
            const members = utils.createAndInsertElement("ul");
            if (character.family) {
                for (const member in character.family) {
                    utils.createAndInsertElement("li", `${utils.capitalize(member)}: ${character.family[member]}`, null, {}, members);
                }
            } else {
                utils.createAndInsertElement("li", "No Family Members Available", null, {}, members);
            }

            primaryLI6.appendChild(members);
            primaryUL.appendChild(primaryLI6);
        // Jutsu
        const primaryLI0 = utils.createAndInsertElement("li", "Jutsu:");
        const jutsus = utils.createAndInsertElement("ul");
        
        if (Array.isArray(character.jutsu) && character.jutsu.length > 0) {
            for (const jutsu of character.jutsu) {
                utils.createAndInsertElement("li", jutsu, null, {}, jutsus);
            }
        } else {
            utils.createAndInsertElement("li", "No Jutsu Available", null, {}, jutsus);
        }
        
        primaryLI0.appendChild(jutsus);
        primaryUL.appendChild(primaryLI0);
        // Tipos de Natureza
        const primaryLI1 = utils.createAndInsertElement("li", "Nature Type:");
        const natures = utils.createAndInsertElement("ul");
        
        if (Array.isArray(character.natureType) && character.natureType.length > 0) {
            for (const nature of character.natureType) {
                utils.createAndInsertElement("li", nature, null, {}, natures);
            }
        } else {
            utils.createAndInsertElement("li", "No Nature Types Available", null, {}, natures);
        }
        
        primaryLI1.appendChild(natures);
        primaryUL.appendChild(primaryLI1);
        // Informações Pessoais
        primaryUL.innerHTML +=
        `
        <li>
        Personal: <ul>
        <li>Birthdate: ${character.personal?.birthdate || "None"}</li>
        <li>Sex: ${character.personal?.sex || "None"}</li>
        </ul>
        </li>
        `;
        // Classificações
        const primaryLI2 = utils.createAndInsertElement("li", "Classification:");
        const classifications = utils.createAndInsertElement("ul");
        
        if (Array.isArray(character.personal?.classification) && character.personal.classification.length > 0) {
            for (const clas of character.personal.classification) {
                utils.createAndInsertElement("li", clas, null, {}, classifications);
            }
        } else {
            utils.createAndInsertElement("li", "No classification available", null, {}, classifications);
        }
        
        primaryLI2.appendChild(classifications);
        primaryUL.appendChild(primaryLI2);
        // Besta de Caudas
        primaryUL.innerHTML +=
        `
        <li>Tailed Beast: ${character.personal?.tailedBeast || "None"}</li>
        `;
        // Ocupações
        const primaryLI3 = utils.createAndInsertElement("li", "Occupation:");
        const occupations = utils.createAndInsertElement("ul");
        
        if (Array.isArray(character.personal?.occupation) && character.personal.occupation.length > 0) {
            for (const ocu of character.personal.occupation) {
                utils.createAndInsertElement("li", ocu, null, {}, occupations);
            }
        } else {
            utils.createAndInsertElement("li", "No Occupations Available", null, {}, occupations);
        }
        
        primaryLI3.appendChild(occupations);
        primaryUL.appendChild(primaryLI3);
        // Afiliação
        const primaryLI4 = utils.createAndInsertElement("li", "Affiliation:");
        const affiliations = utils.createAndInsertElement("ul");
        
        if (Array.isArray(character.personal?.affiliation) && character.personal.affiliation.length > 0) {
            for (const aff of character.personal.affiliation) {
                utils.createAndInsertElement("li", aff, null, {}, affiliations);
            }
        } else {
            utils.createAndInsertElement("li", character.personal?.affiliation, null, {}, affiliations);
        }
        
        primaryLI4.appendChild(affiliations);
        primaryUL.appendChild(primaryLI4);
        // Times
        const primaryLI5 = utils.createAndInsertElement("li", "Teams:");
        const teams = utils.createAndInsertElement("ul");
        
        if (Array.isArray(character.personal?.team) && character.personal.team.length > 0) {
            for (const team of character.personal.team) {
                utils.createAndInsertElement("li", team, null, {}, teams);
            }
        } else {
            utils.createAndInsertElement("li", "No Teams Available", null, {}, teams);
        }
        
        primaryLI5.appendChild(teams);
        primaryUL.appendChild(primaryLI5);
        // Clãs
        primaryUL.innerHTML +=
        `
        <li>Clan: ${character.personal?.clan || "None"}</li>
        `;

        div.appendChild(primaryUL);
        container.appendChild(div);
    }
}

// Função para limpar todos os resultados
export const clearPage = () => {
    const container = document.getElementById("data-container");
    const results = container.querySelectorAll(".result");
    results.forEach(result => result.remove());
}

const limitCache = (maxEntries) => {
    const cachedDetails = [];

    // Coleta todos registros detalhados de personagens no cache
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('character_')) {
            cachedDetails.push(key);
        }
    }

    // Remove os registros se exceder o limite
    if (cachedDetails.length > maxEntries) {
        const keysToRemove = cachedDetails.slice(0, cachedDetails.length - maxEntries);
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Old registers removed: ${keysToRemove}`);
    }
}