import { API } from "../../backend";

// read
export const getAdmin = (adminId, token) => {
  return fetch(`${API}/admin/${adminId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getUser = (adminId, userId, token) => {
  return fetch(`${API}/admin/${adminId}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getUsers = (adminId, token) => {
  return fetch(`${API}/admin/${adminId}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

//create
export const userRegister = (data, adminId, token) => {
  return fetch(`${API}/admin/${adminId}/userRegistration`, {
    method: "POST",
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

//update
export const userUpdate = (adminId, userId, token, user) => {
  return fetch(`${API}/admin/${adminId}/updateUser/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

//delete
export const deleteUser = (adminId, userId, token) => {
  return fetch(`${API}/admin/${adminId}/deleteUser/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => console.log(response.json()))
    .catch((err) => console.log(err));
};
