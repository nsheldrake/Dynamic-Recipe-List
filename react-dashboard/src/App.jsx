import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RecipeList from "./components/RecipeList.jsx";
import RecipeForm from "./components/RecipeForm.jsx";


function App() {
    //const [count, setCount] = useState(0)

    return (

        <div className="App">

            { /* Simple Header */}
            <header>
                <h1>Recipe List Display</h1>
            </header>

            { /* Recipe Section */}
            <section>
                <h2>Recipes</h2>
                <RecipeList/>           { /* Renders dynamic recipe cards */}
            </section>

            { /* Form Section */}
            <section>
                <h2>Submit Recipe</h2>
                <RecipeForm/>        { /* Handles input, validation, and submission */}
            </section>

        </div>
    )
}

export default App
