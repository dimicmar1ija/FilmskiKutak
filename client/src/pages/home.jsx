import { NavLink, Link } from "react-router-dom";

export function Home(){
    return (
        <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of our application.</p>

        <NavLink to="/login">Go to Login Page</NavLink>
        <Link to="/test/comments">💬 Test komentara (po PostId)</Link>
        </div>



        //KORISTITI ovu dokumentaciju
        // React Docs - bilo sta react
        // https://react.dev/

        // React Router Docs - za rutiranje
        // https://reactrouter.com/start/declarative/routing

        // Tanstack Query Docs - // za fetchanje podataka
        // https://tanstack.com/query/latest/docs/framework/react/overview

        
    );
}