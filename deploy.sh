echo "switching branch master.."
git checkout master

git add .

git commit -m "release on server V 2.5 ...."

echo "pushing on master ....."
git push origin master
echo "push finished !"

echo "Building App..."
npm run build

echo "Deploying file to server"
scp -r build/* dubanm@10.99.3.47:/var/www/html
echo "Deploying file to server done ! "
echo "Deploying Script to server"
scp -r src/component/LocalisationFolder/script.sh dubanm@10.99.3.48:/home/dubanm/LocalisationDevice
echo "Deploying Script to server done !"
echo "Deploying Localisation Map Device html file"
scp -r src/component/LocalisationFolder/Localisation.html dubanm@10.99.3.48:/var/www/html/LocalisationDevice
echo "Deploying Localisation Map Device html file done !"
scp -r src/component/LocalisationFolder/Localisation.html dubanm@10.99.3.48:/var/www/html/LocalisationDevice/index.html


echo "Done !"