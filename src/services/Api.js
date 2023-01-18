import axios from "axios";





export async function getTokenAPI(mode) {
    let tokenResult;
    switch (mode) {
        case "user":
            tokenResult = await axios.post("https://visionsystem2-identity-dev.azurewebsites.net/connect/token", {
                'grant_type': 'client_credentials',
                'scope': 'https://visionsystem2.com/tou/user_impersonation https://visionsystem2.com/schemas/user_impersonation https://visionsystem2.com/iotmanagement/user_impersonation https://visionsystem2.com/identity/user_impersonation https://visionsystem2.com/firmware/user_impersonation https://visionsystem2.com/businessmodule/user_impersonation',
                'client_id': '428d5523-cb72-47ef-8602-8a63a8836d68',
                'client_secret': '4040ABD71CA1FA1F268A38E825E3E3158577330F70F19A1913C3571A8FD5E58A'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return tokenResult.data["access_token"]
        
        case "device":
            tokenResult = await axios.post("https://visionsystem2-identity-dev.azurewebsites.net/connect/token", {
                'grant_type': 'client_credentials',
                'scope': 'Device.Write Installation.Read IOTManagement.Write TermOfUse.Read TermOfUse.Write Commissionings.Read Commissionings.Write DataProcessing.Read DataProcessing.Write Device.Read Firmware.Read Firmware.Write HistoricalData.Read HistoricalData.Write Installation.Write IOTManagement.Read Room.Read Room.Write Schema.Read Schema.Write https://visionsystem2.com/iotmanagement/user_impersonation https://visionsystem2.com/operations/user_impersonation https://visionsystem2.com/tou/user_impersonation https://visionsystem2.com/businessmodule/user_impersonation https://visionsystem2.com/identity/user_impersonation https://visionsystem2.com/dataprocessing/user_impersonation',
                'client_id': '2b64fa79-35c3-418f-8a78-3ef6f9df9c53',
                'client_secret': 'EB44AA55C51AD31B87D139528CD5DE7E89BE925B301A4351B918E4CB568B3252'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return tokenResult.data["access_token"]
    }
}

// Get the list of installation by a A1
export async function getListInstallation(token, a1) {
    return await axios.get(`https://visionsystem2-apim-dev.azure-api.net/security/v1/security/getInstallationsByUser/${a1}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
        }
    })
}

// get the list of room for a specific a1 and installationID
export async function getListOfRoomByInstallation(token, a1, installID) {
    return await axios.get(`https://visionsystem2-apim-dev.azure-api.net/businessmodule/v1/installations/${a1}/${installID}`, {
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


export async function getStatistics(mode, token, A1, installationID, deviceID, wattsType, realDataInterval, minInterval, maxInterval) {
    let url;
    if (mode === "installation") {
        url = `https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/${installationID}/${A1}/${realDataInterval}/${wattsType}/${minInterval}/${maxInterval}`;
    } else {
        url = `https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/device/${installationID}/${deviceID}/${A1}/${realDataInterval}/${wattsType}/${minInterval}/${maxInterval}`;
    }
    let statisticsData = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
        }
    })
    
    return statisticsData;
}
