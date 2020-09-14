import {API} from '../../backend';

export const getLiveAccidents = (adminId, token) =>{
    return fetch(`${API}/admin/${adminId}/getAccidents`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getAccidents = (adminId, token) =>{
    return fetch(`${API}/admin/${adminId}/getAllAccidents`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getAccidentsMY = (adminId, token, data) =>{
    return fetch(`${API}/admin/${adminId}/getAccidentsByMY`,{
        method: "POST",
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const markRead = (adminId, accidentId, token) =>{
    return fetch(`${API}/admin/${adminId}/readAccident/${accidentId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err=> console.log(err))
}