echo "switching branch master.."
git checkout master

echo "Building App..."
npm run build

echo "Deploying file to server"
scp -r build/* dubanm@10.99.3.47:/var/www/10.99.3.47

echo "Done !"