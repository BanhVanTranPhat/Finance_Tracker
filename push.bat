@echo off
REM Quick push script for Windows
cd /d %~dp0

REM Ensure git user is configured (first time only)
for /f "tokens=*" %%i in ('git config user.name') do set GIT_USER=%%i
if "%GIT_USER%"=="" (
  echo Git user is not configured. Run these once:
  echo   git config --global user.name "Your Name"
  echo   git config --global user.email "your@email.com"
  goto :eof
)

git add -A
set msg=
set /p msg=Commit message (default: chore: update): 
if "%msg%"=="" set msg=chore: update

git commit -m "%msg%" || goto push

:push
git pull --rebase origin main 2>nul
git push -u origin main
echo Done.

