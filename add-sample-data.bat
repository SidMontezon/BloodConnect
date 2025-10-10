@echo off
echo ========================================
echo BloodConnect Sample Data Adder
echo ========================================
echo.

echo Installing Firebase dependencies...
npm install firebase

echo.
echo Adding sample data to Firebase Realtime Database...
node add-sample-data-simple.js

echo.
echo Press any key to exit...
pause > nul


