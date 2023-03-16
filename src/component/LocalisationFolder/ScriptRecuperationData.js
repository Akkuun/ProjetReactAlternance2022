const fs = require("fs");

const lastBackupName = process.argv.slice(2)

function getAllData() {
    let directory = `/home/brillat/git/backup_cosmos_install/backupDeltacalor/${lastBackupName}`;
    let count=0;
    fs.writeFileSync(`/home/dubanm/LocalisationDevice/Positions.csv`, "id,latitude,longitude,co\r\n")
    for (const file of fs.readdirSync(`${directory}/`)) {
        let data = fs.readFileSync(`${directory}/${file}`, "utf-8");
        //On fait d'abord JSON Parse pour récupérer le contenu du JSON
        //puis stringify pour le transformer le string et pouvoir appeler la méthode split
        // qui renvoie un tableau d'élement après avoir séparé la string de la ,
        let Coordinate = JSON.stringify(JSON.parse(data).Gp)

        console.log(count++)
        var CoordinateArray = Coordinate.split(",")
        console.log(CoordinateArray)


///filtre pour enlever les valeurs parasites
        if (!(CoordinateArray.includes("null")) && !(CoordinateArray.includes(null)) && !(CoordinateArray.includes("")) &&
            !(CoordinateArray.includes('""')) && !(CoordinateArray.includes("undefined")) &&
            !(CoordinateArray.includes(undefined)) && !(CoordinateArray.includes('undefined'))) {
            let long = CoordinateArray[0].replace('"', '')
            let lag = CoordinateArray[1].replace('"', '')

            //ajoute au fichier csv les coordonnées
            fs.appendFileSync(`Positions.csv`, `${JSON.parse(data).id},${long},${lag}\r\n`)

        }

    }


}


getAllData()



