import { API } from "../../backend"

export const joinDuty = (userId, dutyId, token) =>{
    return fetch(`${API}/user/${userId}/startDuty/${dutyId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const finishDuty = (userId, dutyId, token) =>{
    return fetch(`${API}/user/${userId}/endDuty/${dutyId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())
    .catch(err => console.log(err))
}