export const normalizeString = function(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
export const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export const createElement = function(tag, text, attributes = {}) {
    const element = document.createElement(tag);
    element.textContent = text;
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}
