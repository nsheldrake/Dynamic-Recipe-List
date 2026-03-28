import RecipeList from "../components/RecipeList.jsx";
import {useNavigate} from "react-router-dom";


function Home() {

    const navigate = useNavigate();

     return (
      <>
         <h2 className="mb-4">Welcome to Your Recipe List Display</h2>
         <p className="lead mb-4">
            View and manage your recipe's
         </p>

         <button className="btn btn-primary btn-lg mb-5"
                 onClick={() => navigate('/recipes')}>
             Explore Recipe's
         </button>
      </>
    );
}
export default Home;