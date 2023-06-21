const {TableClient, AzureNamedKeyCredential} = require("@azure/data-tables");
const fs = require("fs");
const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const token = 'SN12c-NOIptEN7rTWtFcnCLPkw2yxTNyDV6OFf4t-g0wmHg3AJhzrH0M9AXFX0qKpFwv9GpRhTVe2uTzhsr1eg=='
const url = 'http://10.99.3.47:8086'
const client = new InfluxDB({url: url, token: token})


/// Microsft Azure API
const tableName = "Configurations";
//Fenix CREDENTIALS
const accountFenix = "vs2feiothubprod";
const accountKeyFenix = "ubk9t3QtmYbXJ56kd6r9RjhNRxx5QkiQ9oXxP7cnp+VpUyxYPAG8BI9UzS4rbYWKkBfPME2p7J8u5scGnNAElw==";
const credentialFenix = new AzureNamedKeyCredential(accountFenix, accountKeyFenix);
const clientFenix = new TableClient(`https://${accountFenix}.table.core.windows.net`, tableName, credentialFenix);
//Dev CREDNETIALS
const accountDev = "visionsystem2iothubdev";
const accountKeyDev = "tGgdX2NLHleL9kB/olmjzfuTfUGqdMPsUrQol4JK76s5rvkQdpqCuvBL7NJOD3IurTuP6VuEUG3/Ohwgz2ECBQ==";
const crendentialDev = new AzureNamedKeyCredential(accountDev, accountKeyDev);
const clientDev = new TableClient(`https://${accountDev}.table.core.windows.net`, tableName, crendentialDev);
//Prod CRED
const accountProd = "gkpiotstrgprd";
const accountKeyProd = "8mqkbTCM1NZ0+0p2MRieW9gbWuSFDEH7OqkI7N8Ra69BDvaCaa67DE1aGYpb6WGTvqs1Lz+hMQu1+6eTnULxMw==";
const crendentialProd = new AzureNamedKeyCredential(accountProd, accountKeyProd);
const clientProd = new TableClient(`https://${accountProd}.table.core.windows.net`, tableName, crendentialProd);
// Deltacalor CRED
const accountDelta = "dltclriotstrgprd";
const accountKeyDelta = "VDOKfGPr3A0eSpmJFA0x1KiyWkaoBRtacr9ioBlqcJp+qImZ6eqqLf70HMrOptbbju6NCJmkVXqvJwqCrE8MBQ==";
const crendentialDelta = new AzureNamedKeyCredential(accountDelta, accountKeyDelta);
const clientDelta = new TableClient(`https://${accountDelta}.table.core.windows.net`, tableName, crendentialDelta);
// GKP cred
const accountGkp = "gkpiotstrgprd";
const accountKeyGkp = "8mqkbTCM1NZ0+0p2MRieW9gbWuSFDEH7OqkI7N8Ra69BDvaCaa67DE1aGYpb6WGTvqs1Lz+hMQu1+6eTnULxMw==";
const crendentialGkp = new AzureNamedKeyCredential(accountGkp, accountKeyGkp);
const clientGkp = new TableClient(`https://${accountGkp}.table.core.windows.net`, tableName, crendentialGkp);


