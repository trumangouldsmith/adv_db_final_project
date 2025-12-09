# CLP Alumni Directory - Complete Setup and Run Instructions

This document provides step-by-step instructions for setting up and running the CLP Alumni Directory application from scratch.

---

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Python** (3.8 or higher)
   - Download: https://www.python.org/downloads/
   - Verify: `python --version` and `pip --version`

3. **Git** (for version control)
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Ollama** (for LLM integration)
   - Download: https://ollama.ai/
   - Install Mistral model: `ollama pull mistral`
   - Verify: `ollama list` (should show mistral)

5. **MongoDB Atlas Account** (cloud database)
   - Sign up: https://www.mongodb.com/cloud/atlas/register
   - Free tier is sufficient for development

### Recommended Tools
- **VS Code** or any code editor
- **Postman** or **Insomnia** (for API testing)
- **MongoDB Compass** (GUI for MongoDB, optional)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Cluster
1. Log in to MongoDB Atlas: https://cloud.mongodb.com/
2. Click "Create" to create a new cluster
3. Choose **FREE** tier (M0 Sandbox)
4. Select a cloud provider and region (closest to your location)
5. Cluster name: `CLPAlumniCluster` (or any name)
6. Click "Create Cluster" and wait for deployment (2-5 minutes)

### Step 2: Create Database User
1. Navigate to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `clp_admin` (or your choice)
5. Password: Generate a secure password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 3: Configure Network Access
1. Navigate to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs
4. Click "Confirm"

### Step 4: Get Connection String
1. Navigate to "Database" (Databases tab)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://clp_admin:<password>@clpalumnicluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with the password you created in Step 2
7. Add database name before `?`: 
   ```
   mongodb+srv://clp_admin:yourpassword@clpalumnicluster.xxxxx.mongodb.net/clp_alumni?retryWrites=true&w=majority
   ```
8. **Save this connection string** - you'll need it later

---

## Part 2: Backend Setup (Node.js + GraphQL)

### Step 1: Navigate to Backend Directory
```bash
cd adv_db_final_project/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `apollo-server-express` - GraphQL server
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File uploads
- `dotenv` - Environment variables
- `cors` - Cross-origin requests

### Step 3: Create Environment File
Create a file named `.env` in the `backend/` directory:

```bash
# backend/.env
MONGODB_URI=mongodb+srv://clp_admin:yourpassword@clpalumnicluster.xxxxx.mongodb.net/clp_alumni?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=4000
NODE_ENV=development
UPLOAD_DIR=./uploads
```

**Important**: Replace `MONGODB_URI` with your actual connection string from Part 1, Step 4.

### Step 4: Create Upload Directory
```bash
mkdir -p uploads/photos
```

### Step 5: Test Backend Connection
```bash
npm run dev
```

You should see:
```
MongoDB Connection Successful
Server running at http://localhost:4000
GraphQL Playground available at http://localhost:4000/graphql
```

If you see "MongoDB Connection Successful", the backend is ready!

Leave this terminal running and open a new terminal for the next steps.

---

## Part 3: Seed Database with Sample Data

### Step 1: Navigate to Scripts Directory
```bash
cd adv_db_final_project/scripts
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- `pymongo` - MongoDB driver for Python
- `faker` - Generate realistic fake data
- `python-dotenv` - Environment variables

### Step 3: Run Sample Data Generator
```bash
python generate_sample_data.py
```

This script will generate:
- 50 sample alumni with realistic names, careers, and contact info
- 10 upcoming events
- 30 event reservations
- 5 sample photos
- 1 admin account (username: `admin_clp`, password: `admin123`)

You should see output:
```
Generating sample data...
✓ Created 50 alumni
✓ Created 10 events
✓ Created 30 reservations
✓ Created 5 photos
✓ Created 1 admin
Sample data generation complete!
```

### Step 4: Verify Data (Optional)
You can verify the data was created:

**Option A: MongoDB Compass**
1. Open MongoDB Compass
2. Connect using your connection string
3. Browse collections: alumni, events, reservations, photos, admins

**Option B: GraphQL Playground**
1. Open browser: http://localhost:4000/graphql
2. Run query:
   ```graphql
   query {
     getAlumni {
       Alumni_id
       Name
       Email
       Employer
     }
   }
   ```

---

## Part 4: LLM Service Setup (Python + Ollama)

### Step 1: Verify Ollama is Running
```bash
ollama serve
```

In a separate terminal, test Ollama:
```bash
ollama run mistral "Hello"
```

If it responds, Ollama is working correctly. Press `Ctrl+D` to exit.

