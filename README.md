# Product Import and Enhancement Service
This service imports a large CSV file of products, converts them into a required JSON format, enhances product descriptions using OpenAI, and upserts them into a MongoDB database. The application uses NestJS with MongoDB and is designed to run as a scheduled task.
## Prerequisites
Before running this project, ensure you have the following installed on your system:
- Docker
- Node.js (v16 or higher recommended)
- npm
## Getting Started
### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```
### 2. Run Docker Compose
Spin up the necessary services using Docker Compose:
```bash
docker compose up -d
```
This will start your MongoDB container in the background.
### 3. Configure Environment Variables
Copy the provided `sample.env` file to `.env`:
```bash
cp sample.env .env
```
Fill in the required variables.
### 4. Install Dependencies
Install the Node.js dependencies:
```bash
npm install
```
### 5. Run the Application
Start the application in development mode:
```bash
npm run start:dev
```
This will run the application, including the scheduled task that imports the products once a day.
## Usage
- The service will automatically import products from the CSV file and upsert them into MongoDB once per day.
- Product descriptions are enhanced using OpenAI.
## Scripts
- `npm run start:dev`: Run the application in development mode

## Environment Variables
Ensure the following environment variables are set in your `.env` file:
```text
OPENAI_API_KEY=<Your OpenAI API Key>
OPENAI_ORGANIZATION=<Your OpenAI organization id>
```
