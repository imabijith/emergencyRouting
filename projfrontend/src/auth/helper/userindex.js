import { API } from "../../backend";

export const userSignIn = user =>{
    return fetch(`${API}/user/signin`,{
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }).then(response => response.json())
    .catch(err=>console.log(err))
}

export const userAuthenticate = (data,next) =>{
    if(typeof window !== undefined){
        localStorage.setItem("jwt", JSON.stringify(data))
    }
    next();
}

export const userSignOut = next =>{
    if(typeof window!== undefined){
        localStorage.removeItem("jwt")
        next();

        return fetch(`${API}/user/signout`,{
            method: "GET",
        }).then(response => console.log(response))
        .catch(err => console.log(err))
    }
}

export const isUserAuthenticated = () =>{
    if(typeof window == undefined){
        return false
    }
    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"))
    } else{
        return false
    }
}