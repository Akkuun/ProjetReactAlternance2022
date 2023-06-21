import axios from "axios";

const json = require('./API_Secret.json')
//function designed to return the correct token depending on the mode (user/device)
export async function getTokenAPI(mode,cloud) {
    let tokenResult;
    switch (mode) {
        case "user":
            tokenResult = await axios.post(json.clouds[cloud]["Url_token"], {
                'grant_type': 'client_credentials',
                'scope': json.clouds[cloud]["Scope_user"],
                'client_id': json.clouds[cloud]["Client_ID_Token_user"],
                'client_secret': json.clouds[cloud]["Client_SECRET_Token_user"]
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return tokenResult.data["access_token"]
        case "device":
            tokenResult = await axios.post(json.clouds[cloud]["Url_token"], {
                'grant_type': 'client_credentials',
                'scope': json.clouds[cloud]["Scope_device"],
                'client_id': json.clouds[cloud]["Client_ID_Token_device"],
                'client_secret': json.clouds[cloud]["Client_SECRET_Token_device"]
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
export async function getListInstallation(token, a1,cloud) {
    return await axios.get(`${json.clouds[cloud]["Url_get_list_installation"]}${a1}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': json.clouds[cloud]["OCP_API_KEY_GET_LIST_INSTALLATION"]
        }
    })
}
// get the list of room for a specific a1 and installationID
export async function getListOfRoomByInstallation(token, a1, installID,cloud) {
    console.log()
    return await axios.get(`${json.clouds[cloud]["Url_get_list_of_room_by_installation"]}${a1}/${installID}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key':  json.clouds[cloud]["OCP_API_KEY_GET_LIST_INSTALLATION"]
        }
    })
}
// function designed to return all the device data by a device id specified
export async function getDataByDeviceID(token, deviceID,cloud) {
    return await axios.get(`${json.clouds[cloud]["Url_get_data_by_device_part1"]}${deviceID}/${deviceID}${json.clouds[cloud]["Url_get_data_by_device_part2"]}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': json.clouds[cloud]["OCP_API_KEY_GET_LIST_INSTALLATION"]
        }
    })
}
//function designed to return the list of the a1 of a specific cloud
export async function getListOfUser(token,cloud) {
    return axios.get(json.clouds[cloud]["Url_get_list_of_user"], {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': ''
        }
    })
}
//function used to send UC=1 to a specific deviceID
export async function sendUserConnected(a1, installationId, DeviceId,cloud) {
    await axios.put( json.clouds[cloud]["Url_send_user_connected"], {
            A1: a1,
            In: installationId,
            S1: DeviceId
        }, {
            headers: {
                "Authorization": "Bearer " + await getTokenAPI("device",cloud),
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key":  json.clouds[cloud]["OCP_API_KEY_GET_LIST_INSTALLATION"]

            },
        }
    );
    setTimeout(10000);
}