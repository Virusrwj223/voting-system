# Magic Link Voter Authentication System

This project implements a **Magic Link** authentication system to securely verify voter identities before they access a voting form. The system ensures that only intended recipients can access and fill out the form by sending unique, time-sensitive magic links via email.

---

## Setup Instructions

### Prerequisites

1. Ensure you have **pnpm** installed on your system. You can install it by following the instructions on the [pnpm website](https://pnpm.io/installation).
2. Install **Node.js** (if not already installed), as pnpm depends on it.
3. Clone the repository into your specifiec directory and `cd` into the directory.

```bash
git clone https://github.com/Virusrwj223/magicLink.git
cd magicLink
```

---

### Step 1: Install Dependencies

After cloning the repository, navigate to the project directory and run the following command to install all required dependencies:

```bash
pnpm i
```

Set up prisma

```
cd src/db
prisma generate
```

---

### Step 2: Run the Backend Server

Start the backend server with the following command:

```bash
pnpm run dev
```

The server will start running at `http://localhost:3010`.

---

### Step 3: Update Emails

Update the `emails.txt` file in the project root directory. Each line in this file should contain an email address and a corresponding customer ID, separated by a space. For example:

```txt
user1@example.com 1
user2@example.com 2
user3@example.com 3
```

---

### Step 4: Send Emails

Open another terminal window and run the appropriate script for your operating system to send the magic links to the listed email addresses:

For Mac/Linux:

```bash
./sendEmail.sh
```

For Windows:

```cmd
./sendEmail.bat
```

```powershell
./sendEmail.ps1
```

Each script reads the `emails.txt` file, sends the magic links to the specified email addresses, and outputs a success message for each email sent.
