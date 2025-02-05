# Input text file
$inputFile = "emails.txt"

# Check if the file exists
if (-Not (Test-Path $inputFile)) {
    Write-Host "Error: File '$inputFile' not found." -ForegroundColor Red
    exit 1
}

# Read the file line by line
Get-Content $inputFile | ForEach-Object {
    # Split the line into email and number
    $parts = $_ -split " "
    $email = $parts[0]
    $customerId = $parts[1]

    # Check if email and number are valid
    if ($email -and $customerId) {
        # Create the payload
        $payload = @{
            email = $email
            customerid = $customerId
        } | ConvertTo-Json -Depth 1

        # Send the API request
        try {
            Invoke-RestMethod -Uri "http://localhost:3000/server/email/email-voting-notification" `
                              -Method Post `
                              -ContentType "application/json" `
                              -Body $payload

            # Output success message
            Write-Host "Email sent to $email of customerId $customerId" -ForegroundColor Green
        } catch {
            # Output error message
            Write-Host "Failed to send email to $email of customerId $customerId" -ForegroundColor Red
        }

        # Optional: Add a delay between requests (e.g., 1 second)
        Start-Sleep -Seconds 1
    } else {
        Write-Host "Skipping invalid line: $_" -ForegroundColor Yellow
    }
}

Write-Host "Done!" -ForegroundColor Cyan
