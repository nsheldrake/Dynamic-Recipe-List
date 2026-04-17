import {createContext, useEffect, useState} from "react";
import {loadFavourites, saveFavourites} from "../utils/storage.js";

const FavouritesContext = createContext();

// Provider component that wraps the app and exposes shared favourites state
function FavouritesProvider({children}) {

    const [favourites, setFavourites] = useState(() => loadFavourites());

    //Persist favourites whenever they change
    useEffect(() => {
        saveFavourites(favourites);
    }, [favourites]);

    //toggle a team member as a favourite
    const toggleFavourite = (recipeSlug) => {
        setFavourites((prev) => {
            if(prev.includes(recipeSlug)){
                return prev.filter((slug) => slug !== recipeSlug)
            }
            return [...prev, recipeSlug];
        });
    }

    //shared values exposed to all children of this provider
    const value = {
        favourites,
        toggleFavourite
    };

    return (
        <FavouritesContext.Provider value={value}>
            {children}
        </FavouritesContext.Provider>
    );

}

export {FavouritesContext, FavouritesProvider};