### Step 2: Navigate to LLM Service Directory
```bash
cd adv_db_final_project/llm_service
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- `flask` - REST API server
- `flask-cors` - CORS support
- `langchain` - LLM framework
- `langchain-ollama` - Ollama integration
- `requests` - HTTP client

### Step 4: Create Environment File
Create a file named `.env` in the `llm_service/` directory:

```bash
# llm_service/.env
GRAPHQL_ENDPOINT=http://localhost:4000/graphql
OLLAMA_MODEL=mistral
PORT=5000
```

### Step 5: Start LLM Service
```bash
python llm_server.py
```

You should see:
```
LLM Service starting...
✓ Ollama connection verified
✓ Flask server running on http://localhost:5000
```

Leave this terminal running.

---

## Part 5: Frontend Setup (React)

### Step 1: Navigate to Frontend Directory
```bash
cd adv_db_final_project/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `react` - UI library
- `react-router-dom` - Routing
- `@apollo/client` - GraphQL client
- `graphql` - GraphQL core
- `@mui/material` - Material-UI components
- `@emotion/react` - Styling (for MUI)
- `axios` - HTTP client (for LLM service)

### Step 3: Create Environment File
Create a file named `.env` in the `frontend/` directory:

```bash
# frontend/.env
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
REACT_APP_LLM_SERVICE_URI=http://localhost:5000/api/llm
REACT_APP_UPLOADS_BASE_URL=http://localhost:4000/uploads
```

### Step 4: Start Frontend Development Server
```bash
npm start
```

The React app should automatically open in your browser at http://localhost:3000

---

## Part 6: Running the Complete Application

### Services Overview
You should now have **4 services running** in separate terminals:

1. **MongoDB Atlas** (cloud, always running)
2. **Backend GraphQL Server** (Terminal 1, port 4000)
   ```bash
   cd backend && npm run dev
   ```
3. **LLM Service** (Terminal 2, port 5000)
   ```bash
   cd llm_service && python llm_server.py
   ```
4. **Frontend React App** (Terminal 3, port 3000)
   ```bash
   cd frontend && npm start
   ```
5. **Ollama** (Terminal 4, background service)
   ```bash
   ollama serve
   ```

### Quick Start Script (Future Enhancement)
For convenience, you can use the provided startup script:

**Linux/Mac:**
```bash
./start_all_services.sh
```

**Windows:**
```bash
start_all_services.bat
```

---

## Part 7: Using the Application

### First Time Login

#### Admin Login
1. Navigate to http://localhost:3000/login
2. Select "Admin Login"
3. Username: `admin_clp`
4. Password: `admin123`
5. Click "Login"

You now have full admin access to manage all data.

#### Alumni Login
1. Navigate to http://localhost:3000/login
2. Select "Alumni Login"
3. Use any email from the sample data (check GraphQL playground or MongoDB)
4. Default password for sample alumni: `password123`
5. Click "Login"

### Main Features

#### 1. Dashboard
- Overview of recent events
- Total alumni count
- Quick action buttons

#### 2. Alumni Directory
- Browse all alumni
- Filter by:
  - Company
  - Location (city, state)
  - Graduation year
  - Field of study
- Click on alumni card to view detailed profile

#### 3. Alumni Profile
- View complete profile information
- See employment history timeline
- View events attended
- Contact information
- Edit own profile (if logged in as that alumni)

#### 4. Events
- Browse upcoming events
- View past events
- Filter by date, location
- Click event to see details and RSVP

#### 5. Event Detail
- Event information
- Organizer details
- RSVP form
- List of attendees
- Related photos

#### 6. Photos
- Gallery view of all photos
- Filter by:
  - Event
  - Tags
  - Alumni uploader
- Upload new photo:
  - Select file
  - Add tags (comma-separated)
  - Associate with event (optional)
  - Click "Upload"

#### 7. Chat Interface (LLM)
- Click "Chat" or "Ask AI" button
- Type natural language queries:
  - "Show me all alumni working at Google"
  - "Find alumni in New York"
  - "Who graduated in 2020?"
  - "List all upcoming events in Columbia, MO"
  - "Find photos tagged with 'networking'"
- View generated GraphQL query
- See results displayed in cards/tables

#### 8. Admin Panel (Admin Only)
- Manage all alumni
- Create/Edit/Delete events
- View all reservations
- Manage photos
- Export data
- User management

---

## Part 8: Common Tasks

### Add a New Alumni
**Method 1: GraphQL Playground**
1. Open http://localhost:4000/graphql
2. Run mutation:
   ```graphql
   mutation {
     createAlumni(input: {
       Name: "John Doe"
       Email: "john.doe@example.com"
       Password: "password123"
       Graduation_year: 2023
       Field_of_study: ["Finance"]
       Phone: "555-1234"
       Address: "123 Main St, Columbia, MO"
       Employment_status: "Full-Time"
       Employer: "Acme Corp"
       Employment_title: "Analyst"
       Employer_location: {
         City: "Kansas City"
         State: "MO"
       }
     }) {
       Alumni_id
       Name
       Email
     }
   }
   ```

