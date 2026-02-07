// This utility module demonstrates ES modules (ESM) - the modern way to organize reusable code
// We first export functions for localStorage
// NOTE: localStorage stores strings, so we use JSON.stringify/parse for objects

// Save form data as JSON string in localStorage
export function saveFormDraft(data, useSession = false) {
    // Convert object to string for storage
    const storage = useSession ? sessionStorage : localStorage;     // toggle between local/session storage
    storage.setItem('formDraft', JSON.stringify(data));
}

// Load and parse saved data (returns object or empty if none)
export function loadFormDraft(useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;     // Toggle on or off
    const saved = storage.getItem('formDraft');
    if(saved) {
        try{
            return JSON.parse(saved);   // Parse string back to object form
        } catch(err) {
            console.log('Error parsing draft: ', err);
            return {};   // Fallback to empty if corrupt
        }
    }
    return {};  // No draft, means empty object
}

// Clear any saved form data
export function clearFormDraft() {
    localStorage.removeItem('formDraft');
}

// Save favourite recipes in local storage
export function saveFavourites(favourites, useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;     // toggle between local/session storage
    storage.setItem('favouriteRecipes', JSON.stringify(favourites));
}

// Load favourite recipes from local storage
export function loadFavourites(useSession = false) {
    const storage = useSession ? sessionStorage : localStorage;     // Toggle on or off
    const savedFavourite = storage.getItem('favouriteRecipes');
    if(savedFavourite) {
        try{
            return JSON.parse(savedFavourite);   // Parse string back to object form
        } catch(err) {
            console.log('Error parsing recipe: ', err);
            return [];   // Fallback to empty if corrupt
        }
    }
    return [];  // No draft, means empty object
}