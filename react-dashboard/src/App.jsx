import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RecipeList from "./components/RecipeList.jsx";
import RecipeForm from "./components/RecipeForm.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import Navbar from "./components/Navbar.jsx";
import {Route, Routes} from "react-router-dom";
import Home from "./views/Home.jsx";
import RecipeDetail from "./views/RecipeDetail.jsx";
import AppLayout from "./views/AppLayout.jsx";
import NotFound from "./views/NotFound.jsx";
import RecipeIndex from "./views/RecipeIndex.jsx";
import RecipeLayout from "./views/RecipeLayout.jsx";
import About from "./views/About.jsx";

/* ============================================
    SIMPLE ERROR BOUNDARY COMPONENT

    An Error boundary component is a special React class component that
    catches runtime errors occurring in any child components during rendering
    , lifecycle methods or constructors

    Instead of allowing the entire React application to crash, the boundary
    displays a friendly fallback UI, logs (optionally) the error for debugging
    and monitoring.
   ============================================ */
class SimpleErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false, message: ''}
    }

    static getDerivedFromError(error) {
        return { hasError: true, message: error?.message ?? 'Unknown Error' };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught: ', error);
        console.error(info?.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, message: ''});
    }

    render() {
        if(this.state.hasError) {
            return (
                <div className="alert alert-danger" role="alert">
                    <h4>Something went wrong</h4>
                    <p>{this.state.message}</p>
                    <button className="btn btn-outline-light btn-sm" onClick={this.handleReset}>
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

/* ============================================
    APP COMPONENT
   ============================================ */
function App() {
    return (
        <SimpleErrorBoundary>
            {/*
               Nothing else is needed in here anymore, the RouterProvider
               in our main.jsx handles rendering the routes for us.
             */}
        </SimpleErrorBoundary>
    );
}

export default App;
