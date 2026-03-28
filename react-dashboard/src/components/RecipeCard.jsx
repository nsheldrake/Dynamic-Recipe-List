//Purpose:
// Reusable component for displaying a single recipe as a Bootstrap card
// This component is rendered by RecipeList

// Convert "Bruce Wayne" --> "bruce-wayne"
import {useNavigate} from "react-router-dom";

function slugify(text) {
    return String(text)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

//Layout notes:
// - col-12 ensures full width on small screens
// - col-md-6 and col-lg-4 shows 2 cards per row on medium screens
// - col-lg-4 shows 3 cards per row on large screens
// - w-100 forces the card to fill the column width
// - h-100 ensures all cards maintain equal height
function RecipeCard({recipe, colClass = "col-12 col-md-6 col-lg-4", toggleFavourite, favouriteRecipe}){

    const navigate = useNavigate();

    const handleClick = () => {
        //use the slug field NAME as the URL id
        const slug = slugify(recipe.name);
        navigate(`/recipes/${slug}`);
    }

    return (
        <div className={colClass}>
            <div
                className="card h-100 shadow-sm"
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleClick();
                }}
                style={{cursor: 'pointer'}}
            >

                <div className="card-body">
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-subtitle mb-1">
                        <strong>Ingredients: </strong>{recipe.ingredients}
                    </p>
                    <p className="card-text text-muted small">
                        {recipe.instructions}
                    </p>
                    <p className="card-text text-muted small">
                        {recipe.dateAdded}
                    </p>
                    <button
                        onClick={(e) => {
                            toggleFavourite(recipe.name);
                            // stop navigation to detail page when clicking favourite button
                            e.stopPropagation();
                        }}
                        style={{
                            fontSize: '1.5rem',
                            padding: "1rem",
                            border: "1px solid black",
                            borderColor: 'black',
                            borderRadius: "4px",
                            backgroundColor: favouriteRecipe ? "#FF69B4" : "#D3D3D3"
                        }}
                    > ♡
                    </button>
                </div>
            </div>
        </div>
    );
}
export default RecipeCard;