
function About() {
    return(
        <>
           <h2 className="mb-4">About this Recipe List</h2>
            <p className="lead">
                This is a recipe display list built with React and React Router
            </p>
            <p>
                Key feature demonstrated so far:
            </p>
            <ul>
                <li>Client-side routing with no page reloads</li>
                <li>Nested layouts using &lt;Outlet /&gt;</li>
                <li>Dynamic routes wth useParams()</li>
                <li>Programmatic navigation with useNavigate()</li>
                <li>Query parameter support (ex: ?tab=bio)</li>
            </ul>
        </>
    );
}
export default About;