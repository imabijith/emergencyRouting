import React, {useState, useEffect} from 'react';
import Base from '../core/base';
import {Map, Marker, Popup, TileLayer, GeoJSON} from 'react-leaflet';
import {getAdmin} from './helper/adminapicall';
import { isAdminAuthenticated } from '../auth/helper';
import { addDutyLocation, getDuty } from './helper/dutiesHelper';


const UpdateLocation = ({match, history}) =>{

    const [values, setValues] = useState({
        error: false,
        success: false,
        shape: "",
        name: ""
    })

    const [markerPosition, setMarkerPosition] = useState({
        point_lat: "",
        point_lng: "",
        loaded: false,
        loaded_without: false
    })


    const {error, success, shape, name} = values;

    const {point_lat, point_lng, loaded, loaded_without} = markerPosition;

    const {user, token} = isAdminAuthenticated();

    const refmarker = React.createRef(Marker)

    const mapData = () =>{
        getAdmin(user.gid, token).then( data =>{
            if(data.error){
                setValues(true);
            } else{
               setValues({...values, shape: data, name: data.properties.name, success: true})
            }
        })
    }

    const mapLocation = () =>{
        getDuty(user.gid, match.params.dutyId, token).then(data=>{
            if(data.error){
                console.log(data.error)
            } else{
                const new_data = data.duty_location;
                setMarkerPosition({...markerPosition, point_lat: JSON.parse(new_data).coordinates[1], point_lng: JSON.parse(new_data).coordinates[0]})
            }
        })
    }

    useEffect(()=>{
        mapLocation();
        mapData();
    }, [])

    const onDrag = () =>{
        const marker = refmarker.current;
        setMarkerPosition({...markerPosition, point_lat: marker.leafletElement.getLatLng().lat, point_lng: marker.leafletElement.getLatLng().lng})
    } 

    const onSubmit = event =>{
        event.preventDefault();
        setValues({...values, error: false});
        addDutyLocation(user.gid, match.params.dutyId, token, {point_lat, point_lng}).then(data=>{
            if(data.error){
                setValues({...values, error: data.error})
            }else{
                setMarkerPosition({...markerPosition, loaded: true})
            }
        }).catch(err=>console.log(err))
    }

    const BoundaryMapView = () =>(
        <Map center={[point_lat, point_lng]} zoom={15}> 
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
            <GeoJSON data={shape}><Popup>{name}</Popup></GeoJSON>
            <Marker 
                draggable={true}
                onDragend={onDrag} 
                position={[point_lat, point_lng]}
                ref={refmarker}>
            </Marker>       
        </Map>
    )

    const positionSubmit = ()=>(
        <div>
            <button className="btn btn-info" onClick={onSubmit}>Update Duty Location</button>
        </div>
    )

    const successMessage = () =>{
        return (
            <div className="col-md-4 offset-sm-4 alert alert-success"
             style={{display: loaded ? "" : "none"}}>
            <h4>Duty Location Updated Succesfully</h4>
            </div>)
    }    

    const errorMessage = () =>{
        console.log(error)
        return (
            <div className="col-md-4 offset-sm-4 alert alert-success"
             style={{display: error ? "" : "none"}}>
            <h4>{error}</h4>
            </div>)
    }
    
    const toAdminDashboard = () =>{
        setTimeout(()=>{if(loaded){history.push('/admin/manageduties')}}, 2000 )
    }

    return(
        <Base title="Add Location to Duty" description="Add a location to your duty. Please make sure you add location for a point duty.">
            {positionSubmit()}
            {successMessage()}
            {errorMessage()}<br />
            {success && BoundaryMapView()}
            {toAdminDashboard()}
            
        </Base> 
    )
}

export default UpdateLocation;