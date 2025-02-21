@echo off
REM Load environment variables from config.txt
for /f "tokens=1,* delims==" %%A in (config.txt) do (
    set %%A=%%B
)

REM Start MongoDB Server
start "" "%MONGODB_DIR%\mongod.exe" --dbpath="%DB_PATH%"

REM Wait for MongoDB to initialize
timeout /t 5

REM Start Node.js Server
cd /d "%NODE_SERVER_PATH%"
node server.js

REM Keep the window open
cmd /k
