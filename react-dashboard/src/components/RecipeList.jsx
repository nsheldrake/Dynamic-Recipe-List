/**
 * RecipeList.jsx
 * This component fetches recipe data from a local JSON file and renders it as a grid or cards
 * It demonstrates useState for data/error/loading, userEffect for side effects (of fetching)
 * and dynamic rendering with map().
 */

import {useState, useEffect, useRef} from 'react';
import {saveFavourites, loadFavourites} from "../utils/storage.js";
import RecipeCard from './RecipeCard';
import Pagination from './Pagination';

function RecipeList() {

    // State to hold the array of recipes
    const [recipe, setRecipe] = useState([]);

    //Search term typed by user
    const [searchTerm, setSearchTerm] = useState('');

    // Sort option selected by user (either 'name' or 'role')
    const [sortBy, setSortBy] = useState('name');

    // Current page number for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // How many team members to display per page
    const recipesPerPage = 6;

    // Loading state: shows spinner/message while data is loading
    const [loading, setLoading] = useState(true);

    // Error state: stores any fetch errors to display to the user
    const [error, setError] = useState(null);

    // Last refresh timestamp for tracking purposes
    const [lastUpdated, setLastUpdated] = useState(null);

    // Ref to track component mount status
    const isMounted = useRef(true);

    // We use a ref to avoid pushing the URL on the very first render
    const hasInitializedFromUrl = useRef(false)

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

        // -------------------------------------------
        // LOAD DATA
        // -------------------------------------------
        const loadRecipe = async () => {

            setLoading(true);
            setError(null);

            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const res = await fetch("/data/recipe.json");
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                //Only set team data if component is still mounted
                if (!isMounted.current) return;

                setRecipe(data);
                setLastUpdated(Date.now());  //Set lastUpdate to current date and time

            } catch (err) {
                if (!isMounted.current) return;
                setError(err.message || "Something went wrong loading team data");
            } finally {
                if (!isMounted.current) return;
                setLoading(false);
            }
        }

        //-------------------------------------------
        //  LOAD DATA ON MOUNT
        // ------------------------------------------
        useEffect(() => {
            isMounted.current = true;
            loadRecipe();

            return () => {
                isMounted.current = false;
            }
        }, []);


        //-------------------------------------------
        //  AUTO-REFRESH (setInterval() + cleanup)
        // ------------------------------------------
        useEffect(() => {
            const REFRESH_MS = 30000; //30 seconds (please adjust as you desire)
            const intervalId = setInterval(() => {
                loadRecipe()
            }, REFRESH_MS);

            return () => clearInterval(intervalId);    //Cleanup to prevent memory leaks
        }, []);


        //---------------------------
        //  Read URL Query Params on Mount
        // ---------------------------
        useEffect(() => {
            const params = new URLSearchParams(window.location.search);

            //Reading values from URL if present
            const searchFromUrl = params.get('search') ?? '';
            const sortFromUrl = params.get('sort') ?? 'name';
            const pageFromUrlRaw = params.get('page') ?? 1;

            //validate page (must be a positive number)
            const pageFromUrl = Number.parseInt(pageFromUrlRaw, 10);
            const safePage = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;

            //Apply to the state
            setSearchTerm(searchFromUrl);
            setSortBy(sortFromUrl === 'ingredients' ? 'ingredients' : 'name');
            setCurrentPage(safePage);

            hasInitializedFromUrl.current = true;
        }, []);


        // ------------------------
        // FILTER (search)
        // ------------------------
        // Convert search term to lowercase once to avoid casing issues with matching
        const search = searchTerm.toLowerCase();

        // filter() return a NEW array containing only matching items
        const filtered = recipe.filter((recipe) => {
            const nameMatch = recipe.name.toLowerCase().includes(search);
            const ingredientsMatch = recipe.ingredients.join(' ').toLowerCase().includes(search);
            return nameMatch || ingredientsMatch;
        })

        // -----------------------------
        // SORT
        // -----------------------------
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            }
            return a.ingredients.join(', ').localeCompare(b.ingredients.join(', '))
        });

        // ---------------------------------
        // PAGINATION
        // ---------------------------------
        // Total number of pages (round up to the nearest integer)
        const totalPages = Math.ceil(sorted.length / recipesPerPage);

        // Determine slice boundaries for the current page
        const indexOfLast = currentPage * recipesPerPage;
        const indexOfFirst = indexOfLast - recipesPerPage;

        // slice(start, end) return only the portion we want to display for this page
        const currentRecipes = sorted.slice(indexOfFirst, indexOfLast);

        //Whenever the number of pages changes, check if the current page is still valid
        //if not, automatically move the user to the last valid page
        useEffect(() => {
            if (totalPages === 0) return;  //no data

            if (currentPage > totalPages) {
                setCurrentPage(totalPages);
            }
        }, [totalPages, currentPage]);


        // -------------------------------------
        //  Update the URL When the State Changes
        // ------------------------------------
        useEffect(() => {
            if (!hasInitializedFromUrl.current) return;

            const params = new URLSearchParams();

            //Build the query string from state properties
            // Here we include all 3 params so the URL is always fully shareable
            params.set('search', searchTerm);
            params.set('sort', sortBy);
            params.set('page', String(currentPage));

            //New URL with query params
            const newUrl = `${window.location.pathname}?${params.toString()}`;

            //Change the URL without reloading the page (change the address bar, but do NOT reload the page)
            window.history.pushState({}, '', newUrl);
        }, [searchTerm, sortBy, currentPage]);


        // --------------------------------------------------
        // Listen for  Back/Forward Button Clicks (popstate)
        //---------------------------------------------------
        useEffect(() => {
            const handlePopState = () => {

                //Obtain the query string
                const params = new URLSearchParams(window.location.search);

                const searchFromUrl = params.get('search') ?? '';
                const sortFromUrl = params.get('sort') ?? 'name';
                const pageFromUrlRaw = params.get('page') ?? 1;

                const pageFromUrl = Number.parseInt(pageFromUrlRaw, 10);
                const safePage = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;

                setSearchTerm(searchFromUrl);
                setSortBy(sortFromUrl === 'ingredients' ? 'ingredients' : 'name');
                setCurrentPage(safePage);
            };

            //Listener for if popstate fire --> call handlePopState()
            window.addEventListener('popstate', handlePopState);

            //Cleanup and lingering event listeners
            return () => window.removeEventListener('popstate', handlePopState);

        }, []);


        const colClass =
            currentRecipes.length === 1
                ? "col-12"
                : currentRecipes.length === 2
                    ? "col-12 col-md-6"
                    : "col-12 col-md-6 col-lg-4";

        //------------------------------------------
        // CONDITIONAL RENDERING FOR LOADING
        //------------------------------------------
        //Loading: show spinner/message
        if (loading) {
            return (
                <div className="container mt-4">
                    <h2 className="mb-4">Recipe's</h2>

                    <div className="d-flex align-items-center gap-3">
                        <div className="spinner-border" role="status" aria-label="Loading">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mb-0">Loading recipe's (simulating delay)</p>
                    </div>
                </div>
            );
        }

        //------------------------------------------
        // CONDITIONAL RENDERING FOR ERROR
        //------------------------------------------
        //Loading: show error + retry button
        if (error) {
            return (
                <div className="container mt-4">
                    <h2 className="mb-4">Recipe's</h2>

                    <div className="alert alert-danger" role="alert">
                        <strong>Something went wrong</strong>
                        <div className="mt-2">{error}</div>
                    </div>

                    { /* Retry button calls the same loader function*/}
                    <button className="btn btn-primary" onClick={loadRecipe}>
                        Retry
                    </button>
                </div>
            );
        }

        //Render the team cards when data is loaded and ready
        return (
            <div className="container mt-4">
                <h2 className="mb-4">Recipe's</h2>

                { /* PART 1: SEARCH + SORT CONTROLS */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Name or Ingredients"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    { /* Sort dropdown column */}
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
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
                            <p className="text-center mb-0">No recipe's found</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(nextPage) => {
                            // The URL updates automatically via the pushState useEffect above
                            setCurrentPage(nextPage);
                        }}
                    />
                )}
            </div>
        );
    }
export default RecipeList;