@echo off
echo Deploying Firebase Security Rules...
echo.
echo Make sure you have Firebase CLI installed:
echo   npm install -g firebase-tools
echo   firebase login
echo.
echo Deploying rules...
firebase deploy --only storage,firestore
echo.
echo Rules deployed successfully!
pause