import * as utils from "./utils.js";
import * as api from "./api.js";

export const searchState = {    // Precisa ser um objeto pois vira um atributo read-only quando é exportado, no qual não pode ser modificado
    searchOption: "characters"
};

utils.windowLoad();

export const searchFull = async () => {
    const text = document.getElementById("searchInput").value;
    if (!text) {
        alert("Please, enter a name.");
        return;
    }
    const results = await api.searchCharactersFull(searchState.searchOption, text);
    displayCharacters(results);
    limitCache(100);
}

export const searchPartial = async () => {
    const text = document.getElementById("searchInput").value;
    if (!text) {
        alert("Please, enter a name.");
        return;
    }
    const results = await api.searchCharactersPartial(searchState.searchOption, text);
    displayCharacters(results);
    limitCache(100);
}

// Função para limpar todos os resultados
export const clear = () => {
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

const displayCharacters = (data) => {
    const container = document.getElementById("data-container");
    for (const character of data) {
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
// const displayCharacters = (data) => {
//     const container = document.getElementById("data-container");

//     for (const character of data) {
//         const div = utils.createAndInsertElement("div", null, null, { class: "result" }, container);

//         utils.createAndInsertElement("h3", character.name, null, {}, div);

//         if (Array.isArray(character.images) && character.images.length > 0) {
//             for (const image of character.images) {
//                 utils.createAndInsertElement("img", null, null, { src: image, alt: character.name }, div);
//             }
//         } else {
//             utils.createAndInsertElement("p", "No images Available", null, {}, div);
//         }

//         const primaryUL = utils.createAndInsertElement("ul", null, null, {}, div);

//         utils.createAndInsertElement("li", `Anime debut: ${character.debut?.anime || "None"}`, null, {}, primaryUL);

//         const members = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Family:", null, {}, primaryUL));

//         if (character.family) {
//             for (const member in character.family) {
//                 utils.createAndInsertElement("li", `${utils.capitalize(member)}: ${character.family[member]}`, null, {}, members);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Family Members Available", null, {}, members);
//         }

//         const jutsus = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Jutsu:", null, {}, primaryUL));

//         if (Array.isArray(character.jutsu) && character.jutsu.length > 0) {
//             for (const jutsu of character.jutsu) {
//                 utils.createAndInsertElement("li", jutsu, null, {}, jutsus);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Jutsu Available", null, {}, jutsus);
//         }

//         const natures = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Nature Type:", null, {}, primaryUL));

//         if (Array.isArray(character.natureType) && character.natureType.length > 0) {
//             for (const nature of character.natureType) {
//                 utils.createAndInsertElement("li", nature, null, {}, natures);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Nature Types Available", null, {}, natures);
//         }

//         const personalDetails = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Personal:", null, {}, primaryUL));

//         utils.createAndInsertElement("li", `Birthdate: ${character.personal?.birthdate || "None"}`, null, {}, personalDetails);
//         utils.createAndInsertElement("li", `Sex: ${character.personal?.sex || "None"}`, null, {}, personalDetails);

//         const classifications = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Classification:", null, {}, primaryUL));

//         if (Array.isArray(character.personal?.classification) && character.personal.classification.length > 0) {
//             for (const clas of character.personal.classification) {
//                 utils.createAndInsertElement("li", clas, null, {}, classifications);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Classification Available", null, {}, classifications);
//         }

//         utils.createAndInsertElement("li", `Tailed Beast: ${character.personal?.tailedBeast || "None"}`, null, {}, primaryUL);

//         const occupations = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Occupation:", null, {}, primaryUL));

//         if (Array.isArray(character.personal?.occupation) && character.personal.occupation.length > 0) {
//             for (const ocu of character.personal.occupation) {
//                 utils.createAndInsertElement("li", ocu, null, {}, occupations);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Occupations Available", null, {}, occupations);
//         }

//         const affiliations = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Affiliation:", null, {}, primaryUL));

//         if (Array.isArray(character.personal?.affiliation) && character.personal.affiliation.length > 0) {
//             for (const aff of character.personal.affiliation) {
//                 utils.createAndInsertElement("li", aff, null, {}, affiliations);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Affiliations Available", null, {}, affiliations);
//         }

//         const teams = utils.createAndInsertElement("ul", null, null, {}, 
//             utils.createAndInsertElement("li", "Teams:", null, {}, primaryUL));

//         if (Array.isArray(character.personal?.team) && character.personal.team.length > 0) {
//             for (const team of character.personal.team) {
//                 utils.createAndInsertElement("li", team, null, {}, teams);
//             }
//         } else {
//             utils.createAndInsertElement("li", "No Teams Available", null, {}, teams);
//         }

//         utils.createAndInsertElement("li", `Clan: ${character.personal?.clan || "None"}`, null, {}, primaryUL);
//     }
// };