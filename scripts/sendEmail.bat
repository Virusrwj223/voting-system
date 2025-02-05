@echo off
setlocal enabledelayedexpansion

:: Input text file
set "input_file=emails.txt"

:: Read each line from the file
for /f "usebackq tokens=1,2 delims= " %%A in ("%input_file%") do (
    set "email=%%A"
    set "number=%%B"

    :: Call the API with curl
    curl -X POST "http://localhost:3000/server/email/email-voting-notification" ^
         -H "Content-Type: application/json" ^
         -d "{\"email\": \"!email!\", \"customerid\": \"!number!\"}"

    :: Print success message
    echo Email sent to !email! of customerId !number!

    :: Optional: Add a delay between requests (e.g., 1 second)
    timeout /t 1 >nul
)

echo Done!
