import * as utils from "./utils.js";
import * as main from "./main.js";

// Função de pré-carregamento dos dados pela API
export const APIPreload = async (searchOption) => {
    try {
        const url = `https://dattebayo-api.onrender.com/${searchOption}?limit=1431`;
        const response = await fetch(url);
        if (!response.ok) { throw new Error("Failed to retrieve data from API. Please, reload the page.") }
        const contentlist = await response.json();
        if (!contentlist) { throw new Error("The API did not return data. Please, reload the page.") }

        let normalizedData = contentlist[searchOption].map(item => ({
            id: item.id,
            name: utils.normalizeString(item.name),
            ...(item.characters && { characters: item.characters }) // Só adiciona a propriedade characters se ela existir
        }));

        localStorage.setItem(`${searchOption}list`, JSON.stringify(normalizedData));
        console.log(searchOption + ":");
        console.log(normalizedData);
    } catch (error) {
        alert(error.message);
        return;
    }
}

// Função de busca por nome completo, o parâmetro searchOption diz pra função se eu estou buscando personagens pelo nome, clã ou vila
export const searchCharactersFull = async (searchOption, name) => {
    try {
        utils.loadingLock(true);
        if (searchOption === "characters") {
            const characterslist = JSON.parse(localStorage.getItem("characterslist")) || [];
            const result = characterslist.find(char => char.name === name);
            if (result) {
                console.log(`${searchOption.slice(0,-1)} found.`);
                const details = await fetchAndCacheDetails(result.id);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                utils.loadingLock(false);
                return details;
            }
            throw new Error(`${searchOption.slice(0,-1)} not found.`);
        } else {
            utils.loadingLock(true);
            main.clearPage();
            const contentlist = JSON.parse(localStorage.getItem(`${searchOption}list`)) || [];
            const result = contentlist.find(item => item.name === name);
            if (result) {
                console.log(`${searchOption.slice(0,-1)} found.`);
                const details = await fetchAndCacheDetails(result.characters);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                utils.loadingLock(false);
                return details;
            }
            throw new Error(`${searchOption.slice(0,-1)} not found.`);
        }
    } catch (error) {
        alert(error.message);
        utils.loadingLock(false);
        return null;
    }
}

// Mesma coisa do anterior, mas para nomes parciais
export const searchCharactersPartial = async (searchOption, name) => {
    try {
        utils.loadingLock(true);
        if (searchOption === "characters") {
            const characterslist = JSON.parse(localStorage.getItem("characterslist")) || [];
            const result = characterslist.find(char => char.name.includes(name)); // Verifica se o nome passado está incluído em algum personagem
            if (result) {
                console.log("Character found.");
                const details = await fetchAndCacheDetails(result.id);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                utils.loadingLock(false);
                return details;
            }
            throw new Error(`${searchOption.slice(0,-1)} not found.`);
        } else {
            utils.loadingLock(true);
            main.clearPage();
            const contentlist = JSON.parse(localStorage.getItem(`${searchOption}list`)) || [];
            const result = contentlist.find(item => item.name.includes(name));
            if (result) {
                console.log(`${searchOption.slice(0,-1)} found.`);
                const details = await fetchAndCacheDetails(result.characters);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                utils.loadingLock(false);
                return details;
            }
            throw new Error(`${searchOption.slice(0,-1)} not found.`);
        }
    } catch (error) {
        alert(error.message);
        utils.loadingLock(false);
        return null;
    }
}

// Função única para busca no cache e na API, me retornando o que já está salvo no cache, e caso não esteja já faz a requisição na API.
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;
const fetchAndCacheDetails = async (ids) => {
    try {
        let cachedCharactersArray = [];
        let APICharactersArray = [];
        // Executa se o parâmetro é um array de ids, posso buscar vários personagens em apenas uma requisição
        if (Array.isArray(ids)) {
            for (let id of ids) {
                const cachedCharacter = JSON.parse(localStorage.getItem('character_' + id));
                if (cachedCharacter && (Date.now() - cachedCharacter.timestamp < CACHE_EXPIRATION_MS)) {
                    console.log("Character found in cache.");
                    console.log(cachedCharacter);
                    cachedCharactersArray.push(cachedCharacter.data);
                } else {
                    console.log("Character not found in cache, I will search in API later.");
                    APICharactersArray.push(id);
                }
            }           
        } else {
            // Se não for um array, e estiver no cache, retorna o personagem
            const cachedCharacter = JSON.parse(localStorage.getItem('character_' + ids));
            if (cachedCharacter && (Date.now() - cachedCharacter.timestamp < CACHE_EXPIRATION_MS)) {
            console.log("Details found in cache.");
            return [cachedCharacter.data];
            } else {
                // Se não for um array, e não estiver no cache, será buscado na API
                console.log("Details not found in cache, I will search in API.")
                APICharactersArray.push(ids);
            }
        }

        let APIResultsArray = [];
        // Buscar os detalhes na API
        if (APICharactersArray.length > 0) {
            const response = await fetch(`https://dattebayo-api.onrender.com/characters/${APICharactersArray.join(",")}?limit=1431`);
            if (!response.ok) { throw new Error("Failed to retrieve data from API.") }
            const results  = await response.json();
            APIResultsArray = Array.isArray(results) ? results : [results];
            if (!APIResultsArray) { throw new Error("The API did not return data.") }
    
            // Salva os detalhes no localStorage
                for (let character of APIResultsArray) {
                    console.log('Details found in API:');
                    console.log(character);
                    console.log('Saving in cache.');
                    localStorage.setItem("character_" + character.id, JSON.stringify({
                        data: character,
                        timestamp: Date.now()
                    }));
    
                }
        }
        return [...cachedCharactersArray, ...APIResultsArray]; // Operador spread para combinar os dois arrays em um
    } catch (error) {
        alert(error.message);
        utils.loadingLock(false);
        return null;
    }
}