#!/bin/bash

# Input text file
input_file="emails.txt"

# Check if file exists
if [[ ! -f "$input_file" ]]; then
  echo "Error: File '$input_file' not found."
  exit 1
fi

# Read the file line by line
while IFS=" " read -r email number; do
  # Check if both email and number are non-empty
  if [[ -n "$email" && -n "$number" ]]; then
    # Send the API request
    curl -X POST "http://localhost:3000/server/email/email-voting-notification" \
         -H "Content-Type: application/json" \
         -d "{\"email\": \"$email\", \"customerid\": \"$number\"}"

    # Output success message
    echo "Email sent to $email of customerId $number"

    # Optional: Add a delay between requests (e.g., 1 second)
    sleep 1
  else
    echo "Skipping invalid line: $email $number"
  fi
done < "$input_file"

echo "Done!"
