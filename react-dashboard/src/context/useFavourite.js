import { useContext } from "react";
import { FavouritesContext } from "./FavouritesContext.jsx";

// Our custom hook to make consuming the context easy and clean
function useFavourites(){
    const context = useContext(FavouritesContext);

    if(!context) {
        throw new Error('useFavourites must be used within a FavouritesProvider');
    }
    return context;
}

export default useFavourites;