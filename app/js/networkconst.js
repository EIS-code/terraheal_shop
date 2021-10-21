const BASEURL="http://35.180.202.175";

export const SUCCESS_CODE     = 200;
export const ERROR_CODE       = 401;
export const EXCEPTION_CODE   = 401;

export const SIGNIN      = BASEURL+"/shops/signin";
export const THERAPISTS  = BASEURL+"/therapist/getTherapists";
export const SERVICES    = BASEURL+"/shops/getServices";
export const ONGOING     = BASEURL+"/waiting/getOngoingMassage";
export const WAITING     = BASEURL+"/waiting/getWaitingMassage";
export const PREFERENCES = BASEURL+"/shops/getPreferences";
export const SESSIONS    = BASEURL+"/shops/sessions/get";
export const ADD_CLIENT  = BASEURL+"/waiting/addClient";
export const ADD_NEW_BOOKING    = BASEURL+"/waiting/addNewBooking";
export const ADD_NEW_BOOKING_SHOP = BASEURL+"/waiting/booking/add";
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
export const BOOKING_OVERVIEW   = BASEURL+"/waiting/bookingOverview";
export const THERAPIST_TIMETABLE = BASEURL+"/waiting/getTimeTable";
export const RECOVER_BOOKING     = BASEURL+"/waiting/recoverAppointment";
export const ROOM_OCCUPATIONS    = BASEURL+"/waiting/roomOccupation";
export const GET_RECEPTIONIST    = BASEURL+"/receptionist/getReceptionist";
export const GET_COUNTRIES       = BASEURL+"/location/get/country";
export const GET_CITIES          = BASEURL+"/location/get/city";
export const UPDATE_RECEPTIONIST = BASEURL+"/receptionist/update";
export const GET_RECEPTIONIST_STATISTICS = BASEURL+"/receptionist/getStatistics";
export const RECEPTIONIST_ADD_DOCUMENT   = BASEURL+"/receptionist/addDocument";
export const SEARCH_VOUCHERS             = BASEURL+"/waiting/searchVouchers";
export const SEARCH_PACKS                = BASEURL+"/waiting/searchPacks";
export const START_SERVICE_TIME          = BASEURL+"/waiting/startServiceTime";
export const END_SERVICE_TIME            = BASEURL+"/waiting/endServiceTime";
export const PRINT_BOOKING_DETAILS       = BASEURL+"/waiting/printBookingDetails";

export async function Post(url, postData, success, errorCallBack)
{
    loggedIn();

    var headersData = {
        'Access-Control-Allow-Origin': "*",
        'Content-Type': 'application/json'
    };

    if (SIGNIN == url) {
        var axiosConfig = {
            headers: headersData
        };
    } else {
        let shopData = getLocalShopStorage();

        // headersData['api-key'] = shopData.api_key[0].key;

        var axiosConfig = {
            headers: headersData
        };

        postData['shop_id'] = shopData.id;
    }

    return axios.post(url, postData, axiosConfig)
        .then((res) => {
            success(res);

            return res;
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            errorCallBack(err);

            return err;
        });
}

export async function PostDocument(url, formData, success, errorCallBack)
{
    loggedIn();

    var headersData = {
        'Access-Control-Allow-Origin': "*",
        'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data'
    };

    if (SIGNIN == url) {
        var axiosConfig = {
            headers: headersData
        };
    } else {
        let shopData = getLocalShopStorage();

        // headersData['api-key'] = shopData.api_key[0].key;

        var axiosConfig = {
            headers: headersData
        };

        formData['shop_id'] = shopData.id;
    }

    return axios.post(url, formData, axiosConfig)
        .then((res) => {
            success(res);

            return res;
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            errorCallBack(err);

            return err;
        });
}

export async function Get(url, postData, success, errorCallBack)
{
    loggedIn();

    let shopData = getLocalShopStorage();

    let axiosConfig = {
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': 'application/json',
            'api-key': shopData.api_key
        }
    };

    postData['shop_id'] = shopData.id;

    return axios.get(url, postData, axiosConfig)
        .then((res) => {
            success(res);

            return res;
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
            errorCallBack(err);

            return err;
        });
}

const CancelToken = axios.CancelToken;

let cancel;

export async function searchClients(searchValue, page)
{
    loggedIn();

    let shopData = getLocalShopStorage();

    // Cancel previous request
    if (cancel !== undefined) {
        cancel();
    }

    page = page || 1;

    let postData  = {
        "shop_id": shopData.id,
        "search_val": searchValue,
        "page_number": page
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

export async function getTherapists(clearCache)
{
    loggedIn();

    if (clearCache) {
        localStorage.setItem('shopTherapist', {});
    } else {
        let cachedData = JSON.parse(localStorage.getItem('shopTherapist'));

        if (cachedData != "" && cachedData != null && typeof cachedData == "object" && Object.keys(cachedData).length > 0) {
            return cachedData;
        }
    }

    let shopData = getLocalShopStorage();

    // Cancel previous request
    if (cancel !== undefined) {
        cancel();
    }

    let postData  = {
        "shop_id": shopData.id
    };

    return  axios.post(GET_ALL_THERAPISTS, postData, {
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

                localStorage.setItem('shopTherapist', JSON.stringify(response));

                return response;
            })
            .catch((error) => {
                if (axios.isCancel(error)) {}
            });
}

export async function getRooms(clearCache)
{
    loggedIn();

    if (clearCache) {
        localStorage.setItem('shopRooms', {});
    } else {
        let cachedData = JSON.parse(localStorage.getItem('shopRooms'));

        if (cachedData != "" && cachedData != null && typeof cachedData == "object" && Object.keys(cachedData).length > 0) {
            return cachedData;
        }
    }

    let shopData = getLocalShopStorage();

    // Cancel previous request
    if (cancel !== undefined) {
        cancel();
    }

    let postData  = {
        "shop_id": shopData.id
    };

    return  axios.post(GET_ROOMS, postData, {
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

                localStorage.setItem('shopRooms', JSON.stringify(response));

                return response;
            })
            .catch((error) => {
                if (axios.isCancel(error)) {}
            });
}

export async function getCountries(clearCache)
{
    loggedIn();

    if (clearCache) {
        localStorage.setItem('countries', {});
    } else {
        let cachedData = JSON.parse(localStorage.getItem('countries'));

        if (cachedData != "" && cachedData != null && typeof cachedData == "object" && Object.keys(cachedData).length > 0) {
            return cachedData;
        }
    }

    let shopData = getLocalShopStorage();

    // Cancel previous request
    if (cancel !== undefined) {
        cancel();
    }

    let postData  = {
        "shop_id": shopData.id
    };

    return  axios.get(GET_COUNTRIES, postData, {
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

                localStorage.setItem('countries', JSON.stringify(response));

                return response;
            })
            .catch((error) => {
                if (axios.isCancel(error)) {}
            });
}

export async function getCities(countryId, provinceId)
{
    loggedIn();

    let shopData = getLocalShopStorage();

    // Cancel previous request
    if (cancel !== undefined) {
        cancel();
    }

    let postData  = {
        "shop_id": shopData.id,
        "country_id": countryId,
        "province_id": provinceId
    };

    return  axios.post(GET_CITIES, postData, {
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
