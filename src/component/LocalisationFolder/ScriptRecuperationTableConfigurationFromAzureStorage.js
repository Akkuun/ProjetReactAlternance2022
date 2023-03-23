const {TableClient, AzureNamedKeyCredential} = require("@azure/data-tables");
const fs = require("fs");

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
                    fs.appendFileSync(`Ec.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83)) + "," + cloudActuel + "\r\n")
                    break;
                case 'Cm':
                    fs.appendFileSync(`Cm.csv`, entity.partitionKey + "," + (entity.Value.slice(64, 65)) + "," + cloudActuel + "\r\n")
                    break;
                case 'Pf':
                    //A faire plus tard mais il faudra boucluer sur chaque heure [0,0,85,2... ici on a une chauffe de set point de 2 h à 3h du mat
                    break;
                case 'Co':
                    var pays = entity.Value.slice(65).split('"')


                    if (pays[0].slice(3)!=='') {

                        fs.appendFileSync(`Co.csv`, entity.partitionKey + "," + (entity.Value.slice(65, 67)) + "," + pays[0].slice(3) + "," + cloudActuel + "\r\n")
                    }

                    break;
                case 'cf':
                    fs.appendFileSync(`Cf.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83)) + "," + cloudActuel + "\r\n")
                    break;
                case 'bo':
                    fs.appendFileSync(`Bo.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83)) + "," + cloudActuel + "\r\n")
                    break;
                case 'Bt':
                    var bt = entity.Value.slice(64).split(',')
                    fs.appendFileSync(`Bt.csv`, entity.partitionKey + "," + bt[0] + "," + cloudActuel + "\r\n")
                    break;
                case 'Ma':
                    fs.appendFileSync(`Ma.csv`, entity.partitionKey + "," + entity.Value.slice(80, 83) + "," + cloudActuel + "\r\n")
                    break;
                case 'Rt':
                    fs.appendFileSync(`Rt.csv`, entity.partitionKey + "," + (entity.Value.slice(64, 66)) + "," + cloudActuel + "\r\n")
                    break;
                case 'df':
                    fs.appendFileSync(`Df.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83)) + "," + cloudActuel + "\r\n")
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


main();