import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { isUserAuthenticated } from './userindex';


const UserRoute = ({ component: Component, ...rest }) =>{
    return (
      <Route
        {...rest}
        render={props =>
          isUserAuthenticated() && isUserAuthenticated().user.phone ? (
            <Component {...props}/>
          ) : (
            <Redirect
              to={{
                pathname: "/userSignin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  export default UserRoute;