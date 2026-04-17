import 'bootstrap/dist/css/bootstrap.min.css' //This imports our Bootstrap css globally
import React from 'react';
import ReactDOM from 'react-dom/client';

import {
    createBrowserRouter,
    createRoutesFromElements, Route,
    RouterProvider,
} from 'react-router-dom';

import AppLayout from './views/AppLayout.jsx';
import Home from './views/Home.jsx';
import RecipeLayout from './views/RecipeLayout.jsx';
import RecipeIndex from './views/RecipeIndex.jsx';
import RecipeDetail from './views/RecipeDetail.jsx';
import Form from './views/Form.jsx';
import About from './views/About.jsx';
import NotFound from './views/NotFound.jsx';

import { recipeLoader } from './utils/recipeLoader.js'; // NEW for 9.2

import './index.css';
import {FavouritesProvider} from "./context/FavouritesContext.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AppLayout />}>
            <Route index element={<Home />} />

            {/* 9.2: recipes section with loader */}
            <Route
                path="recipes"
                id="recipes"
                element={<RecipeLayout />}
                loader={recipeLoader}
            >
                <Route index element={<RecipeIndex />} />
                <Route path=":id" element={<RecipeDetail />} />
            </Route>

            <Route path="form" element={<Form />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        { /* Provide favourites context to the entire application */ }
        <FavouritesProvider>
            <RouterProvider router={router}/>
        </FavouritesProvider>
    </React.StrictMode>
);
