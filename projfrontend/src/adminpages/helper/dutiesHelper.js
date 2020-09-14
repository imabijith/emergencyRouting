import { API } from "../../backend";

export const createDuty = (adminId, token, duty) => {
  return fetch(`${API}/admin/${adminId}/createDuty`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(duty),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const addDutyLocation = (adminId, dutyId, token, duty_location) => {
  return fetch(`${API}/admin/${adminId}/addLocation/${dutyId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(duty_location),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getDuties = (adminId, token) => {
  return fetch(`${API}/admin/${adminId}/duties`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const deleteDuty = (adminId, dutyId, token) => {
  return fetch(`${API}/admin/${adminId}/deleteDuty/${dutyId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getDuty = (adminId, dutyId, token) => {
  return fetch(`${API}/admin/${adminId}/duty/${dutyId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const updateDuty = (adminId, dutyId, token, data) => {
  return fetch(`${API}/admin/${adminId}/updateDuty/${dutyId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const liveDutyLocation = (adminId, token) => {
  return fetch(`${API}/admin/${adminId}/livedutylocations`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
