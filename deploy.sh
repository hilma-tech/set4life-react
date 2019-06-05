#!/bin/bash

npm run build

if [ $? -ne 0 ]; then
	echo "Cannot deploy build build wasn't successfull, check your code and try again"
	exit
fi


echo "Deploying into Carmel dev server ...."

rsync -rvza build/* carmeldev:/home/carmel/www/prod/set


