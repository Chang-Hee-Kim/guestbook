# Full Stack Guestbook Application

This project contains a full-stack guestbook application with two frontend implementations (traditional server-rendered and React) and a Flask backend. It's designed to be deployed on Railway.

## Project Structure

- `/backend`: Flask backend application.
- `/frontend-react`: React frontend application.
- `/templates`: HTML templates for the traditional frontend.
- `/static`: CSS files for the traditional frontend.

## Local Development

### 1. Backend Setup

First, set up and run the Flask backend.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add your PostgreSQL database URL
# You can get this from the Railway dashboard after creating a Postgres service.
# For local testing, you can leave the default SQLite setting in app.py.
# Example .env content: DATABASE_URL="postgresql://user:pass@host:port/db"

# Initialize the database
# This creates the necessary tables based on the models.
flask --app app init-db

# Run the Flask development server
# It will run on http://127.0.0.1:5001
flask --app app run
```

### 2. Traditional Frontend

The traditional frontend is served directly by the Flask backend. Once the backend is running, you can access it by navigating to `http://127.0.0.1:5001` in your browser.

### 3. React Frontend

In a separate terminal, set up and run the React frontend.

```bash
# Navigate to the React frontend directory
cd frontend-react

# Install dependencies (if you haven't already)
npm install

# Run the React development server
# It will run on http://localhost:5173 (or another port if 5173 is busy)
npm run dev
```
Now you can access the React version of the guestbook at the address provided by the `npm run dev` command.

## Deployment to Railway

This project is configured for easy deployment on Railway.

1.  **Create a GitHub Repository:** Push the entire project to a new GitHub repository.
2.  **Create a Railway Project:** Link your GitHub repository to a new project on Railway.
3.  **Add a PostgreSQL Database:** In your Railway project dashboard, add a PostgreSQL database service. Railway will automatically provide the `DATABASE_URL` environment variable to your application, so you don't need to set it manually.
4.  **Deploy:** Railway will use the `railway.toml` file to automatically build and deploy your application. The `startCommand` in the file tells Railway how to run the production server.

That's it! Railway will handle the rest.
