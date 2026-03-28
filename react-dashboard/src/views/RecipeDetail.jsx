import {Link, useNavigate, useParams, useRouteLoaderData, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";


function slugify(text) {
    return String(text)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

function RecipeDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const recipes = useRouteLoaderData("recipes") ?? [];
    const activeTab = searchParams.get('tab') ?? 'overview';

    const recipe = useMemo( () => {
       return recipes.find((m) => slugify(m.name) === id);
    }, [recipes, id]);


    if(!recipe){
        return(
          <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Recipe not found</h4>
              <p className="mb-3">
                  The URL <code>/recipes/{id}</code> does not match any member.
              </p>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                  Go Home
              </button>
          </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Go Back
                </button>

                <h2 className="card-title mb-1">{recipe.name}</h2>
                <p className="text-muted mb-3">{recipe.ingredients}</p>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchParams({ tab: activeTab === 'bio' ? 'overview' : 'bio' })}
                >
                    {activeTab === 'bio' ? 'Show Quick Info' : 'Show Full Bio'}
                </button>

                {activeTab === 'bio'? (<p className="mb-0">
                        <strong>Full Bio: </strong> {recipe.instructions || 'No instructions available.'})
                        <br/>
                        <strong className="mb-0">Date Added: </strong> {recipe.dateAdded || 'No date available'}
                    </p>
                ) : (<p className="mb-0">
                            <strong>Quick Info: </strong> {recipe.ingredients} - {recipe.instructions?.substring(0,60) || 'No instructions'}...
                            <br/>
                           </p>)}

                {/* Related Recipes section */}
                <div className="mt-4">
                    <h4>Other Recipes</h4>
                    <div className="row g-3">
                        {recipes
                            .filter((m) => slugify(m.name) !== id )
                            .slice(0,4)    // show up to 4
                            .map((recipe) => {
                                const slug = slugify(recipe.name);
                                return (
                                    <div key={slug} className="col-md-3">
                                        <Link
                                            to={`/recipes/${slug}`}
                                            className="text-decoration-none"
                                            >
                                            <div className="card h-100 shadow-sm">
                                               <div className="card-body text-center">
                                                   <h6 className="card-title mb-1">{recipe.name}</h6>
                                                   <p className="card-text text-muted small">{recipe.ingredients}</p>
                                               </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>

                </div>

            </div>
        </div>);
}
export default RecipeDetail;