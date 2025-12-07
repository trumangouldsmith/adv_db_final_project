# CLP Alumni Directory - Complete Setup Guide

## Prerequisites

1. Node.js v18+ installed
2. Python 3.8+ installed
3. Ollama installed with Mistral model (`ollama pull mistral`)
4. MongoDB Atlas cluster created with connection string

---

## Step 1: Backend Setup

### 1.1 Navigate to backend
```bash
cd adv_db_final_project/backend
```

### 1.2 Create .env file
Create a file named `.env` in the backend directory with:

```
MONGODB_URI=mongodb+srv://clp_admin:clpdbadmin123@clpalumnicluster.3lm7phl.mongodb.net/clp_alumni?retryWrites=true&w=majority&appName=CLPAlumniCluster
JWT_SECRET=clp_jwt_secret_key_change_in_production_2024
PORT=4000
NODE_ENV=development
MAX_FILE_SIZE=16777216
```

### 1.3 Install dependencies
```bash
npm install
```

### 1.4 Start backend server
```bash
npm run dev
```

Backend runs on http://localhost:4000/graphql

---

## Step 2: Frontend Setup

### 2.1 Navigate to frontend
```bash
cd adv_db_final_project/frontend
```

### 2.2 Create .env file
Create a file named `.env` in the frontend directory with:

```
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
REACT_APP_LLM_SERVICE_URI=http://localhost:5000/api/llm
REACT_APP_PHOTO_URI=http://localhost:4000/photo
REACT_APP_UPLOAD_URI=http://localhost:4000/upload-photo
```

### 2.3 Install dependencies
```bash
npm install
```

### 2.4 Start frontend server
```bash
npm start
```

Frontend runs on http://localhost:3000

---

## Step 3: LLM Service Setup

### 3.1 Navigate to llm_service
```bash
cd adv_db_final_project/llm_service
```

### 3.2 Create .env file
Create a file named `.env` in the llm_service directory with:

```
GRAPHQL_ENDPOINT=http://localhost:4000/graphql
OLLAMA_MODEL=mistral
PORT=5000
```

### 3.3 Install dependencies
```bash
pip install -r requirements.txt
```

### 3.4 Start LLM service
```bash
python llm_server.py
```

LLM service runs on http://localhost:5000

---

## Step 4: Generate Sample Data

### 4.1 Navigate to scripts
```bash
cd adv_db_final_project/scripts
```

### 4.2 Install dependencies
```bash
pip install -r requirements.txt
```

### 4.3 Run sample data generator
```bash
python generate_sample_data.py
```

---

## Step 5: Verify Everything Works

### 5.1 Services Running
You should have 4 terminals running:
1. Backend (port 4000)
2. Frontend (port 3000)
3. LLM Service (port 5000)
4. Ollama (`ollama serve`)

### 5.2 Test Login
1. Open http://localhost:3000
2. Click "Admin Login" tab
3. Username: `admin_clp`
4. Password: `admin123`

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in backend/.env
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Frontend won't compile
- Delete node_modules and package-lock.json
- Run `npm install` again

### LLM service errors
- Verify Ollama is running: `ollama serve`
- Check Mistral model installed: `ollama list`

### Sample data script fails
- Check MongoDB connection string matches backend
- Ensure backend is running first

---

## Default Credentials

After running sample data generator:
- **Admin**: Username `admin_clp`, Password `admin123`
- **Alumni**: Any email from generated data, Password `password123`

