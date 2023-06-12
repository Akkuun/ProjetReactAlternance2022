const {TableClient, AzureNamedKeyCredential} = require("@azure/data-tables");
const fs = require("fs");

//influx
//const InfluxDb = require('influx');
//const { Point } = require('@influxdata/influxdb-client');


// const client = new InfluxDb.InfluxDB({
//     host: '10.99.3.47',
//     // url:'http://10.99.3.47:8086',
//     // port: 8086,
//     // protocol: 'http',
//     // username: 'admin',
//     // password: 'Watts3615*',
//     database: 'StatsWattsType',
//     token: 'CC48pu1KH8f991XnpbByNJbDRHQ5RASwkkiIw9OnxgLCkxL2dOzTGlB0Zm1SOc7G4I5UcSByIrdhVCSHo6BATQ==',
//     rejectUnauthorized: false
//
//     // requestTimeout: 30000, // temps d'attente pour la réponse du serveur en millisecondes
//     // org:'Watts'
// });


const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const token = 'SN12c-NOIptEN7rTWtFcnCLPkw2yxTNyDV6OFf4t-g0wmHg3AJhzrH0M9AXFX0qKpFwv9GpRhTVe2uTzhsr1eg=='
const url = 'http://10.99.3.47:8086'
//repl.repl.ignoreUndefined=true
const client = new InfluxDB({url: url, token: token})

///
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
                    // fs.appendFileSync(`Ec.csv`, entity.partitionKey + "," + (JSON.parse(entity.Value).value) + "," + cloudActuel + "\r\n")
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'ec');

                    await CreerPointInfluxEtEnvoie(cloudActuel, 'ec', JSON.parse(entity.Value).value)
                    break;
                case 'Cm':
                    // fs.appendFileSync(`Cm.csv`, entity.partitionKey + "," + (JSON.parse(entity.Value).value) + "," + cloudActuel + "\r\n")
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'Cm');


                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Cm', JSON.parse(entity.Value).value)

                    // client.writePoints([point])
                    //     .then(() => {
                    //         console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //           console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });
                    break;
                case 'Pf':
                    //A faire plus tard mais il faudra boucluer sur chaque heure [0,0,85,2... ici on a une chauffe de set point de 2 h à 3h du mat

                    break;
                case 'Co':
                    var pays = entity.Value.slice(65).split('"')


                    if (pays[0].slice(3) !== '') {

                        // fs.appendFileSync(`Co.csv`, entity.partitionKey + "," + JSON.parse(entity.Value).value.slice(0, 2) + "," + pays[0].slice(3) + "," + cloudActuel + "\r\n")
                    }
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'Co');
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //           console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //            console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });


                    // CreerPointInfluxEtEnvoie(cloudActuel,'Co',JSON.parse(entity.Value).value.slice(0,2))
                    break;
                case 'cf':
                    // fs.appendFileSync(`Cf.csv`, entity.partitionKey + "," + (JSON.parse(entity.Value).value) + "," + cloudActuel + "\r\n")

                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'cf');
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //          console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //          console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });

                    await CreerPointInfluxEtEnvoie(cloudActuel, 'cf', JSON.parse(entity.Value).value)
                    break;
                case 'bo':
                    // fs.appendFileSync(`Bo.csv`, entity.partitionKey + "," + (JSON.parse(entity.Value).value) + "," + cloudActuel + "\r\n")
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'bo');
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //          console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //          console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });

                    await CreerPointInfluxEtEnvoie(cloudActuel, 'bo', JSON.parse(entity.Value).value)
                    break;
                case 'Bt':
                    var bt = entity.Value.slice(64).split(',')
                    // fs.appendFileSync(`Bt.csv`, entity.partitionKey + "," + bt[0] + "," + cloudActuel + "\r\n")
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'Bt');
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //             console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //              console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });

                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Bt', bt[0])
                    break;
                case 'Ma':
                    // fs.appendFileSync(`Ma.csv`, entity.partitionKey + "," + JSON.parse(entity.Value).value + "," + cloudActuel + "\r\n")

                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'Ma');
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //               console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //             console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });

                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Ma', JSON.parse(entity.Value).value)
                    break;
                case 'Rt':
                    // fs.appendFileSync(`Rt.csv`, entity.partitionKey + "," + JSON.parse(entity.Value).value + "," + cloudActuel + "\n")
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'Rt');
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //              console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //               console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });

                    await CreerPointInfluxEtEnvoie(cloudActuel, 'Rt', JSON.parse(entity.Value).value)
                    break;
                case 'df':
                    // fs.appendFileSync(`Df.csv`, entity.partitionKey + "," + (JSON.parse(entity.Value).value) + "," + cloudActuel + "\r\n")
                    // var point = new Point('StatsWattsType')
                    //     .floatField('value', JSON.parse(entity.Value).value)
                    //     .tag('cloudActuel', cloudActuel)
                    //     .tag('wattsType', 'df');
                    // console.log(point)
                    // // Écrire le point dans la base de données
                    // client.writePoints([point])
                    //     .then(() => {
                    //                  console.log('Point écrit avec succès.');
                    //     })
                    //     .catch((error) => {
                    //         console.error(`Erreur lors de l'écriture du point : ${error}`);
                    //     });

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


// après l but sera de factorisé par rapport à un tableau de cloud, pour chacun des cloud on va écrire le fichier csv du wattstype correspondant
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
                .catch(e => {

                    reject()
                })
        } catch (e) {

        }

    })
}


main();