async function extractedDataFromEntitiesClient(entitiesFromClient, WattsType, cloudActuel) {
    for await (const entity of entitiesFromClient) {
        var coordonee = [];

        var WattsTypeActuel = entity.rowKey
        // //ici on doit récupérer les string entre le 65 ieme et 79 ieme caracteère car l'attribut Value est une seule string contenteant Gp timestamp ect.. on récupère donc juste la string qu'on veut
        // // impossible de trasnformer la string en autre chose donc cette solution a été gardée.
        if (entity.rowKey === "Gp" && entity.Value.slice(65, 79).length === 14 && cloudActuel === "FENIX") {
            coordonee = entity.Value.slice(65, 79).split(',')
            fs.appendFileSync(`Fenix_Devices.csv`, entity.partitionKey + "," + coordonee[0] + "," + coordonee[1] + "," + cloudActuel + "\r\n")
        }
        if (WattsType.includes(WattsTypeActuel)) {
            switch (WattsTypeActuel) {
                case 'ec':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'ec', JSON.parse(entity.Value).value)
                    break;
                case 'Cm':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Cm', JSON.parse(entity.Value).value)
                    break;
                case 'Pf':
                    //A faire plus tard mais il faudra boucluer sur chaque heure [0,0,85,2... ici on a une chauffe de set point de 2 h à 3h du mat
                    break;
                case 'Co':
                    var pays = entity.Value.slice(65).split('"')
                    if (pays[0].slice(3) !== '') {

                        // fs.appendFileSync(`Co.csv`, entity.partitionKey + "," + JSON.parse(entity.Value).value.slice(0, 2) + "," + pays[0].slice(3) + "," + cloudActuel + "\r\n")
                    }
                    break;
                case 'cf':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'cf', JSON.parse(entity.Value).value)
                    break;
                case 'bo':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'bo', JSON.parse(entity.Value).value)
                    break;
                case 'Bt':
                    var bt = entity.Value.slice(64).split(',')
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Bt', bt[0])
                    break;
                case 'Ma':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Ma', JSON.parse(entity.Value).value)
                    break;
                case 'Rt':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Rt', JSON.parse(entity.Value).value)
                    break;
                case 'df':
                    await CreerPointInfluxEtEnvoie(cloudActuel, 'df', JSON.parse(entity.Value).value)
                    break;
            }
        }
    }
}
async function main() {
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Fenix_Devices.csv`, "id,latitude,longitude,cloud\r\n")
    var WattsType = ['Co', 'Cm', 'Pf', 'ec', 'cf', 'bo', 'Bt', 'Ma', 'Rt', 'df']
    var cloud = ['Dev', 'Prod', 'FENIX', 'Deltacalor', 'Gkp']
    let entitiesIterFenix = clientFenix.listEntities();
    let entitiesIterDev = clientDev.listEntities();
    let entitiesIterProd = clientProd.listEntities();
    let entitiesIterDelta = clientDelta.listEntities();
    let entitiesIterGkp = clientGkp.listEntities();
    var i = 0;
// après le but sera de factoriser par rapport à un tableau de cloud, pour chacun des cloud on va écrire le fichier csv du wattstype correspondant
    // avec ${nomcloud}Co.csv et on refactorisé la fonction pour faire un appel pour chacune des cases du tableau

    //fs.writeFileSync(`/home/dubanm/LocalisationDevice/Pf.csv`, "id,lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Co.csv`, "id,codePays,ville,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Ec.csv`, "id,ec,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Cf.csv`, "id,cf,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Bo.csv`, "id,bo,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Bt.csv`, "id,bt,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Ma.csv`, "id,ma,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Rt.csv`, "id,rt,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Df.csv`, "id,df,cloud\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Cm.csv`, "id,cm,cloud\r\n")
    await extractedDataFromEntitiesClient(entitiesIterDev, WattsType, cloud[i]);
    i++
    await extractedDataFromEntitiesClient(entitiesIterProd, WattsType, cloud[i]);
    i++
    await extractedDataFromEntitiesClient(entitiesIterFenix, WattsType, cloud[i]);
    i++
    await extractedDataFromEntitiesClient(entitiesIterDelta, WattsType, cloud[i]);
    i++
    await extractedDataFromEntitiesClient(entitiesIterGkp, WattsType, cloud[i]);
}

async function CreerPointInfluxEtEnvoie(cloudName, wattsType, value) {
   // ici on doit retouner un promise, ici le but est d'être sur que les fonctions s'éxcute bien à la suite des autres
    // car on avait trop de "débit" dans la file d'influxDB, ducoup ici, quand on atteint la fin de la fonction on resolve et quand y'a une erreur, on reject
    // on a donc une succesion de resolve et on est sûr que on execute les fonctions les unes à la suite des autres
    return new Promise((resolve, reject) => {
        let org = `Watts`
        let bucket = `StatsWattsType`
        try {
            const writeApi = client.getWriteApi(org, bucket)
            writeApi.useDefaultTags({cloud: cloudName})
            let point = new Point('measurementWattsType')
                .intField('value', parseInt(value))
                .tag('cloudActuel', cloudName)
                .tag('wattsType', wattsType)
            writeApi.writePoint(point);
            writeApi
                .close()
                .then(() => {
                    resolve();
                })
                .catch(e => {reject()
                })
        } catch (e) {
        }
    })
}
main();