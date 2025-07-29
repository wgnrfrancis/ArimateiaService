@echo off
echo =====================================
echo 🚀 PUSH PARA O GITHUB - ARIMATEIA
echo =====================================

:: Etapa 1 - adicionar todos os arquivos alterados
echo 📁 Adicionando arquivos...
git add .

:: Etapa 2 - pedir mensagem de commit
set /p mensagem=Digite a mensagem do commit: 

:: Etapa 3 - fazer o commit
echo 💾 Fazendo commit...
git commit -m "%mensagem%"

:: Etapa 4 - enviar para o GitHub
echo 🌐 Enviando para o GitHub...
git push

echo.
echo ✅ Alterações enviadas com sucesso!
echo.
pause
