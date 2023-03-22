const {TableClient, AzureNamedKeyCredential} = require("@azure/data-tables");
const fs = require("fs");

const tableName = "Configurations";
//Fenix CREDENTIALS
const accountFenix = "vs2feiothubprod";
const accountKeyFenix = "ubk9t3QtmYbXJ56kd6r9RjhNRxx5QkiQ9oXxP7cnp+VpUyxYPAG8BI9UzS4rbYWKkBfPME2p7J8u5scGnNAElw==";
const credentialFenix = new AzureNamedKeyCredential(accountFenix, accountKeyFenix);
const clientFenix = new TableClient(`https://${accountFenix}.table.core.windows.net`, tableName, credentialFenix);
//DEVEX CREDNETIALS
const accountProd = "";
const accountKeyProd ="";
const crendentialProd = new AzureNamedKeyCredential(accountProd, accountProd);



async function main() {
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Fenix_Devices.csv`, "id,latitude,longitude,cloud\r\n")
    var WattsType = ['Co', 'Cm', 'Pf', 'ec', 'cf', 'bo', 'Bt', 'Ma', 'Rt', 'df']
    var mapCloud = new Map();
    mapCloud.set('Fenix',)

// après l but sera de factorisé par rapport à un tableau de cloud, pour chacun des cloud on va écrire le fichier csv du wattstype correspondant
    // avec ${nomcloud}Co.csv et on refactorisé la fonction pour faire un appel pour chacune des cases du tableau

    //fs.writeFileSync(`/home/dubanm/LocalisationDevice/Pf.csv`, "id,lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Co.csv`, "id,codePays,ville\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Ec.csv`, "id,ec\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Cf.csv`, "id,cf\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Bo.csv`, "id,bo\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Bt.csv`, "id,bt\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Ma.csv`, "id,ma\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Rt.csv`, "id,rt\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Df.csv`, "id,df\r\n")
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Cm.csv`, "id,cm\r\n")

    let entitiesIterFenix = clientFenix.listEntities();
    var coordonee = [];

    let i = 1;
    for await (const entity of entitiesIterFenix) {



         var WattsTypeActuel = entity.rowKey
        // //ici on doit récupérer les string entre le 65 ieme et 79 ieme caracteère car l'attribut Value est une seule string contenteant Gp timestamp ect.. on récupère donc juste la string qu'on veut
        // // impossible de trasnformer la string en autre chose donc cette solution a été gardée.
        if (entity.rowKey === "Gp" && entity.Value.slice(65, 79).length === 14) {


            coordonee = entity.Value.slice(65, 79).split(',')

            fs.appendFileSync(`Fenix_Devices.csv`, entity.partitionKey + "," + coordonee[0] + "," + coordonee[1] + ",Fenix_Devices\r\n")
        }


        if (WattsType.includes(WattsTypeActuel)) {


            switch (WattsTypeActuel) {
                case 'ec':
                    fs.appendFileSync(`Ec.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83)) + "\r\n")
                    break;
                case 'Cm':
                    fs.appendFileSync(`Cm.csv`, entity.partitionKey + "," + (entity.Value.slice(64, 65)) + "\r\n")
                    break;
                case 'Pf':
                    //A faire plus tard mais il faudra boucluer sur chaque heure [0,0,85,2... ici on a une chauffe de set point de 2 h à 3h du mat
                    break;
                case 'Co':
                    var pays= entity.Value.slice(65).split('"')
                    fs.appendFileSync(`Co.csv`, entity.partitionKey + "," + (entity.Value.slice(65,67)) + ","+ pays[0].slice(3)+ "\r\n")
                    break;
                case 'cf':
                    fs.appendFileSync(`Cf.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83))+ "\r\n")
                    break;
                case 'bo':
                    fs.appendFileSync(`Bo.csv`, entity.partitionKey + "," + (entity.Value.slice(80, 83))+ "\r\n")
                    break;
                case 'Bt':
                    var bt =entity.Value.slice(64).split(',')
                    fs.appendFileSync(`Bt.csv`, entity.partitionKey + "," + bt[0]+ "\r\n")
                    break;
                case 'Ma':
                    fs.appendFileSync(`Ma.csv`, entity.partitionKey + "," + entity.Value.slice(80,83)+ "\r\n")
                    break;
                case 'Rt':
                    fs.appendFileSync(`Rt.csv`, entity.partitionKey + "," + (entity.Value.slice(64,66))+ "\n")
                    break;
                case 'df':
                    fs.appendFileSync(`Df.csv`, entity.partitionKey + "," + (entity.Value.slice(80,83))+ "\r\n")
                    break;
            }
            fs.appendFileSync(`Fenix_Devices.csv`, entity.partitionKey + "," + coordonee[0] + "," + coordonee[1] + ",Fenix_Devices\r\n")
        }


        i++;

    }
    console.log("DONE ! ")

}


main();