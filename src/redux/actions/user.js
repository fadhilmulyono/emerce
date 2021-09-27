import Axios from 'axios';
import { API_URL } from '../../constants/API';

export const registerUser = ({fullName, username, email, password}) => {
    return (dispatch) => {
        Axios.post(`${API_URL}/users`, {
            fullName,
            username,
            email,
            password,
            role: "user",
        })
        .then((result) => {
            delete result.data.password
            
            dispatch({
                type: "USER_LOGIN",
                payload: result.data
            })
            alert("Registration completed successfully.");
        })
        .catch(() => {
            alert("Registration failed, please try again.");
        })
    }
}

export const loginUser = ({username, password}) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                username,
            }
        })
        .then((result) => {
            if (result.data.length) {
                if (password === result.data[0].password) {
                    delete result.data[0].password
                    
                    localStorage.setItem("userDataEmmerce", JSON.stringify(result.data[0]));
                    
                    dispatch({
                        type: "USER_LOGIN",
                        payload: result.data[0],
                    })
                } else {
                    // Handle error wrong password
                    dispatch({
                        type: "USER_ERROR",
                        payload: "Wrong password, please try again.",
                    })
                }
            } else {
                // Handle error user not found
                dispatch({
                    type: "USER_ERROR",
                    payload: "User not found, please try again.",
                })
            }
        })
        .catch((err) => {
            alert("404 Not Found");
        })
    }
}

export const logoutUser = () => {
    localStorage.removeItem("userDataEmmerce");

    return {
        type: "USER_LOGOUT",
    };
};

export const userKeepLogin = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
        params: {
            id: userData.id,
        },
        })
        .then((result) => {
            delete result.data[0].password;

            localStorage.setItem("userDataEmmerce", JSON.stringify(result.data[0]));

            dispatch({
            type: "USER_LOGIN",
            payload: userData,
            });
        })
        .catch((err) => {
            alert("404 Not Found");
        });
    };
};

export const checkStorage = () => {
    return {
        type: "CHECK_STORAGE",
    };
};