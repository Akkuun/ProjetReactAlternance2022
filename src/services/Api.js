import axios from "axios";



export async function getTokenAPI(mode) {
    console.log(process.env.REACT_APP_YOURVARIABLE)
    let tokenResult;
    switch (mode) {
        case "user":
            tokenResult = await axios.post(process.env.REACT_APP_URL_TOKEN_USER, {
                'grant_type': 'client_credentials',
                'scope': process.env.REACT_APP_SCOPE_TOKEN_USER,
                'client_id': process.env.REACT_APP_CLIENT_ID_TOKEN_USER,
                'client_secret': process.env.REACT_APP_CLIENT_SECRET_TOKEN_USER
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return tokenResult.data["access_token"]

        case "device":
            tokenResult = await axios.post( process.env.REACT_APP_URL_TOKEN_DEVICE, {
                'grant_type': 'client_credentials',
                'scope':  process.env.REACT_APP_SCOPE_TOKEN_DEVICE,
                'client_id': process.env.REACT_APP_CLIENT_ID_TOKEN_DEVICE,
                'client_secret':  process.env.REACT_APP_CLIENT_SECRET_TOKEN_DEVICE
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
    console.log(`${process.env.REACT_APP_URL_GET_LIST_INSTALLATION}${a1}`)
    return await axios.get(`${process.env.REACT_APP_URL_GET_LIST_INSTALLATION}${a1}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': process.env.REACT_APP_OCP_API_KEY_GET_LIST_INSTALLATION
        }
    })
}

// get the list of room for a specific a1 and installationID
export async function getListOfRoomByInstallation(token, a1, installID) {
    return await axios.get(`${process.env.REACT_APP_URL_GET_LIST_OF_ROOM_BY_INSTALLATION}${a1}/${installID}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
        }
    })
}

export async function getDataByDeviceID(token, deviceID) {
    return await axios.get(`https://visionsystem2-apim-dev.azure-api.net/iotmanagement/v1/configuration/${deviceID}/${deviceID}/v1/content/`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
        }
    })
}

export async function getListOfUser(token) {

    return axios.get("https://visionsystem2-identity-dev.azurewebsites.net/api/v1.0/Users", {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': ''
        }
    })
}




export async function sendUserConnected(a1, installationId, DeviceId) {



    await axios.put('https://visionsystem2-apim-dev.azure-api.net/iotmanagement/v1/devices/userconnected', {
        A1: a1,
        In: installationId,
        S1: DeviceId
    }, {
        headers: {
            "Authorization": "Bearer "+await getTokenAPI("device"),
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": "bf20abb55f57449eb5f10783b6bf67e6"

        },
    }
    );
    setTimeout(10000);

}