@ECHO OFF

electron-packager "E:\Jaydeep Mor\Work\Evolution IT Solutions\Terra Heal\shop_manager" "ShopExe" --platform=win32 --arch=x64 --overwrite && node build_installer.js