**Method 2: Admin Panel (Frontend)**
1. Login as admin
2. Navigate to Admin Panel
3. Click "Add Alumni"
4. Fill out form
5. Click "Create"

### Create a New Event
**Method 1: GraphQL**
```graphql
mutation {
  createEvent(input: {
    Name: "Fall Networking Reception"
    Description: "Connect with fellow CLP alumni in the Kansas City area"
    Location: "Downtown KC, MO"
    Date: "2025-10-15"
    Time: "18:00"
    Capacity: 100
    Organizer_id: "A1001"
  }) {
    Event_id
    Name
    Date
  }
}
```

**Method 2: Frontend**
1. Login as alumni or admin
2. Navigate to Events
3. Click "Create Event"
4. Fill out form
5. Click "Create"

### RSVP to an Event
1. Browse Events page
2. Click on event card
3. Click "RSVP" button
4. Fill out:
   - Number of attendees
   - Payment information (if required)
5. Click "Submit RSVP"
6. Confirmation message appears

### Upload a Photo
1. Navigate to Photos page
2. Click "Upload Photo" button
3. Select image file (JPG, PNG, max 5MB)
4. Enter tags: `networking, fall2025, kansascity`
5. Select associated event (optional)
6. Click "Upload"
7. Photo appears in gallery

### Search Alumni (Natural Language)
1. Click "Chat" icon in navbar
2. Type: `"Find alumni working at Microsoft in Seattle"`
3. View generated GraphQL query
4. See results displayed
5. Click on alumni card to view full profile

---

## Part 9: Testing

### Test GraphQL API Directly
Open http://localhost:4000/graphql

**Test Query 1: Get All Alumni**
```graphql
query {
  getAlumni {
    Alumni_id
    Name
    Email
    Employer
    Graduation_year
  }
}
```

**Test Query 2: Get Events**
```graphql
query {
  getEvents {
    Event_id
    Name
    Date
    Location
    Capacity
  }
}
```

**Test Query 3: Search Alumni by Employer**
```graphql
query {
  getAlumniByEmployer(Employer: "Google") {
    Name
    Employment_title
    Email
  }
}
```

**Test Mutation: Create Reservation**
```graphql
mutation {
  createReservation(input: {
    Alumni_id: "A1001"
    Event_id: "E1001"
    Number_of_attendees: 1
    Payment_amount: 50.00
    Payment_status: "Paid"
    Payment_information: {
      Payment_method: "Credit Card"
      Transaction_id: "TXN-123456"
      Payment_date: "2025-12-01"
    }
  }) {
    Reservation_id
    Alumni_id
    Event_id
  }
}
```

### Test LLM Service
**Method 1: cURL**
```bash
curl -X POST http://localhost:5000/api/llm/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Find all alumni working at Google"}'
```

**Method 2: Python**
```python
import requests

response = requests.post(
    "http://localhost:5000/api/llm/query",
    json={"query": "Show me events in December 2025"}
)
print(response.json())
```

### Test Frontend
1. Open http://localhost:3000
2. Test all navigation links
3. Test login/logout
4. Test search and filters
5. Test CRUD operations
6. Test chat interface

---

## Part 10: Troubleshooting

### Issue: Backend Won't Start - MongoDB Connection Error
**Symptoms**: "MongoNetworkError" or "connection refused"

**Solutions**:
1. Verify MongoDB Atlas cluster is running (check atlas.mongodb.com)
2. Check connection string in `backend/.env`
3. Ensure IP address is whitelisted (Network Access in Atlas)
4. Verify database user credentials are correct
5. Check internet connection

### Issue: LLM Service Not Responding
**Symptoms**: "Connection refused" or timeouts

**Solutions**:
1. Verify Ollama is running: `ollama serve`
2. Check Mistral model is installed: `ollama list`
3. Test Ollama directly: `ollama run mistral "test"`
4. Verify port 5000 is not in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
5. Check `llm_service/.env` configuration

### Issue: Frontend Can't Connect to Backend
**Symptoms**: Network errors, "Failed to fetch"

**Solutions**:
1. Verify backend is running on port 4000
2. Check `frontend/.env` has correct `REACT_APP_GRAPHQL_URI`
3. Open http://localhost:4000/graphql directly to verify GraphQL is accessible
4. Check browser console for CORS errors
5. Verify CORS is enabled in backend (should be by default)

