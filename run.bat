@echo off

rem run Backend
cd Backend
start npm start

rem run Frontend
cd ../Frontend
start npm start

rem run llm server
cd ../llm_server
call run.bat