@echo off
REM Read from config.txt and set environment variables
for /f "tokens=1,* delims==" %%A in (config.txt) do (
    set %%A=%%B
)

REM Start MongoDB server (mongod.exe)
start "" "%MONGODB_DIR%\mongod.exe" --dbpath="%DB_PATH%"

REM Wait a few seconds to ensure MongoDB starts
timeout /t 5

REM Start Node.js server
cd /d "%NODE_SERVER_PATH%"
node server.js