### Issue: File Upload Fails
**Symptoms**: "Upload failed" or 413 error

**Solutions**:
1. Check file size (max 5MB)
2. Verify file type is image (JPG, PNG, GIF)
3. Ensure `backend/uploads/photos/` directory exists
4. Check disk space
5. Verify multer middleware is configured correctly

### Issue: Authentication Not Working
**Symptoms**: "Invalid token" or "Unauthorized"

**Solutions**:
1. Clear browser localStorage and try logging in again
2. Verify `JWT_SECRET` is set in `backend/.env`
3. Check token expiration (default 24 hours)
4. Verify user exists in database
5. Check password is correct (case-sensitive)

### Issue: Sample Data Script Fails
**Symptoms**: Python errors, data not inserted

**Solutions**:
1. Verify MongoDB connection string in script
2. Check MongoDB Atlas Network Access whitelist
3. Ensure Python dependencies are installed: `pip list`
4. Run script with verbose output: `python generate_sample_data.py --verbose`
5. Check database exists in Atlas (should auto-create)

### Issue: Photos Not Displaying
**Symptoms**: Broken image icons

**Solutions**:
1. Verify file exists in `backend/uploads/photos/`
2. Check file path in MongoDB Photo document
3. Ensure static file serving is configured in backend
4. Verify `REACT_APP_UPLOADS_BASE_URL` in `frontend/.env`
5. Check network tab in browser dev tools for 404 errors

---

## Part 11: Stopping the Application

### Stop All Services
Press `Ctrl+C` in each terminal running a service:

1. **Backend** (Terminal 1): `Ctrl+C`
2. **LLM Service** (Terminal 2): `Ctrl+C`
3. **Frontend** (Terminal 3): `Ctrl+C`
4. **Ollama** (Terminal 4): `Ctrl+C`

### MongoDB Atlas
MongoDB Atlas runs in the cloud and doesn't need to be stopped. You can pause the cluster from the Atlas dashboard to save resources.

---

## Part 12: Development Workflow

### Making Changes to Backend
1. Edit files in `backend/` directory
2. Server auto-restarts (nodemon watches for changes)
3. Test changes in GraphQL Playground
4. Verify in frontend

### Making Changes to Frontend
1. Edit files in `frontend/src/` directory
2. React hot-reloads automatically
3. Check browser for updates
4. Fix any errors in console

### Making Changes to LLM Service
1. Edit files in `llm_service/` directory
2. Stop service (`Ctrl+C`) and restart: `python llm_server.py`
3. Test with chat interface

### Database Schema Changes
1. Update Mongoose model in `backend/models/`
2. Update GraphQL type definitions in `backend/schema/typeDefs.js`
3. Update resolvers if needed
4. Restart backend server
5. Update frontend queries/mutations if needed

---

## Part 13: Advanced Configuration

### Enable HTTPS (Production)
1. Obtain SSL certificate (Let's Encrypt)
2. Update backend to use HTTPS
3. Update all URIs in `.env` files to `https://`

### Deploy to Cloud (Future)
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **LLM Service**: Railway, DigitalOcean, AWS EC2
- **Database**: Already on MongoDB Atlas
- **File Storage**: AWS S3, Cloudinary

### Use Docker (Future)
Create Docker containers for each service for easier deployment and consistency across environments.

---

## Part 14: Contact and Support

### Documentation Resources
- GraphQL Docs: https://graphql.org/learn/
- Apollo Server: https://www.apollographql.com/docs/apollo-server/
- React Docs: https://react.dev/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Ollama: https://ollama.ai/docs

### Project Maintainer
- Truman Gouldsmith
- Course: Advanced Databases - CS 5600

---

## Quick Reference: All Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

# LLM Service
cd llm_service
pip install -r requirements.txt
python llm_server.py

# Sample Data
cd scripts
pip install -r requirements.txt
python generate_sample_data.py

# Ollama
ollama serve
ollama pull mistral
```

---

## Summary Checklist

Before running the app, ensure:

- [ ] Node.js and npm installed
- [ ] Python and pip installed
- [ ] Ollama installed and Mistral model pulled
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with credentials
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string copied and saved
- [ ] Backend `.env` file created with MongoDB URI and JWT secret
- [ ] Frontend `.env` file created with API endpoints
- [ ] LLM service `.env` file created
- [ ] All dependencies installed (backend, frontend, LLM service, scripts)
- [ ] Upload directory created (`backend/uploads/photos/`)
- [ ] Sample data generated successfully
- [ ] All 4 services running without errors
- [ ] Can access http://localhost:3000 (frontend)
- [ ] Can access http://localhost:4000/graphql (backend)
- [ ] Can login as admin or alumni

**You're ready to use the CLP Alumni Directory!**

