# HR Employee Attrition Prediction System

A full-stack web application designed for HR to predict employee attrition using a modern dashboard UI, a Node.js backend, and a Python Machine Learning service.

## Project Structure

*   **/frontend**: React.js (Vite) frontend with Tailwind CSS and Recharts.
*   **/backend**: Node.js/Express API with robust REST endpoints and JWT authentication.
*   **/ml_service**: Python/FastAPI microservice running a Keras Neural Network.
*   **/database**: SQL schema for Supabase table creation.

## Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Supabase Account

## Setup Instructions

### 1. Database Setup (Supabase)
1.  Create a new project on [Supabase](https://supabase.com).
2.  Go to the SQL Editor and run the script found in `database/schema.sql` to create the `users` and `prediction_history` tables.
3.  Copy your `Project URL` and `anon public` API key from Project Settings > API.

### 2. Backend Setup
1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies (if not already done): `npm install`
3.  Open `backend/.env` and replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase credentials.
4.  Start the backend server: `node index.js` (Runs on port 5000)

### 3. Machine Learning Service Setup
1.  Navigate to the ML service directory: `cd ml_service`
2.  Activate the virtual environment: `.\venv\Scripts\activate` (Windows)
3.  Ensure the Neural Network is trained (already done if `attrition_model.h5` exists, otherwise run `python train.py`).
4.  Start the FastAPI application: `uvicorn app:app --host 127.0.0.1 --port 8000 --reload`

### 4. Frontend Setup
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies (if not already done): `npm install`
3.  Start the development server: `npm run dev`
4.  Open your browser to the URL provided (typically `http://localhost:5173`).

## Usage
*   Create an account on the Signup page.
*   Navigate to the **Predict Attrition** page to fill out employee details.
*   View Analytics, Feature Importances, and History across the diverse dashboard pages.
