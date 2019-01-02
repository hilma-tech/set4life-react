#!/bin/bash


if [[ -z "$1" ]]; then
       echo "Please specify the target [cordova] project and make sure it has /www folder within"
       exit       
fi     

buildRootDir=$(pwd)/../$1
buildWWWDir=$buildRootDir/www
echo buildRootDir:$buildRootDir
echo buildWWWDir:$buildWWWDir

npm run build

rm $buildWWWDir/* -vrf

cp build/* $buildWWWDir -rv

#sed -i 's/\/static\//static\//g' $buildWWWDir/index.html 

cd $buildRootDir

cordova run android







