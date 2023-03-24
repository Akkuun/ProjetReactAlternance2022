LAST_DATE_FENIX=$(ls -t  ../../brillat/git/backup_cosmos_install/backupFenix/ | head -n 1)
LAST_DATE_DELTACALOR=$(ls -t  ../../brillat/git/backup_cosmos_install/backupDeltacalor/ | head -n 1)
LAST_DATE_DEV=$(ls -t  ../../brillat/git/backup_cosmos_install/backupWattsDev/ | head -n 1)
LAST_DATE_PROD=$(ls -t  ../../brillat/git/backup_cosmos_install/backupWattsProd/ | head -n 1)
#LAST_DATE_GKP=$(ls -t  ../../brillat/git/backup_cosmos_install/backupGkp/ | head -n 1)

#if test -f "Positions.csv"; then
#  rm Positions.csv
#fi;
#
#if test -f "Bo.csv"; then
#  rm Bo.csv
#fi;
#if test -f "Bt.csv";  then
#  rm Bt.csv
#fi;
#if test -f "Cf.csv";  then
#  rm Cf.csv
#fi;
#if test -f "Cm.csv";  then
#  rm Cm.csv
#fi;
#if test -f "Co.csv"; then
#  rm Co.csv
#fi;
#if test -f "Df.csv"; then
#  rm Df.csv
#fi;
#if test -f "Ec.csv"; then
#  rm Ec.csv
#fi;
#if test -f "Ma.csv"; then
#  rm Ma.csv
#fi;
#if test -f "Rt.csv"; then
#  rm Rt.csv
#fi;
#if test -f "Fenix_Devices.csv"; then
#  rm Fenix_Devices.csv
#fi;





sudo node ScriptRecuperationTableConfigurationFromAzureStorage.js #recupere les wattsType des configs
sudo node ScriptRecuperationData.js $LAST_DATE_FENIX $LAST_DATE_DELTACALOR $LAST_DATE_DEV $LAST_DATE_PROD #$LAST_DATE_GKP
sudo chmod +777 Co.csv
#sudo python3 ConversionGeoPositiontoCity.py #Lance le script python pour recupérer les pays des devices de tout les clouds
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
sudo cp classement.csv /var/www/html/LocalisationDevice


