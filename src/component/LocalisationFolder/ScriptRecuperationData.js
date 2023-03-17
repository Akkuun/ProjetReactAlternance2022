const fs = require("fs");

const lastBackupNameFenix = process.argv.slice(2)
const lastBackupNameDeltacalor = process.argv.slice(3)
lastBackupNameDeltacalor.pop()
lastBackupNameDeltacalor.pop()

const lastBackupNameDev = process.argv.slice(4)
lastBackupNameDev.pop()
const lastBackupNameProd = process.argv.slice(5)
//vide donc erreur
//const lastBackupNameGkp = process.argv.slice(6)


const listeCloud=["Deltacalor","Dev","WattsProd"]
let count=0;
function ExtractDataFromCloudBackupToCSV(directory) {
    console.log(directory)
    for (const file of fs.readdirSync(`${directory}/`)) {
        let data = fs.readFileSync(`${directory}/${file}`, "utf-8");
        //On fait d'abord JSON Parse pour récupérer le contenu du JSON
        //puis stringify pour le transformer le string et pouvoir appeler la méthode split
        // qui renvoie un tableau d'élement après avoir séparé la string de la ,
        let Coordinate = JSON.stringify(JSON.parse(data).addressGPS)

        console.log(listeCloud[count] + Coordinate)
        if (Coordinate!=null || Coordinate!==undefined) var CoordinateArray = Coordinate.split(",")

///filtre pour enlever les valeurs parasites
        if (!(CoordinateArray.includes("null")) && !(CoordinateArray.includes(null)) && !(CoordinateArray.includes("")) &&
            !(CoordinateArray.includes('""')) && !(CoordinateArray.includes("undefined")) &&
            !(CoordinateArray.includes(undefined)) && !(CoordinateArray.includes('undefined'))) {
            let long = CoordinateArray[0].replace('"', '')
            let lag = CoordinateArray[1].replace('"', '')

            //ajoute au fichier csv les coordonnées
            fs.appendFileSync(`Positions.csv`, `${JSON.parse(data).id},${long},${lag},${listeCloud[count]}\r\n`)

        }

    }
    count++;
}

function getAllData() {

    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Positions.csv`, "id,latitude,longitude,cloud\r\n")

    let directoryCloud = [`/home/brillat/git/backup_cosmos_install/backupDeltacalor/${lastBackupNameDeltacalor}`,
        `/home/brillat/git/backup_cosmos_install/backupWattsDev/${lastBackupNameDev}`,
        `/home/brillat/git/backup_cosmos_install/backupWattsProd/${lastBackupNameProd}`
        // `/home/brillat/git/backup_cosmos_install/Gkp/${lastBackupNameGkp}`
        ]
    console.log("directoryCloud" + directoryCloud)

   directoryCloud.forEach( element =>{

      ExtractDataFromCloudBackupToCSV(element)

   })


}


getAllData()



