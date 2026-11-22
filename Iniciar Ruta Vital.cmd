@echo off
title Ruta Vital - Servidor local
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor-local.ps1"
if errorlevel 1 pause
