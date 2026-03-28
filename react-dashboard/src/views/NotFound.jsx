import {Link} from "react-router-dom";

function Notfound(){
    return(
        <div className="text-center py-5">
            <h2 className="mb-3">404 - Page Not Found</h2>
            <p className="text-muted mb-4">
                The page you request doesn't exist
            </p>
            <Link className="btn btn-primary" to="/">
                Go Home
            </Link>
        </div>
    );
}
export default Notfound;