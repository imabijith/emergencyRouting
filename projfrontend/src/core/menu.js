import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import { isAdminAuthenticated, signout } from '../auth/helper';

const currentTab = (history, path)=>{
    if(history.location.pathname === path){
        return {color: '#2ecc72'}
    } else {
        return {color: '#ffffff'}
    }
}

const Menu = ({history}) =>{
    return(
        <div>
            <ul className="nav nav-tabs bg-info">
                    <li className="nav-item">
                        <Link to="/" style={currentTab(history,'/')}className = "nav-link text-dark text-lg">Emergency Routing</Link>
                    </li>
                    {isAdminAuthenticated().user && isAdminAuthenticated().user.stationName && <li className="nav-item">
                        <Link to="/admin/dashboard" style={currentTab(history,'/admin/dashboard')} className = "nav-link text-dark">Dashboard</Link>
                    </li>}
                    {!isAdminAuthenticated() && <li className="nav-item">
                        <Link to="/adminSignin" style={currentTab(history,'/adminSignin')} className = "nav-link text-dark">Admin Sign in</Link>
                    </li>}
                    {!isAdminAuthenticated() && <li className="nav-item">
                        <Link to="/userSignin" className = "nav-link text-dark">User Sign in</Link>
                    </li>}
                    {isAdminAuthenticated() && <li className="nav-item">
                        <span style={currentTab(history,'/')} className="nav-link text-warning" onClick={()=>{
                            signout(()=>{
                                history.push('/');
                            })
                        }}>Sign out</span>
                    </li>}
                    
            </ul>    
        </div>
    )
}

export default withRouter(Menu);