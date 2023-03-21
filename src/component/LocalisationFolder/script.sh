LAST_DATE_FENIX=$(ls -t  ../../brillat/git/backup_cosmos_install/backupFenix/ | head -n 1)
LAST_DATE_DELTACALOR=$(ls -t  ../../brillat/git/backup_cosmos_install/backupDeltacalor/ | head -n 1)
LAST_DATE_DEV=$(ls -t  ../../brillat/git/backup_cosmos_install/backupWattsDev/ | head -n 1)
LAST_DATE_PROD=$(ls -t  ../../brillat/git/backup_cosmos_install/backupWattsProd/ | head -n 1)
#LAST_DATE_GKP=$(ls -t  ../../brillat/git/backup_cosmos_install/backupGkp/ | head -n 1)

rm Positions.csv
rm Co.csv
rm Pg.csv
rm Co.csv
rm Ec.csv
rm Cf.csv
rm Bo.csv
rm Bt.csv
rm H1H2.csv
rm Ma.csv
rm Rt.csv
rm Df.csv
node ScriptRecuperationData.js $LAST_DATE_FENIX $LAST_DATE_DELTACALOR $LAST_DATE_DEV $LAST_DATE_PROD #$LAST_DATE_GKP
sudo cp Positions.csv /var/www/html/LocalisationDevice


