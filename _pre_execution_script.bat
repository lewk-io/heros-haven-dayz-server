cd "BEC"
call start "BEC - Test server" Bec.exe -f Config.cfg --dsc & ^
cd "..\profiles\Trader"
call git pull & ^
call npm run build-chernarus
cd "..\PlayerLoadouts"
call git pull & ^
call npm start