import Axios from "axios";
import { API_URL } from "../../constants/API";

export const getCartData = (userId) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId,
            },
        })
        .then((result) => {
            // Dispatch to cart reducer with payload: result.data
            dispatch({
                type: "FILL_CART",
                payload: result.data,
            });
        })
        .catch(() => {
            alert("Unable to add to cart");
        });
    };
};