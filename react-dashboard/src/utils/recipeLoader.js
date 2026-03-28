export async function recipeLoader() {
    try{
        console.log("Attempting to fetch /data/recipe.json");
        const res = await fetch('/data/recipe.json');

        if(!res.ok){
            const errorText = await res.text();
            console.error("Fetch Failed: ", res.status, errorText);
            throw new Response(`Failed to load recipe data ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log("Loaded recipe data", data);

        return Array.isArray(data) ? data : [];
    }catch(err){
        console.error("Loader error: ", err);
        throw new Response("Failed to load recipe data", {status: 500});
    }
}