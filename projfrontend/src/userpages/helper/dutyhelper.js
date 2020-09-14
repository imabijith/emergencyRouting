import {API} from '../../backend'

export const getDutyUser = (userId, dutyId, token) =>{
    return fetch(`${API}/user/${userId}/duty/${dutyId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getNotification = (userId, notificationId, token) =>{
    return fetch(`${API}/user/${userId}/getnotification/${notificationId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getDutiesForOfficer = (userId, token) =>{
    return fetch(`${API}/user/${userId}/duties`, {
        method: "GET",
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}