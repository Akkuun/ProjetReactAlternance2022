import axios from "axios";


export async function getTokenAPI(mode,cloud) {


    let tokenResult;
    switch (mode) {
        case "user":
            tokenResult = await axios.post(process.env.REACT_APP_URL_TOKEN_WATTSDEV, {
                'grant_type': 'client_credentials',
                'scope': process.env.REACT_APP_SCOPE_TOKEN_USER_WATTSDEV,
                'client_id': process.env.REACT_APP_CLIENT_ID_TOKEN_USER_WATTSDEV,
                'client_secret': process.env.REACT_APP_CLIENT_SECRET_TOKEN_USER_WATTSDEV
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return tokenResult.data["access_token"]

        case "device":
            tokenResult = await axios.post(process.env.REACT_APP_URL_TOKEN_DEVICE_DEV, {
                'grant_type': 'client_credentials',
                'scope':  process.env.REACT_APP_SCOPE_TOKEN_DEVICE_DEV,
                'client_id': process.env.REACT_APP_CLIENT_ID_TOKEN_DEVICE_DEV,
                'client_secret':  process.env.REACT_APP_CLIENT_SECRET_TOKEN_DEVICE_DEV
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return tokenResult.data["access_token"]

        default :
            console.log("ERREUR")
    }
}

// Get the list of installation by a A1
export async function getListInstallation(token, a1) {

    return await axios.get(`${process.env.REACT_APP_URL_GET_LIST_INSTALLATION_DEV}${a1}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': process.env.REACT_APP_OCP_API_KEY_GET_LIST_INSTALLATION_DEV
        }
    })
}

// get the list of room for a specific a1 and installationID
export async function getListOfRoomByInstallation(token, a1, installID) {
    return await axios.get(`${process.env.REACT_APP_URL_GET_LIST_OF_ROOM_BY_INSTALLATION_DEV}${a1}/${installID}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': process.env.REACT_APP_OCP_API_KEY_GET_LIST_OF_ROOM_BY_INSTALLATION_DEV
        }
    })
}

export async function getDataByDeviceID(token, deviceID) {
    return await axios.get(`${process.env.REACT_APP_URL_GET_DATA_BY_DEVICE_PART1_DEV}${deviceID}/${deviceID}${process.env.REACT_APP_URL_GET_DATA_BY_DEVICE_PART2_DEV}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': process.env.REACT_APP_OCP_API_KEY_GET_DATA_BY_DEVICE_DEV
        }
    })
}

export async function getListOfUser(token) {

    return axios.get(process.env.REACT_APP_URL_GET_LIST_OF_USER_DEV, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': ''
        }
    })
}




export async function sendUserConnected(a1, installationId, DeviceId) {



    await axios.put(process.env.REACT_APP_URL_SEND_USER_CONNECTED_DEV, {
        A1: a1,
        In: installationId,
        S1: DeviceId
    }, {
        headers: {
            "Authorization": "Bearer "+await getTokenAPI("device"),
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.REACT_APP_OCP_API_KEY_SEND_USER_CONNECTED_DEV

        },
    }
    );
    setTimeout(10000);

}