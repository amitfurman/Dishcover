@echo off

rem create venv
if not exist "venv\Scripts\python.exe" (
    echo Creating virtual environment...
    call python -m venv venv
) else (
    echo Virtual environment already exists.
)

rem Navigate to venv
cd venv/scripts

rem Activate venv
call activate

rem Upgrade pip
call python.exe -m pip install --upgrade pip

rem Install common requirements
call pip install --no-cache-dir -r ../../requirements.txt