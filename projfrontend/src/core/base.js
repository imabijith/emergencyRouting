import React from 'react';
import Menu from './menu';

const Base = ({
    title = "My Title",
    description = "My Description",
    className = "container-fluid bg-light",
    children
}) =>{
    return(
        <div >
            <Menu /><br />
            <div className="container-fluid">
                <div className="jumbotron py-3 my-2 bg-dark text-center text-white">
                <h1 className="">{title}</h1>
                <p className="">{description}</p>
                </div>
                <div className={className}>{children}</div>
            </div>
            <footer className="page-footer">
                <p className="text-white">Developed for Academic Purposes</p>
            </footer>
        </div>
    )
}

export default Base;