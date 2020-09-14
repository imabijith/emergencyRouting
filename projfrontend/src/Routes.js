import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import AdminRoute from './auth/helper/AdminRoutes';
import UserRoute from './auth/helper/UserRoutes';
import Home from './core/home';
import SignIn from './adminuser/signin';
import UserSignIn from './user/UserSignin';
import AdminDashboard from './adminuser/Dashboard';
import BoundaryMap from './adminpages/BoundaryMap';
import Registration from './adminpages/Registration';
import ManageUsers from './adminpages/ManageUsers';
import UpdateUser from './adminpages/UpdateUsers';
import CreateDuty from './adminpages/CreateDuties';
import AddLocation from './adminpages/AddLocation';
import ManageDuties from './adminpages/ManageDuties';
import UpdateLocation from './adminpages/UpdateLocation';
import UpdateDuty from './adminpages/UpdateDuty';
import UserDashboard from './user/UserDashboard';
import DutyLocation from './userpages/DutyLocation';
import AmbulanceRoute from './userpages/AmbulanceRoute';
import Duties from './userpages/Duties';
import Analysis from './adminpages/Analysis';
import AnalysisSelect from './adminpages/AnalysisSelect';
import AnalysisMY from './adminpages/AnalysisMY';



const Routes = () =>{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component = {Home} />
                <Route path="/adminSignin" exact component = {SignIn} />
                <Route path="/userSignin" exact component = {UserSignIn} />
                <AdminRoute path="/admin/dashboard" exact component = {AdminDashboard} />
                <AdminRoute path="/admin/boundarymap" exact component = {BoundaryMap} />
                <AdminRoute path="/admin/registration" exact component = {Registration} />
                <AdminRoute path="/admin/manageusers" exact component = {ManageUsers} />
                <AdminRoute path="/admin/update/user/:userId" exact component = {UpdateUser} />
                <AdminRoute path="/admin/changepassword/user/:userId" exact component = {UpdateUser} />
                <AdminRoute path="/admin/createduties" exact component = {CreateDuty} />
                <AdminRoute path="/admin/createduties/addlocation/:dutyId" exact component = {AddLocation} />
                <AdminRoute path="/admin/manageduties" exact component = {ManageDuties} />
                <AdminRoute path="/admin/createduties/updatelocation/:dutyId" exact component = {UpdateLocation} />
                <AdminRoute path="/admin/createduties/updateduty/:dutyId" exact component = {UpdateDuty} />
                <AdminRoute path="/admin/analysis" exact component = {AnalysisSelect} />
                <AdminRoute path="/admin/analysis/mapall" exact component = {Analysis} />
                <AdminRoute path="/admin/analysis/mapMY/:month/:year" exact component = {AnalysisMY} />
                <UserRoute path="/user/dashboard" exact component={UserDashboard} />
                <UserRoute path="/user/duty/:dutyId/location" exact component={DutyLocation} />
                <UserRoute path="/user/ambulanceroute/:notificationId/duty/:dutyId" exact component={AmbulanceRoute} />
                <UserRoute path="/user/duties" exact component={Duties} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;