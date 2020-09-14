import { API } from "../../backend";

export const getNotifications = (userId, token) =>{
    return fetch(`${API}/user/${userId}/getNotifications`,{
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getLiveDuty = (userId, token) =>{
    return fetch(`${API}/user/${userId}/liveduties`,{
        method: "GET",
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}