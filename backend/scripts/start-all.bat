@echo off
set MONGOD=C:\Daynote\backend\node_modules\.cache\mongodb-memory-server\mongod-x64-win32-7.0.24.exe
set DBPATH=C:\Daynote\backend\.mongodb-data\db
set LOGPATH=C:\Daynote\backend\.mongodb-data\log\mongod.log

echo Starting MongoDB...
start "" "%MONGOD%" --dbpath "%DBPATH%" --logpath "%LOGPATH%" --port 27017 --bind_ip 127.0.0.1

echo Waiting for MongoDB to come up...
timeout /t 4 /nobreak >nul

echo Starting Daynote backend...
node C:\Daynote\backend\server.js
