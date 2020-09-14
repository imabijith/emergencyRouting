import React, { useEffect, useState } from 'react';
import MobileBase from '../core/mobilebase';
import L from 'leaflet';
import { getDutyUser } from './helper/dutyhelper';
import { isUserAuthenticated } from '../auth/helper/userindex';


const DutyLocation = ({match}) =>{

    const [duty, setDuty] = useState([]);

    const [errors, setErrors] = useState({
        error: "",
        loading: false
    })

    const {error, loading} = errors;

    const {user, token} = isUserAuthenticated();

    const getDutyLocation = () =>{
        getDutyUser(user.id, match.params.dutyId, token).then(data =>{
            if(data.error){
                setErrors({...errors, error: data.error})
            } else{
                setDuty(JSON.parse(data.duty_location).coordinates)
                setErrors({...errors, loading: true})
            }
        })
    }

    useEffect(()=>{
        getDutyLocation();
    }, [])


    const BaseMap = () =>{
        var mymap = L.map('mapid').setView([duty[1], duty[0]], 17);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        mymap.locate({setView: false, maxZoom: 16});

        L.marker([duty[1], duty[0]]).addTo(mymap).bindPopup("Duty Location")

        const onLocationFound = (e) => {
            var radius = e.accuracy;
            L.marker(e.latlng).addTo(mymap)
                .bindPopup("You are within " + radius + " meters from this point");
            L.circle(e.latlng, radius).addTo(mymap);
        }

        const onLocationError = (e) => {
            alert(e.message);
        }
        
        mymap.on('locationerror', onLocationError);
        mymap.on('locationfound', onLocationFound);
    }

    return(
        <MobileBase className="">
        <div className="container-fluid rounded py-2 text-center" style={{background: "#2193b0", background: "-webkit-linear-gradient(to right, #6dd5ed, #2193b0)", background: "linear-gradient(to right, #6dd5ed, #2193b0)"}}>
            <h6>Your Duty Location</h6>
        </div>
        {loading && BaseMap()}
        <div id="mapid" className="container-fluid"></div>
        </MobileBase>
    )
}

export default DutyLocation;