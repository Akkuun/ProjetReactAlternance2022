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
            return await tokenResult.data["access_token"]

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
            return await tokenResult.data["access_token"]
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
export async function getListOfRommByInstallation(token, a1, installID) {
    return await axios.get(`https://visionsystem2-apim-dev.azure-api.net/businessmodule/v1/installations/${a1}/${installID}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': 'bf20abb55f57449eb5f10783b6bf67e6'
        }
    })
}

export async function getDataByRoomID(token, deviceID) {
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


export function getStatistics() {
    let headers = {
        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4RUZCRTM1Q0ExREU0MjY4QjdFOEY4NURDQzFEQjcxRkQzOTdDNjYiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJHTy0tTmNvZDVDYUxmby1GM01IYmNmMDVmR1kifQ.eyJuYmYiOjE2NzA0OTY2NTIsImV4cCI6MTY3MDU4Mjk5MiwiaXNzIjoiaHR0cHM6Ly92aXNpb25zeXN0ZW0yLWlkZW50aXR5LWRldi5henVyZXdlYnNpdGVzLm5ldCIsImF1ZCI6WyJidXNpbmVzc21vZHVsZSIsImRhdGFwcm9jZXNzaW5nIiwiZmlybXdhcmUiLCJpZGVudGl0eSIsImlvdG1hbmFnZW1lbnQiLCJvcGVyYXRpb25zIiwidG91Iiwic2NoZW1hcyJdLCJjbGllbnRfaWQiOiIyYjY0ZmE3OS0zNWMzLTQxOGYtOGE3OC0zZWY2ZjlkZjljNTMiLCJlbWFpbCI6InRoZW90ZXN0QHlvcG1haWwuY29tIiwic3ViIjoiRUM5QThCRERCRUVFIiwianRpIjoiVkxOT3gyUUtBQzB2UnB1TzhJbWh6USIsInNjb3BlIjpbIkNvbW1pc3Npb25pbmdzLlJlYWQiLCJDb21taXNzaW9uaW5ncy5Xcml0ZSIsIkRldmljZS5SZWFkIiwiRGV2aWNlLldyaXRlIiwiSGlzdG9yaWNhbERhdGEuUmVhZCIsIkhpc3RvcmljYWxEYXRhLldyaXRlIiwiaHR0cHM6Ly92aXNpb25zeXN0ZW0yLmNvbS9idXNpbmVzc21vZHVsZS91c2VyX2ltcGVyc29uYXRpb24iLCJJbnN0YWxsYXRpb24uUmVhZCIsIkluc3RhbGxhdGlvbi5Xcml0ZSIsIlJvb20uUmVhZCIsIlJvb20uV3JpdGUiLCJEYXRhUHJvY2Vzc2luZy5SZWFkIiwiRGF0YVByb2Nlc3NpbmcuV3JpdGUiLCJodHRwczovL3Zpc2lvbnN5c3RlbTIuY29tL2RhdGFwcm9jZXNzaW5nL3VzZXJfaW1wZXJzb25hdGlvbiIsIkZpcm13YXJlLlJlYWQiLCJGaXJtd2FyZS5Xcml0ZSIsImh0dHBzOi8vdmlzaW9uc3lzdGVtMi5jb20vaWRlbnRpdHkvdXNlcl9pbXBlcnNvbmF0aW9uIiwiaHR0cHM6Ly92aXNpb25zeXN0ZW0yLmNvbS9pb3RtYW5hZ2VtZW50L3VzZXJfaW1wZXJzb25hdGlvbiIsIklPVE1hbmFnZW1lbnQuUmVhZCIsIklPVE1hbmFnZW1lbnQuV3JpdGUiLCJodHRwczovL3Zpc2lvbnN5c3RlbTIuY29tL29wZXJhdGlvbnMvdXNlcl9pbXBlcnNvbmF0aW9uIiwiaHR0cHM6Ly92aXNpb25zeXN0ZW0yLmNvbS90b3UvdXNlcl9pbXBlcnNvbmF0aW9uIiwiVGVybU9mVXNlLlJlYWQiLCJUZXJtT2ZVc2UuV3JpdGUiLCJTY2hlbWEuUmVhZCIsIlNjaGVtYS5Xcml0ZSJdfQ.aHgJ6s_ufi-ODqpgMP_zYha_UzhQV5noyrl_rq9t8mw0DsBebU1MC7980etnEBMjdwRT-9_BqGF1b73s0ui_-oVfSLVHKz8Rea5H5jJ7FSeH_Z0qewa4Btlyry0xMbifjrkdl4E57Bjm00f_1GkQi7k-b8au3Jm99AZXDP7qWBbb9Jv0n9GC8l326rXhuGqO_FDRCGKstVAB-gpb-wipiKYpnq2dj59d5Vh4_SZCUDj5Hm13QDNY3LgiSelcqez0ZEzKevhAlO7L8XmqM7darxeWJCWy7vwg-HDwjTj0Qc9NswFSLwJTQddAv4IMK4W9wQ9n5weCEFa1WejN9GGElA`,
        'Ocp-Apim-Subscription-Key': ``
    };

    let statisticsData = axios.get(`https://visionsystem2-apim-dev.azure-api.net/DataProcessing/v1/metricsAggregat/consommation/installation/installSimulated/EC9A8BDDBEEE/Day/Wc/2022-12-01/2022-12-08`, {headers});
    return statisticsData
}