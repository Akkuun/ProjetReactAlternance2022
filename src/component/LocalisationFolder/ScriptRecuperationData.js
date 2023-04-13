const fs = require("fs");
const {parse} = require("csv-parse");


let lastBackupNameDeltacalor = process.argv.slice(3)[0]
let lastBackupNameDev = process.argv.slice(4)[0]
const lastBackupNameProd = process.argv.slice(5)[0]
//vide donc erreur
const lastBackupNameWattsVision = process.argv.slice(6)[0]
const Fenix_Device_Csv = "Fenix_Devices.csv"


const listeCloud = ["Deltacalor", "Dev", "WattsProd", "WattsVision"]
let count = 0; // compteur qui permet d'associer la valeur cloud à partir de l'index du tableau listeCloud

//Méthode qui prend en paramètre un chemin de répertoire, parcourt tout les fichier, extrait les coordonnées GPS et si elles sont utilisable l'insère dnas le fichier CSV
function ExtractDataFromCloudBackupToCSV(directory) {

    for (const file of fs.readdirSync(`${directory}/`)) {
        let data = fs.readFileSync(`${directory}/${file}`, "utf-8");

        //On fait d'abord JSON Parse pour récupérer le contenu du JSON
        //puis stringify pour le transformer le string et pouvoir appeler la méthode split
        // qui renvoie un tableau d'élement après avoir séparé la string de la ,


        if (count < 3) {
            let Coordinate = JSON.stringify(JSON.parse(data).addressGPS)
            if (Coordinate != null || Coordinate !== undefined) var CoordinateArray = Coordinate.split(",")
///filtre pour enlever les valeurs parasites
            if (!(CoordinateArray.includes("null")) && !(CoordinateArray.includes(null)) && !(CoordinateArray.includes("")) &&
                !(CoordinateArray.includes('""')) && !(CoordinateArray.includes("undefined")) &&
                !(CoordinateArray.includes(undefined)) && !(CoordinateArray.includes('undefined')) && !(CoordinateArray === undefined) && count !== 3) {
                let long = CoordinateArray[0].replace('"', '')
                let lag = CoordinateArray[1].replace('"', '')

                //ajoute au fichier csv les coordonnées
                fs.appendFileSync(`Positions.csv`, `${JSON.parse(data).id},${long},${lag},${listeCloud[count]}\r\n`)
            }

        } else {
            let Cordinate_Vision = JSON.stringify(JSON.parse(data).position)

            if (Cordinate_Vision != null) {
                var lat_v = Cordinate_Vision.split(',')[0].split(':')[1]
                var long_v = Cordinate_Vision.split(',')[1].split(':')[1]

            }

            if (lat_v!=="0" && long_v!=="0"){
                console.log(lat_v + "   " + long_v)
                fs.appendFileSync(`Positions.csv`, `${JSON.parse(data).id},${lat_v},${long_v},${listeCloud[count]}\r\n`)
            }
            ///filtre pour enlever les valeurs parasites
//       if (!(CoordinateArray_vision.includes("0")) && !(CoordinateArray_vision.includes(null))) {
//           //console.log(CoordinateArray_vision)
//           let long = Cordinate_Vision[0].replace('"', '')
//           let lag = Cordinate_Vision[1].replace('"', '')
//
//           //ajoute au fichier csv les coordonnées
//           fs.appendFileSync(`Positions.csv`, `${JSON.parse(data).id},${long},${lag},${listeCloud[count]}\r\n`)
//       }
        }

    }

    count++;
}


//fonction qui crée le fichier CSV et qui boucle sur chacun des directory passé en paramètre du script
function getAllData() {

    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Positions.csv`, "id,latitude,longitude,cloud\r\n")


    let directoryCloud = [
        `/home/brillat/git/backup_cosmos_install/backupDeltacalor/${lastBackupNameDeltacalor}`,
        `/home/brillat/git/backup_cosmos_install/backupWattsDev/${lastBackupNameDev}`,
        `/home/brillat/git/backup_cosmos_install/backupWattsProd/${lastBackupNameProd}`,
        `/home/brillat/git/backup_cosmos_centrale_wattsvision/backupWattsVisionProd/Smarthome/${lastBackupNameWattsVision}`


    ]


    directoryCloud.forEach(element => {

        ExtractDataFromCloudBackupToCSV(element)

    })
    //add all FENIX Devices Data into the CSV
    fs.createReadStream(Fenix_Device_Csv)
        .pipe(parse({delimiter: ",", from_line: 2}))
        .on("data", function (row) {

            fs.appendFileSync(`Positions.csv`, `${row[0]},${row[1]},${row[2]},${"Fenix"}\r\n`)

        })


}


getAllData()



