/**
 * RecipeList.jsx
 * This component fetches recipe data from a local JSON file and renders it as a grid or cards
 * It demonstrates useState for data/error/loading, userEffect for side effects (of fetching)
 * and dynamic rendering with map().
 */

import {useState, useEffect, useRef, useMemo} from 'react';
import {saveFavourites, loadFavourites} from "../utils/storage.js";
import RecipeCard from './RecipeCard';
import Pagination from './Pagination';

function slugify(text) {
    return String(text)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

function RecipeList({
                      initialRecipes = [],
                      initialSearch = '',
                      initialSort = 'name',
                      initialPage = 1,
                      onFilterChange,
                  }) {

    // Favourites: stores favourite recipes
    const [favourites, setFavourites] = useState([]);

    // -------------------------------------------
    // LOAD FAVOURITES
    // -------------------------------------------
    useEffect(() => {
        const storedFavourites = loadFavourites();
        if (storedFavourites) {
            setFavourites(storedFavourites);
        }
    }, []);

    // Reference: https://stackoverflow.com/questions/59291164/toggle-color-of-button-added-to-favorites-in-react
    // I used this as a reference to create the functionality that allows me to toggle a recipe being a favourite or not
    // Toggle functionality for favourite recipes
    const toggleFavourite = (recipeName) => {
        // Store updated favourites array
        let updatedFavourites;
        // If recipe is in the favourites array
        if (favourites.includes(recipeName)) {
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

    const searchValue = initialSearch;
    const search =  initialSearch.toLowerCase();
    const sortBy = initialSort;
    const currentPage = initialPage;

    // How many team members to display per page
    const recipesPerPage = 6;

    const filtered = useMemo( () => {
        return initialRecipes.filter((recipe) => {
            const nameMatch = recipe.name.toLowerCase().includes(search);
            const ingredientsMatch = recipe.ingredients.join(', ').toLowerCase().includes(search);
            return nameMatch || ingredientsMatch;
        });
    }, [initialRecipes, search]);

    const sorted = useMemo( () => {
        return [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            }
            return a.ingredients.join(', ').localeCompare(b.ingredients.join(', '))
        });
    }, [filtered, sortBy]);


    // ---------------------------------
    // PAGINATION
    // ---------------------------------
    const totalPages = Math.ceil(sorted.length / recipesPerPage);
    const indexOfLast = currentPage * recipesPerPage;
    const indexOfFirst = indexOfLast - recipesPerPage;
    const currentRecipes = sorted.slice(indexOfFirst, indexOfLast);

    const colClass =
        currentRecipes.length === 1
            ? "col-12"
            : currentRecipes.length === 2
                ? "col-12 col-md-6"
                : "col-12 col-md-6 col-lg-4";


    const handleSearchChange = (e) => {
        onFilterChange({
            q: e.target.value,
            page: '1'
        });
    }

    const handleSortChange = (e) => {
        onFilterChange({
            sort: e.target.value,
            page: '1'
        });
    }

    const handlePageChange = (page) => {
        onFilterChange({
            page: String(page)
        });
    }

    if(!initialRecipes || initialRecipes.length === 0){
        return (
            <div className="alert alert-info tetx-center">
                No Recipes available
            </div>
        )
    }

    //Render the recipe cards when data is loaded and ready
    return (
        <>
            { /* PART 1: SEARCH + SORT CONTROLS */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name or Ingredients"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </div>

                { /* Sort dropdown column */}
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="name">Sort by Name</option>
                        <option value="ingredients">Sort by Ingredients</option>
                    </select>
                </div>
            </div>

            <div className="row g-4 justify-content-center">
                {currentRecipes.length > 0 ? (
                    currentRecipes.map((recipe, index) => {

                        const {name, ingredients, instructions} = recipe;
                        const favouriteRecipe =
                            favourites.includes(recipe.name);

                        return (
                            <RecipeCard
                                key={recipe.name}
                                recipe={recipe}
                                colClass={colClass}
                                toggleFavourite={toggleFavourite}
                                favouriteRecipe={favouriteRecipe}
                            />
                        );
                    })

                ) : (
                    <div className="col-12">
                        <p className="text-center mb-0">No recipes found</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
}

export default RecipeList;