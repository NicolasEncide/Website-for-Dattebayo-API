import * as utils from "./utils.js";

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

export const searchCharactersFull = async (searchOption, name) => {
    try {
        if (searchOption === "characters") {
            const characterslist = JSON.parse(localStorage.getItem("characterslist")) || [];
            const result = characterslist.find(char => char.name === name);
            if (result) {
                                console.log(`${searchOption.slice(0,-1)} found.`);
                const details = await fetchAndCacheDetails(result.id);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                return details;
            }
            throw new Error("Character not found");
        } else {
            const contentlist = JSON.parse(localStorage.getItem(`${searchOption}list`)) || [];
            const result = contentlist.find(item => item.name === name);
            if (result) {
                console.log(`${searchOption.slice(0,-1)} found.`);
                const details = await fetchAndCacheDetails(result.characters);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                return details;
            }
            throw new Error("Character not found");
        }
    } catch (error) {
        alert(error.message);
        return null;
    }
}

export const searchCharactersPartial = async (searchOption, name) => {
    try {
        if (searchOption === "characters") {
            const characterslist = JSON.parse(localStorage.getItem("characterslist")) || [];
            const result = characterslist.find(char => char.name.includes(name));
            if (result) {
                console.log("Character found.");
                const details = await fetchAndCacheDetails(result.id);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                return details;
            }
            throw new Error("Character not found");
        } else {
            const contentlist = JSON.parse(localStorage.getItem(`${searchOption}list`)) || [];
            const result = contentlist.find(item => item.name.includes(name));
            if (result) {
                console.log(`${searchOption.slice(0,-1)} found.`);
                const details = await fetchAndCacheDetails(result.characters);
                if (!details) { return null; }
        
                console.log("Character details: ", details);
                return details;
            }
            throw new Error("Character not found");
        }
    } catch (error) {
        alert(error.message);
        return null;
    }
}

const fetchAndCacheDetails = async (ids) => {
    try {
        let cachedCharactersArray = [];
        let APICharactersArray = [];
        // Processa se o parâmetro é um array de ids
        if (Array.isArray(ids)) {

            for (let id of ids) {
                const cachedCharacter = JSON.parse(localStorage.getItem('character_' + id));
                if (cachedCharacter) {
                    cachedCharactersArray.push(cachedCharacter);
                } else {
                    console.log("Character not found in cache, I will search in API later.");
                    APICharactersArray.push(id);
                }
            }           
        } else {
            // Se não for um array, e estiver no cache, retorna o personagem
            const cachedCharacter = JSON.parse(localStorage.getItem('character_' + ids));
            if (cachedCharacter) {
            console.log("Details found in cache.");
            return cachedCharacter;
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
            APIResultsArray = await response.json();
            if (!APIResultsArray) { throw new Error("The API did not return data.") }
    
            // Salvar os detalhes no localStorage
            for (let character of APIResultsArray) {
                console.log('Details found in API:');
                console.log(character);
                console.log('Saving in cache.');
                localStorage.setItem("character_" + character.id, JSON.stringify(character)); // Salvando no localStorage
            }
            
        }
        return [...cachedCharactersArray, ...APIResultsArray]; // Operador de espalhamento para combinar os dois arrays em um
    } catch (error) {
        alert(error.message);
        return null;
    }
}