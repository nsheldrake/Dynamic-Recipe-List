import {NavLink, Outlet} from "react-router-dom";

function RecipeLayout() {

    const linkClass = ({isActive}) => {
        `nav-link ${isActive ? 'active fw-bold' : ''}`;
    }

    return (
        <>
           <h2 className="mb-4">Recipes</h2>

            <ul className="nav nav-tabs mb-4">
                 <li className="nav-item">
                     <NavLink className={linkClass} to="/recipes" end>
                         Recipe List
                     </NavLink>
                 </li>
            </ul>

            { /* Child routes (index or :id) will be rendered here */ }
            <Outlet />

        </>
    );
}
export default RecipeLayout;