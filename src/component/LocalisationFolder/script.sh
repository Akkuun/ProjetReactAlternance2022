DATA=$(ls -t  ../../brillat/git/backup_cosmos_install/backupFenix/ | head -n 1)
rm Positions.csv
node ScriptRecuperationData.js $DATA
sudo cp Positions.csv /var/www/html/LocalisationDevice

