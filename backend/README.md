Follow these steps to set up and run the project locally.
Prerequisites
• Node.js (LTS version recommended)
• npm (Comes bundled with Node.js)
• A running instance of MongoDB (or a connection string to a hosted service like MongoDB Atlas).
# Installation

1. Clone the repository (if you haven't already)
git clone https://github.com/Masthan1996/products-backend.git
cd products-backend/backend
2. Install dependencies:
npm install
3. Configure Environment Variables
Create a file named .env in the root directory of products-backend. This file will store sensitive configuration details.

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/rconso_db_name
JWT_SECRET=your_super_secret_key_for_auth

Note: The .env file is listed in .gitignore and should never be committed to version control.

# Running the Server
Start the application using the following script (assuming your package.json has a start script):
# To run the server
npm start

# For development (if using nodemon or similar)
npm run dev

# Project Structure
The core logic is structured within the products-backend directory for clear separation of concerns.

# Technologies
• Node.js
• Express.js (Web Framework)
• MongoDB / Mongoose (Database / ODM)
• JWT (JSON Web Tokens for authentication)


