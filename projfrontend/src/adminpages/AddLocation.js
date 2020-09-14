import React, {useState, useEffect} from 'react';
import Base from '../core/base';
import {Map, Marker, Popup, TileLayer, GeoJSON} from 'react-leaflet';
import {getAdmin} from './helper/adminapicall';
import { isAdminAuthenticated } from '../auth/helper';
import { addDutyLocation } from './helper/dutiesHelper';


const AddLocation = ({match, history}) =>{

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

    const mapData = (adminId, token) =>{
        getAdmin(adminId, token).then( data =>{
            if(data.error){
                setValues(true);
            } else{
               setValues({...values, shape: data, name: data.properties.name, success: true})
               setMarkerPosition({...markerPosition, point_lat: data.geometry.coordinates[0][0][0][1], point_lng: data.geometry.coordinates[0][0][0][0]})
            }
        })
    }

    useEffect(()=>{
        mapData(user.gid, token);
        console.log(markerPosition)
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
        <Map center={[shape.geometry.coordinates[0][0][0][1], shape.geometry.coordinates[0][0][0][0]]} zoom={15}> 
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
            <button className="btn btn-info" onClick={onSubmit}>Save Duty</button>
        </div>
    )

    const successMessage = () =>{
        return (
            <div className="col-md-4 offset-sm-4 alert alert-success"
             style={{display: loaded ? "" : "none"}}>
            <h4>Duty Added with Location Succesfully</h4>
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
        setTimeout(()=>{if(loaded){history.push('/admin/dashboard')}}, 2000 )
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

export default AddLocation;