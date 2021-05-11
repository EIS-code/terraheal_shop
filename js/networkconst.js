const BASEURL="http://35.180.202.175";

export const SIGNIN      = BASEURL+"/shops/signin";
export const THERAPISTS  = BASEURL+"/shops/getTherapists";
export const SERVICES    = BASEURL+"/shops/getServices";
export const ONGOING     = BASEURL+"/waiting/getOngoingMassage";
export const WAITING     = BASEURL+"/waiting/getWaitingMassage";
export const PREFERENCES = BASEURL+"/shops/getPreferences";
export const SESSIONS    = BASEURL+"/shops/sessions/get";
export const ADD_CLIENT  = BASEURL+"/waiting/addClient";
export const ADD_NEW_BOOKING = BASEURL+"/waiting/addNewBooking";
export const CONFIRM_BOOKING = BASEURL+"/waiting/confirmBooking";

export function Post(url, postData, success, errorCallBack) {
    let axiosConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
        }
    };

    axios.post(url, postData, axiosConfig)
    .then((res) => {
        success(res);
    })
    .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        errorCallBack(err);
    });
}

export function Get(url, postData, success, errorCallBack) {
    let axiosConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
        }
    };

    axios.get(url, postData, axiosConfig)
    .then((res) => {
        success(res);
    })
    .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        errorCallBack(err);
    });
}
