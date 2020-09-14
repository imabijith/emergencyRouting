import React, { useState } from 'react';
import Base from '../core/base';
import { Link } from 'react-router-dom';



const AnalysisSelect = () =>{

    const [values, setValues] = useState({
        month: "",
        year: ""
    })

    const {month,year} = values;

    const handleChange = name => event =>{
        setValues({...values, [name]: event.target.value});
    }

    const selection = () =>(
        <div className="row">
            <div className="border border-info rounded py-5 col-5 offset-1 text-center">
                <br /> <br /> <br />
                <h4 className="text center">Select All Time Dataset</h4>
                <br /> <br />
                <Link to="/admin/analysis/mapall" className="btn btn-dark rounded px-4">View Map</Link>
            </div>
            <div className="border border-info rounded py-5 col-5 text-center">
                <br /> <br /> <br />
                <h4 className="text center">Select Month and Year Below</h4>
                <br />
                <div className="form-group">
                    <h5>Year</h5>
                    <select className="form-control col-6 offset-3 border-dark" onChange={handleChange("year")}>
                        <option>Select</option>
                        <option value={2020}>2020</option>
                    </select>
                </div>
                <div className="form-group">
                    <h5>Month</h5>
                    <select className="form-control col-6 offset-3 border-dark" onChange={handleChange("month")}>
                        <option>Select</option>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>
                <br />
                <Link className="btn btn-dark rounded px-4" to={`/admin/analysis/mapMY/${month}/${year}`}>View Map</Link>
            </div>
        </div>
    )

    return(
    <Base title="Select the analysis time period below">
    <br /> <br />
        {selection()}
    </Base>
    )
}

export default AnalysisSelect;