rm -rf build/
rm aws_package.zip

pip install -r requirements.txt -t build/ --upgrade
cp -r fillnull_server build/
cp app.py build/
cd build
zip -r ../aws_package.zip .
cd ../

aws lambda update-function-code --function-name test --zip-file fileb://aws_package.zip
