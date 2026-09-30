# Dynamic Recipe List

## Overview

Dynamic Recipe List is a responsive recipe browsing application built with **React**. Users can browse recipes, search and sort results, view individual recipe details, save favourites, and submit recipe information through a validated form.

The application uses React Router for multi-page navigation and browser storage to preserve favourites and form data between sessions.

## Features

- Browse a collection of recipes
- Search recipes by name or ingredients
- Sort recipe results
- Paginated recipe list
- View individual recipe details
- Add and remove favourite recipes
- Persist favourites using browser storage
- Recipe submission form with validation
- Save form drafts
- URL-based search and navigation
- Responsive Bootstrap interface
- Custom 404 page and error handling

## Technologies Used

- **React** — Component-based frontend development
- **JavaScript / JSX** — Application logic and components
- **React Router** — Routing, nested routes, and data loaders
- **React Context** — Global favourites state
- **React Hooks** — State and reusable application logic
- **Bootstrap** — Responsive UI styling
- **LocalStorage / SessionStorage** — Favourites and form persistence
- **Validator.js** — Form validation
- **Vite** — Development and build tooling
- **Vercel** — Application deployment
- **Git/GitHub** — Version control

## Project Structure

```text id="sgw8qh"
react-dashboard/
│
├── src/
│   ├── components/
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeList.jsx
│   │   ├── RecipeForm.jsx
│   │   ├── RecipeStats.jsx
│   │   └── Pagination.jsx
│   │
│   ├── views/
│   │   ├── Home.jsx
│   │   ├── RecipeIndex.jsx
│   │   ├── RecipeDetail.jsx
│   │   ├── Form.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   │
│   ├── context/
│   │   └── FavouritesContext.jsx
│   │
│   ├── hooks/
│   │   └── useRecipeValidation.js
│   │
│   ├── utils/
│   │   ├── recipeLoader.js
│   │   ├── storage.js
│   │   └── validation.js
│   │
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── vercel.json
```

## How to Use

1. Browse the available recipes.
2. Use the search and sorting options to narrow the results.
3. Navigate between pages using pagination.
4. Select a recipe to view its ingredients and instructions.
5. Mark recipes as favourites for quick access later.
6. Use the recipe form to enter recipe information.
7. Saved favourites and form data remain available through browser storage.

## Author

**Nathan Sheldrake**

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
