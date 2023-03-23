LAST_DATE_FENIX=$(ls -t  ../../brillat/git/backup_cosmos_install/backupFenix/ | head -n 1)
LAST_DATE_DELTACALOR=$(ls -t  ../../brillat/git/backup_cosmos_install/backupDeltacalor/ | head -n 1)
LAST_DATE_DEV=$(ls -t  ../../brillat/git/backup_cosmos_install/backupWattsDev/ | head -n 1)
LAST_DATE_PROD=$(ls -t  ../../brillat/git/backup_cosmos_install/backupWattsProd/ | head -n 1)
#LAST_DATE_GKP=$(ls -t  ../../brillat/git/backup_cosmos_install/backupGkp/ | head -n 1)

rm Positions.csv
rm Bo.csv
rm Bt.csv
rm Cf.csv
rm Cm.csv
rm Co.csv
rm Df.csv
rm Ec.csv
rm Ma.csv
rm Rt.csv
rm Fenix_Devices.csv

node ScriptRecuperationData.js $LAST_DATE_FENIX $LAST_DATE_DELTACALOR $LAST_DATE_DEV $LAST_DATE_PROD #$LAST_DATE_GKP
node ScriptRecuperationTableconfigurationFromAzureStorage.js #recupere les wattsType des configs
python3 ConversionGeoPositiontoCity.py #Lance le script python pour recupérer les pays des devices de tout les clouds
sudo cp Positions.csv /var/www/html/LocalisationDevice # transfert les fichiers dans le dossier LocalisationDevice pour avoir les fichies à jour
sudo cp Bo.csv /var/www/html/LocalisationDevice
sudo cp Bt.csv /var/www/html/LocalisationDevice
sudo cp Cf.csv /var/www/html/LocalisationDevice
sudo cp Cm.csv /var/www/html/LocalisationDevice
sudo cp Co.csv /var/www/html/LocalisationDevice
sudo cp Ec.csv /var/www/html/LocalisationDevice
sudo cp Df.csv /var/www/html/LocalisationDevice
sudo cp Ma.csv /var/www/html/LocalisationDevice
sudo cp Rt.csv /var/www/html/LocalisationDevice


