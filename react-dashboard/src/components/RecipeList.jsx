/**
 * RecipeList.jsx
 * This component fetches recipe data from a local JSON file and renders it as a grid or cards
 * It demonstrates useState for data/error/loading, userEffect for side effects (of fetching)
 * and dynamic rendering with map().
 */

import {useState, useEffect} from 'react';
import {saveFavourites, loadFavourites} from "../utils/storage.js";

function RecipeList(){

    // State to hold the array of recipes
    const [recipe, setRecipe] = useState([]);

    // Loading state: shows spinner/message while data is loading
    const [loading, setLoading] = useState(true);

    // Error state: stores any fetch errors to display to the user
    const [error, setError] = useState(null);

    // Favourites: stores favourite recipes
    const [favourites, setFavourites] = useState([]);


    useEffect( () => {
        const fetchRecipe = async () => {
            try{
                const response = await fetch('/src/data/recipe.json');
                const {ok, status} = response;   // ES6 destructuring
                if(!ok){
                    throw new Error(`Failed to load recipe data (status: ${status}`);   // Template/String Literal for Error message
                }

                const data = await response.json();
                setRecipe(data);             //Update recipe state with fetched data
                setLoading(false);   //Update loaded state after load completes

            }catch(err){
                setError(err.message);    //Store the error message
                setLoading(false);  //Stop loading if an error occurs
            }
        };

        fetchRecipe();  //Call async fetch for data

        // Load favourites from storage
        setFavourites(loadFavourites);

    }, []);  //Empty array, run only after the first render

    // Reference: https://stackoverflow.com/questions/59291164/toggle-color-of-button-added-to-favorites-in-react
    // I used this as a reference to create the functionality that allows me to toggle a recipe being a favourite or not
    // Toggle functionality for favourite recipes
    const toggleFavourite = (recipeName) => {
        // Store updated favourites array
        let updatedFavourites;
        // If recipe is in the favourites array
        if (favourites.includes(recipeName)){
            // Remove recipe from the favourites array
            updatedFavourites = favourites.filter(name => name !== recipeName);
        // Else
        } else {
            // Add recipe to the new favourites array
            updatedFavourites = [...favourites, recipeName];
        }

        // Update favourite array live
        setFavourites(updatedFavourites);
        // Save the new favourites array to localstorage
        saveFavourites(updatedFavourites);
    };

    //Conditional rendering based on state
    if(loading){
        return <p style={{ textAlign: 'center'}}>Loading recipes, please wait ...</p>;
    }

    if(error){
        return <p style={{ color: 'red', textAlign: 'center'}}>Error: {error}</p>
    }

    //Render the recipe cards when data is loaded and ready
    return (
        <div style = {{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
        }}>

            {recipe.map((recipe, index) => {

                const {name, ingredients, instructions} = recipe;   // ES6 destructuring for cleaner access
                // Find favourite recipes so their favourite button can be changed to pink
                const favouriteRecipe = favourites.includes(recipe.name);

                return (
                    <div
                        key={index}
                        className="card"
                        style={{
                            width: '300px',
                            margin: '1rem',
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <button
                            onClick={() => toggleFavourite(name) }
                            style={{
                                padding: '1rem',
                                border: '1px solid transparent',
                                borderColor: 'black',
                                borderRadius: '4px',
                                backgroundColor: favouriteRecipe ? '#FF69B4' : '#FFFFFF'
                            }}
                        >
                        </button>
                        <h3 className="name" style={{fontStyle: 'bold', color: '#666'}}>
                            {name}
                        </h3>
                        <p className="ingredients" style={{fontStyle: 'italic', color: '#666'}}>
                            {ingredients}
                        </p>
                        <p className="instructions" style={{fontStyle: 'normal', color: '#666'}}>
                            {instructions}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default RecipeList;