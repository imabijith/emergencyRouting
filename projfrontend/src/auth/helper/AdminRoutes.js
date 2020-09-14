import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isAdminAuthenticated} from './index';

const AdminRoute = ({ component: Component, ...rest }) =>{
    return (
      <Route
        {...rest}
        render={props =>
          isAdminAuthenticated() && isAdminAuthenticated().user.stationName ? (
            <Component {...props}/>
          ) : (
            <Redirect
              to={{
                pathname: "/adminSignin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  export default AdminRoute;