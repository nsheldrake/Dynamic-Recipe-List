import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

/*****************************************
PURPOSE: This component defines the "shared layout" of the application

 For example: most applications, contain certain UI elements, namely:

 1. Header
 2. Navigation Bar
 3. Footer
 4. Sidebar

 So, instead of repeating those elements inside every component.
 we use our AppLayout to wrap all components.

 AppLayout-
  - Header (common)
  - Navigation Bar (common)
  - Outlet
      -- RecipeDetail page

Think of AppLayout as the "frame" of the application, while individual pages
fill in the content area.
 *************************************/
function AppLayout() {
    return(
       <>
           <header className="bg-primary text-white text-center py-4 mb-0 w-100">
               <h1 className="m-0">Dynamic Recipe List Display</h1>
           </header>

           {/* Navbar for peristent navigation */}
           <Navbar />

           {/*
                Outlet is a placeholder provided by React Router

                When a route matches, React Router will render the
                corresponding page component *inside* this Outlet

                Example:
                URL: /contact
                AppLayout render
                - Header
                - Navbar
                - Outlet
                ----Form (component appears here)
           */}
           <main className="container py-4">
               <Outlet />
           </main>

       </>
    );
}
export default AppLayout;