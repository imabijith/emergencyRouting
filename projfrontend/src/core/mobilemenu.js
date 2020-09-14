import React from 'react';
import { Link } from 'react-router-dom';
import { isUserAuthenticated } from '../auth/helper/userindex';


const MobileMenu = () =>(
    <div className="container-fluid text-white" style={{backgroundColor: "#30336B"}}>
        <ul className="nav nav-tabs py-3">
                {!isUserAuthenticated() && <li className="nav-item text-center col-12">
                        <Link to="/" className = "nav-link h3">Emergency Routing Home</Link>
                </li>
                }
                {isUserAuthenticated() && <li className="nav-item text-center col-12">
                    <Link to="/user/dashboard" className="nav-link h3">User Home</Link>
                </li>}
            </ul>
    </div>
) 

export default MobileMenu;