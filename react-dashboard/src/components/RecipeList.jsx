/**
 * RecipeList.jsx
 * This component fetches team data from a local JSON file and renders it as a grid or cards
 * It demonstrates useState for data/error/loading, userEffect for side effects (of fetching)
 * and dynamic rendering with map().
 */

import {useState, useEffect} from 'react';

function RecipeList(){

    // State to hold the array of team members
    const [team, setTeam] = useState([]);

    // Loading state: shows spinner/message while data is loading
    const [loading, setLoading] = useState(true);

    // Error state: stores any fetch errors to display to the user
    const [error, setError] = useState(null);

    useEffect( () => {
        const fetchTeam = async () => {
            try{
                const response = await fetch('/src/data/team.json');
                const {ok, status} = response;   // ES6 destructuring
                if(!ok){
                    throw new Error(`Failed to load team data (status: ${status}`);   // Template/String Literal for Error message
                }

                const data = await response.json();
                setTeam(data);             //Update team state with fetched data
                setLoading(false);   //Update loaded state after load completes

            }catch(err){
                setError(err.message);    //Store the error message
                setLoading(false);  //Stop loading if an error occurs
            }
        };

        fetchTeam();  //Call async fetch for data

    }, []);  //Empty array, run only after the first render

    //Conditional rendering based on state
    if(loading){
        return <p style={{ textAlign: 'center'}}>Loading team members, please wait ...</p>;
    }

    if(error){
        return <p style={{ color: 'red', textAlign: 'center'}}>Error: {error}</p>
    }

    //Render the team cards when data is loaded and ready
    return (
        <div style = {{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
        }}>

            {team.map((member, index) => {

                const {name, role, bio} = member;   // ES6 destructuring for cleaner access

                return (
                    <div
                        key={index}
                        className="card"
                        style={{
                            width: '300px',
                            margin: '1rem',
                            padding: '1rem',
                            background: 'white',
                            boarderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h3>{name}</h3>
                        <p className="role" style={{fontStyle: 'italic', color: '#666'}}>
                            {role}
                        </p>
                        <p>{bio}</p>
                    </div>
                );
            })}
        </div>
    );
}
export default RecipeList;