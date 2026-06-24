import axios from "axios"
import {serverUrl} from "../App"
import { setUserData } from "../redux/userSlice.js";

export const getUserProfile = async (dispatch) => {
    try{
        const response = await axios.get(serverUrl+"/api/user/profile", { withCredentials: true });
        // console.log(response.data);
        dispatch(setUserData(response.data.user))
    }
    catch(error)
    {
        console.log('Error fetching user profile:', error);
    }
}

export const getPredictionHistory = async () => {
    const response = await axios.get(serverUrl+"/api/user/history", { withCredentials: true });
    return response.data;
}
