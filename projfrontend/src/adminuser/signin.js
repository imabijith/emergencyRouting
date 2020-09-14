import React, {useState} from 'react';
import Base from '../core/base';
import { signin, adminAuthenticate, isAdminAuthenticated } from '../auth/helper';
import { Redirect } from 'react-router-dom';


const SignIn = () =>{

    const [value, setValue] = useState({
        username: "",
        password: "",
        error: "",
        loading: false,
        isRedirect: false
    })

    const {username, password, error, loading, isRedirect} = value;

    const handleChange = name => event =>{
        setValue({...value, error:false, [name]: event.target.value})
    }

    const onSubmit = event =>{
        event.preventDefault();
        setValue({...value, error:false, loading: true})
        signin({username, password})
        .then(data =>{
            if(data.error){
                setValue({...value, error:data.error, loading: false})
            } else{
                adminAuthenticate(data, ()=>{
                    setValue({...value, isRedirect: true})
                })
            }
        }).catch(err=>console.log(err))
    }

    const loadingMessage = () =>{
        return(
            loading && 
            <div className="alert alert-info">
                Loading..
            </div>
        )
    }

    const errorMessage = () =>{
        return(
            error &&
            <div className="col-md-4 offset-sm-4">
            <div className="alert alert-warning" style={{display: error ? "": "none"}}>
                {error}
            </div>
            </div>
        )
    }

    const {user} = isAdminAuthenticated();

    const onRedirect = () =>{
        if(isRedirect){
            if(user.type){
                return(
                <Redirect to="admin/dashboard" />
                )}
        }
        if(isAdminAuthenticated()){
            return (<Redirect to="/" />
            )}
    }

    const SignInForm = () =>{
        return(
            <div className ="row">
                <div className = "col-md-4 offset-sm-4 border rounded border-info">
                    <br/>
                    <form>
                        <div className="form-group">
                            <label className="text-black">Username</label>
                            <input type="text" value={username} onChange={handleChange("username")} className="form-control border-dark" />
                        </div>
                        <div className="form-group">
                            <label className="text-black">Password</label>
                            <input type="password" value={password} onChange={handleChange("password")}className="form-control border-dark" />
                        </div><br />
                        <button onClick={onSubmit} className="btn btn-md bg-info btn-block">Sign in</button>
                    </form>
                    <br /> <br />
                </div>
            </div>
        )
    }


    return(
        <Base title="Sign in" description="Sign in to administrate your Traffic Police Station" className="bg-white">
            <br /> <br />
            {SignInForm()}
            {loadingMessage()}
            {errorMessage()}
            {onRedirect()}
        </Base>
    )
}

export default SignIn;