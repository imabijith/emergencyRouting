import React, {useState, useEffect} from 'react';
import Base from '../core/base';
import {Map, Marker, Popup, TileLayer, GeoJSON} from 'react-leaflet';
import {getAdmin} from './helper/adminapicall';
import { isAdminAuthenticated } from '../auth/helper';



const BoundaryMap = () =>{
    
    const [error, setError] = useState(false);

    const [success, setSuccess] = useState(false);

    const [shape, setShape] = useState("");

    const [name, setName] = useState("");

    const {user, token} = isAdminAuthenticated();

    const mapData = (adminId, token) =>{
        getAdmin(adminId, token).then( data =>{
            if(data.error){
                setError(true);
            } else{
               setShape(data)
               setName(data.properties.name)
               setSuccess(true)
            }
        })
    }

    useEffect(()=>{
        mapData(user.gid, token);
    }, [])

    const BoundaryMapView = () =>(
        <Map center={[shape.geometry.coordinates[0][0][0][1], shape.geometry.coordinates[0][0][0][0]]} zoom={13}> 
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
            <GeoJSON data={shape}><Popup>{name}</Popup></GeoJSON>       
        </Map>
    )

    return(
        <Base title={name} description="View your Station's Boundary Here" className="bg-info">
                {success && BoundaryMapView()}
        </Base>
    )
}

export default BoundaryMap;