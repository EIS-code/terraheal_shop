const BASEURL="http://35.180.202.175";

export const SUCCESS_CODE     = 200;
export const ERROR_CODE       = 401;
export const EXCEPTION_CODE   = 401;
export const APP_ENVIRONMENT  = 'dev';

export const SIGNIN      = BASEURL+"/shops/signin";
export const THERAPISTS  = BASEURL+"/therapist/getTherapists";
export const SERVICES    = BASEURL+"/shops/getServices";
export const ONGOING     = BASEURL+"/waiting/getOngoingMassage";
export const WAITING     = BASEURL+"/waiting/getWaitingMassage";
export const PREFERENCES = BASEURL+"/shops/getPreferences";
export const SESSIONS    = BASEURL+"/shops/sessions/get";
export const ADD_CLIENT  = BASEURL+"/waiting/addClient";
export const ADD_NEW_BOOKING    = BASEURL+"/waiting/addNewBooking";
export const CONFIRM_BOOKING    = BASEURL+"/waiting/confirmBooking";
export const GET_ALL_THERAPISTS = BASEURL+"/waiting/getAllTherapists";
export const GET_ROOMS          = BASEURL+"/rooms/getRooms";
export const SEARCH_CLIENT      = BASEURL+"/clients/searchClients";
export const ASSIGN_ROOMS       = BASEURL+"/waiting/assignRoom";
export const DOWNGRADE_BOOKING  = BASEURL+"/waiting/downgradeBooking";
export const CANCEL_BOOKING     = BASEURL+"/waiting/cancelAppointment";
export const FUTURE_BOOKINGS    = BASEURL+"/waiting/getFutureBooking";
export const COMPLETED_BOOKINGS = BASEURL+"/waiting/getCompletedBooking";
export const CANCELED_BOOKINGS  = BASEURL+"/waiting/getCancelBooking";

export function isLive()
{
    return (APP_ENVIRONMENT === 'prod' || APP_ENVIRONMENT === 'production');
}

export function getLocalShopStorage()
{
    let dummyData = !isLive() ? {"id": 5, "api_key": "shop5"} : {};

    return JSON.parse(localStorage.getItem("shopData") || dummyData);
}

export function Post(url, postData, success, errorCallBack)
{
    let shopData = getLocalShopStorage();

    let axiosConfig = {
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': 'application/json',
            'api-key': shopData.api_key
        }
    };

    postData['shop_id'] = shopData.id;

    axios.post(url, postData, axiosConfig)
        .then((res) => {
            success(res);
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            errorCallBack(err);
        });
}

export function Get(url, postData, success, errorCallBack)
{
    let shopData = getLocalShopStorage();

    let axiosConfig = {
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': 'application/json',
            'api-key': shopData.api_key
        }
    };

    postData['shop_id'] = shopData.id;

    axios.get(url, postData, axiosConfig)
        .then((res) => {
            success(res);
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            errorCallBack(err);
        });
}

const CancelToken = axios.CancelToken;

let cancel;

export async function searchClients(searchValue)
{
    let shopData = getLocalShopStorage();

    // Cancel previous request
    if (cancel !== undefined) {
        cancel();
    }

    let postData  = {
        "shop_id": shopData.id,
        "search_val": searchValue
    };

    return  axios.post(SEARCH_CLIENT, postData, {
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                }),
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    'Content-Type': 'application/json',
                    'api-key': shopData.api_key
                }
            })
            .then((response) => {
                // Response Body

                return response;
            })
            .catch((error) => {
                if (axios.isCancel(error)) {}
            });
}
