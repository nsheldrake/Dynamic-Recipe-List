import {useMemo} from "react";
import useFavourites from "../context/useFavourite.js";

function RecipeStats({recipes  = []}){

    // Access shared favourites stated directly from Context
    const {favourites} = useFavourites();

    const stats = useMemo( () => {
        //Compute dasboard statistics for total member only when team array changes
        const totalRecipes = recipes.length;

        //buildan array of valid roles (non-empty) values only
        const ingredients = recipes
            //.map((recipe) => recipe.ingredients ?? [])
            //.filter((ingredient) => ingredient.trim() !== '')
            .flatMap((recipe) => recipe.ingredients ?? [])
            .filter((ingredient) => typeof ingredient === 'string' && ingredient.trim() !== '');

        // Count of the number of unique roles
        //Set (remove any duplicates for us automatically)
        const uniqueIngredients = new Set(ingredients).size;

        const ingredientCounts = ingredients.reduce((accumulator, ingredient) => {
            accumulator[ingredient] = (accumulator[ingredient] || 0) + 1;
            return accumulator;
        }, {});

        //Used to determine the most common role
        let mostCommonIngredients = 'N/A';
        let highestCount = 0;

        // Loop through each [role, count] pair in the roleCounts object
        // Object.entries convert object into our array
        // Example -> [ ["Dev", 3], ["QA", 2] ]
        // If we find a larger count, we update both
        // mostCommonRole and highestCount
        Object.entries(ingredientCounts).forEach(([ingredients, count]) => {
            if(count > highestCount){
                mostCommonIngredients = ingredients;
                highestCount = count;
            }
        });

        return {
            totalRecipes,
            uniqueIngredients,
            mostCommonIngredients,
        };

    }, [recipes]);

    //Favourites count can be determined by the length of the favourites array
    const favouriteCount = favourites.length;

    return (
        <div className="row g-4 mb-4">

            <div className="col-12 col-md-6 col-lg-3">
                <div className="card shadow-sm h-100 text-center">
                    <div className="card-body">
                        <h5 className="card-title">Total Recipes</h5>
                        <p className="display-6 mb-0">{stats.totalRecipes}</p>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
                <div className="card shadow-sm h-100 text-center">
                    <div className="card-body">
                        <h5 className="card-title">Unique Ingredients</h5>
                        <p className="display-6 mb-0">{stats.uniqueIngredients}</p>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
                <div className="card shadow-sm h-100 text-center">
                    <div className="card-body">
                        <h5 className="card-title">Most Common Ingredient</h5>
                        <p className="mb-0 fw-bold fs-5">{stats.mostCommonIngredients}</p>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
                <div className="card shadow-sm h-100 text-center">
                    <div className="card-body">
                        <h5 className="card-title">Favourites</h5>
                        <p className="display-6 mb-0">{favouriteCount}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default RecipeStats;