import React, {useState, useEffect} from 'react';
import Base from '../core/base';
import { isAdminAuthenticated } from '../auth/helper';
import { getDuty, updateDuty } from './helper/dutiesHelper';



const UpdateDuty = ({history, match}) =>{

    const [values, setValues] = useState({
        officer_id: 0,
        duty_type: "",
        duty_description: "",
        duty_date: "",
        start_duty_time: "",
        end_duty_time: "",
        duty_id: "",
        error: "",
        success: false,
        isRedirect: false,
        toAddMap: false
    })

    const {officer_id, duty_type, duty_description, duty_date, start_duty_time, end_duty_time, duty_id, error, success, isRedirect, toAddMap} = values;

    const {user, token} = isAdminAuthenticated();

    const userData = () =>{
        getDuty(user.gid, match.params.dutyId, token).then(data=>{
            if(data.error){
                setValues({...values, error: data.error})
            } else{
                setValues({
                    officer_id: data.officer_id,
                    duty_type: data.duty_type,
                    duty_description: data.duty_description,
                    duty_date: data.duty_date,
                    start_duty_time: data.start_duty_time,
                    end_duty_time: data.end_duty_time,
                    duty_id: data.id,
                })
            }
        })}

    useEffect(()=>{
        userData();
    }, [])

    const handleChange = name => event =>{
        setValues({...values, error: false, success: false, [name]: event.target.value});
    } 

    const onSubmit = event =>{
        event.preventDefault();
        setValues({...values, error: false}) 
        updateDuty(user.gid, match.params.dutyId, token, {duty_type, duty_description, duty_date, start_duty_time, end_duty_time}).then(data=>{
            if(data.error){
                setValues({...values, error: data.error})
            }else{
                setValues({
                    ...values,
                    officer_id: 0,
                    duty_type: "",
                    duty_description: "",
                    duty_date: "",
                    start_duty_time: "",
                    end_duty_time: "",
                    duty_id: data.id,
                    success: true,
                    isRedirect: true
                })
            }
        })
    }

    const successMessage = () =>(
        <div className="col-md-4 offset-sm-4 alert alert-success"
        style={{display: success ? "" : "none"}}>
       <h4>Duty Updated Succesfully</h4>
       </div>
    )

    const toDutyManagePage = () =>{
        setTimeout(()=>{if(isRedirect){history.push('/admin/manageduties')}}, 2000 )
    }

    const errorMessage = () =>{
        return (
            <div className="col-md-4 offset-sm-4 alert alert-success"
             style={{display: error ? "" : "none"}}>
            <h4>{error}</h4>
            </div>)
    }

    const DutyForm = () =>(
        <div>
        <div className="row">
            <div className="col-6">
            <div className="col-md-10 offset-sm-1">
                <h4 className="text-center">Duty Details</h4>
                <div className="form-group">
                </div>
                <div className="form-group">
                    <label className="text-black">Duty Type (Example: Point, Beat, Investigation)</label>
                    <input type="text" onChange={handleChange("duty_type")} value={duty_type} className="form-control border-dark"/>
                </div>
                <div className="form-group">
                    <label className="text-black">Duty description</label>
                    <input type="text" onChange={handleChange("duty_description")} value={duty_description} className="form-control border-dark"/>
                </div>
            </div>
            </div>    
            <div className="col-6">
            <h4 className="text-center text-bold">Duty Timing</h4>
            <br />
            <h6 className="text-center">Date</h6>
            <div className="col-md-10 offset-sm-1 row">
                <div className="form-group col-6 text offset-3">
                    <input type="date" onChange={handleChange("duty_date")} value={duty_date} className="form-control border-dark"/>
                </div>
            </div>
            <br />
            <h6 className="text-center">Time</h6>
            <div className="col-md-10 offset-sm-1 row">
            <div className="form-group col-6">
                    <label className="text-black">From (Time)</label>
                    <input type="time" onChange={handleChange("start_duty_time")} value={start_duty_time}className="form-control border-dark"/>
                </div>
                <div className="form-group col-6">
                    <label className="text-black">Till (Time)</label>
                    <input type="time" onChange={handleChange("end_duty_time")} value={end_duty_time} className="form-control border-dark"/>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-3 offset-2">
                    <button className="btn btn-dark px-3" onClick={onSubmit}>Submit</button>
                </div>
            </div>            
            </div>
        </div>
        
        </div>)

    return(
        <Base title="Update Duty" description="Update details of existing Duty Here">
            {DutyForm()}
            {successMessage()}
            {toDutyManagePage()}
            {errorMessage()}
        </Base>
    )
}

export default UpdateDuty;