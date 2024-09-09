@echo off

rem install Backend packages
cd Backend
call npm install

rem install Frontend packages
cd ../Frontend
call npm install

rem prepare llm server
cd ../llm_server
call prepare_venv.bat