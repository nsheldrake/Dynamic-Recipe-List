import RecipeList from "../components/RecipeList.jsx";
import {useRevalidator, useRouteLoaderData, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import RecipeStats from "../components/RecipeStats.jsx";

/**
 * Purpose: Acts as the entry point when users navigate to /team
 * - delegates rendering to the teamList component
 */
function RecipeIndex(){
    const recipes = useRouteLoaderData('recipes')?? [];
    const [searchParams, setSearchParams] = useSearchParams();

    const revalidator = useRevalidator();
    const [lastUpdated, setLastUpdated] = useState(new Date());

    //search URL for query user
    const searchTerm = searchParams.get('q') || '';
    const sortBy = searchParams.get('sort') || 'name';
    const currentPage = Number(searchParams.get('page') || '1');

    const handleFilterChange = (updates) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        const newParams = {
            ...currentParams,
            ...updates
        };

        Object.keys(newParams).forEach( (key) => {
            if(
                newParams[key] === '' ||
                newParams[key] === null ||
                newParams[key] === undefined
            ){
                delete newParams[key];
            }
        });
        setSearchParams(newParams);
    };

    const handleReset = () => {
        setSearchParams({});
    }

    useEffect(() => {
        if (Array.isArray(recipes)) {
            setLastUpdated(new Date());
        }
    }, [recipes]);

    //auto-refresh every 30 seconds by re-running the route loader
    useEffect( () => {
       const REFRESH_MS = 30000;

       const intervalId = setInterval( () => {
           revalidator.revalidate();
       }, REFRESH_MS);

       return () => clearInterval(intervalId);
    }, [revalidator]);

    return(
        <>
            <p className="text-muted mb-4">
                {lastUpdated
                    ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                    : 'Last updated: (unknown)'
                }
            </p>

            {revalidator.state === 'loading' && (
                <p className="text-muted small">Refreshing recipes ...</p>
            )}

            {/* Team Dashboard Stats */}
            <RecipeStats recipes={recipes} />

            <RecipeList
               initialRecipes={recipes}
               initialSearch={searchTerm}
               initialSort={sortBy}
               initialPage={currentPage}
               onFilterChange={handleFilterChange}
            />

            {(searchTerm || sortBy !== 'name' || currentPage !== 1) && (
                <button
                    className="btn btn-outline-secondary mt-4"
                    onClick={handleReset}>
                    Reset filters
                </button>
            )}
        </>
    );
}
export default RecipeIndex;