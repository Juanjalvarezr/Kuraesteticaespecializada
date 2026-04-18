@echo off
chcp 65001 > nul
echo.
echo =================================================================
echo        SISTEMA DE PUBLICACION AUTOMATICA - KURA ESTETICA
echo =================================================================
echo.
echo Detectando cambios en tus archivos...
git add .

echo.
echo Guardando version segura...
git commit -m "Actualizacion web realizada por cliente: %date% %time%"

echo.
echo Subiendo informacion a la red y publicando en Vercel...
git push origin main

echo.
echo =================================================================
echo    !LISTO! Tu pagina se ha enviado al servidor con exito.
echo    Los cambios seran visibles en internet en ~30 segundos.
echo    Puedes recargar tu pagina publica para verlos.
echo =================================================================
echo.
pause
