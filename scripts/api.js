import * as utils from "./utils.js";

export const windowLoad = async function() {
    try {
        const url = "https://dattebayo-api.onrender.com/characters?limit=1431";
        const response = await fetch(url);
        if (!response.ok) { throw new Error("Failed to retrieve data from API.") }
        const characterslist = await response.json();
        if (!characterslist.characters) { throw new Error("The API did not return data.") }

        const normalizedData = characterslist.characters.map(char => ({
            id: char.id,
            name: utils.normalizeString(char.name)
        }));
        localStorage.setItem("characters", JSON.stringify(normalizedData));
    } catch (error) {
        alert(error.message);
        return;
    }
}

export const searchCharacterFull = async function(name) {
    try {
        const characterslist = JSON.parse(localStorage.getItem("characters")) || [];
        const result = characterslist.find(char => char.name === name);
        if (result) {
            const details = await fetchAndCacheDetails(result.id);
            if (!details) { return; }
            limitCache(15);
    
            console.log("Character details: ", details);
            return details;
        } 
        throw new Error("Character not found");
    } catch (error) {
        alert(error.message);
        return null;      
    }
}
export const searchCharacterPartial = async function(name) {
    try {
        const characterslist = JSON.parse(localStorage.getItem("characters")) || [];
        const result = characterslist.find(char => char.name.includes(name));
        if (result) {
            const details = await fetchAndCacheDetails(result.id);
            if (!details) { return; }
            limitCache(15);
    
            console.log("Character details: ", details);
            return details;
        } 
        throw new Error("Character not found");
    } catch (error) {
        alert(error.message);
        return null;      
    }
}

const fetchAndCacheDetails = async function(id) {
    // Verificar se o personagem já está no cache
    try {
        const cachedCharacter = JSON.parse(localStorage.getItem('character_' + id));
        if (cachedCharacter) {
            console.log('Details found in cache:');
            return cachedCharacter;
        }
    
        // Buscar os detalhes na API
        const response = await fetch(`https://dattebayo-api.onrender.com/characters/${id}`);
        if (!response.ok) { throw new Error("Failed to retrieve data from API.") }
        const characterDetails = await response.json();
        if (!characterDetails) { throw new Error("The API did not return data.") }

        // Salvar os detalhes no localStorage
        localStorage.setItem('character_' + id, JSON.stringify(characterDetails));
        console.log('Details found in API:');
        return characterDetails;
    } catch (error) {
        alert(error.message);
        return null;
    }
}

const limitCache = function(maxEntries) {
    const characters = JSON.parse(localStorage.getItem('characters')) || [];
    const cachedDetails = [];

    // Coleta todas as chaves que armazenam detalhes completos
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('character_')) {
            cachedDetails.push(key);
        }
    }

    // Remover registros antigos se exceder o limite
    if (cachedDetails.length > maxEntries) {
        const keysToRemove = cachedDetails.slice(0, cachedDetails.length - maxEntries);
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('Old registers removed:', keysToRemove);
    }
}