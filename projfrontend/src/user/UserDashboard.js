import React, {useState, useEffect} from 'react';
import MobileBase from '../core/mobilebase';
import { isUserAuthenticated, userSignOut } from '../auth/helper/userindex';
import { getNotifications, getLiveDuty } from './helper/userapicalls';
import { Link } from 'react-router-dom';
import { finishDuty } from '../auth/helper/duties';

const UserDashboard = ({history}) =>{

    const [values, setValues] = useState([])

    const [liveDuty, setLiveDuty] = useState("");

    const [noLive, setNoLive] = useState(false);

    const [errors, setErrors] = useState({
        error: "",
        notification_loaded: false,
        duties_loaded: false
    });

    const [success, setSuccess] = useState(false)

    const {error, notification_loaded, duties_loaded} = errors;

    const {user, token} = isUserAuthenticated();

    const preload = () =>{
        getNotifications(user.id, token).then(data =>{
            if(data.error){
                setErrors({...errors, error:data.error})
            } else{
                setValues(data)
                setErrors({...errors, notification_loaded: true})
            }
        })
    }

    const loadLiveDuty = () =>{
        getLiveDuty(user.id, token).then(data =>{
            if(data){if(data.error){
                setErrors({...errors, error:data.error})
            } else{
                setLiveDuty(data)
                setSuccess(true)
            }}
            else{
                setNoLive(true)
            }
        })
    }

    useEffect(() =>{
        preload();
        loadLiveDuty();
    }, [liveDuty])

    const finishCurrentDuty = event =>{
        event.preventDefault();
        finishDuty(user.id, liveDuty.id, token).then(data =>{
            if(data.error){
                console.log(data.error)
            }
        })
    }

    const User = () =>(
        <div className="container-fluid rounded py-2 text-center" style={{background: "#2193b0", background: "-webkit-linear-gradient(to right, #6dd5ed, #2193b0)", background: "linear-gradient(to right, #6dd5ed, #2193b0)"}}>
            <h6>{`Welcome ${user.name}`}</h6>
        </div>
    )

    const notifications = () =>{
        return(
            <div className="rounded text-center col-10 offset-1 bg-dark text-white" >
                <br />
                <h4>Notifications</h4>
                <hr className="bg-white col-6 my-4" />
                    {values.map((duty,index) =>(
                        <div key={index} className="text-center rounded my-3">
                            <Link className="text-white" to={`/user/ambulanceroute/${duty.id}/duty/${liveDuty.id}`}>
                            <p className="text-left font-weight-bold my-0 small">{(duty.notification_time).slice(0,16)}</p>
                            <p className="text-left font-weight-normal">An Ambulance is passing through your point.</p></Link>
                            <hr className="bg-white"/>
                        </div>
                    ))}
                <br />
            </div>
        )
    }

    const LiveDuty = () =>(
        <div className="rounded text-center col-10 offset-1" style={{background: "#2193b0", background: "-webkit-linear-gradient(to right, #6dd5ed, #2193b0)", background: "linear-gradient(to right, #6dd5ed, #2193b0)"}}>
        <br />
        <h4>Current Duty</h4>
        <hr className="bg-white col-6 my-4" />
        {!noLive && <div>
            <h6>{`Date: ${liveDuty.duty_date.slice(0,10)}`}</h6>
            <h6>{`Time From: ${liveDuty.start_duty_time} Till: ${liveDuty.end_duty_time}`}</h6>
            <h6>{`Duty Type: ${liveDuty.duty_type}`}</h6>
            <p>{`Description: ${liveDuty.duty_description}`}</p>
            <Link to={`/user/duty/${liveDuty.id}/location`} className="btn btn-dark rounded">Location</Link>
            <button className="btn btn-danger mx-2 rounded" onClick={finishCurrentDuty}>Finish Duty</button>
        </div> }
        {noLive && <div>
            <h6>You are not in a Duty</h6>
        </div>}
        <br />
        </div>
    )



    return(
    <MobileBase title="User Dashboard" description="User's dashboard, need to edit the base" className="">
        {User()}<br />
        {notification_loaded && notifications()}
        <br />
        {(success || noLive) && LiveDuty()}
        <br />
        <div className="text-center">
        <Link className="btn rounded bg-info mx-2 text-white px-4" to="/user/duties">View All Duties</Link> <br /> <br />
        <button className="btn bg-dark col-12 text-white px-4" onClick={()=>{
            userSignOut(()=>{
                history.push('/userSignin')
            })
        }}>Sign Out</button>
        </div>
    </MobileBase>
    ) 
}

export default UserDashboard;