import React from 'react';
import Base from './base';

const Home = () =>{
    return(
        <Base title="EMERGENCY TRAFFIC ROUTING" description="Portal for Mumbai Traffic Police Department to Manage Duties inorder to route Emergency Services" className="jumbotron bg-info text-white text-center">
            
            <h5>This Application would help traffic police to navigate emergency service of an ambulance. To further ensure that the officers are present at important places
                we provide functionalites that help in doing so. 
            </h5><br />
            <h6>This is the home page, Please Sign in with respective accounts to Continue</h6> <br />
            <p>This Web Application is being developed as part of 2months project for the partial fullfilment of M.Sc Geoinformatics</p>
        </Base>
    )
}

export default Home;