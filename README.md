# CLP Alumni Directory

A comprehensive web application for the Cornell Leadership Program (CLP) at the University of Missouri's Trulaske College of Business. This system enables alumni networking, event management, and career tracking with AI-powered natural language search.

## Project Overview

The CLP Alumni Directory provides a centralized platform for CLP alumni to:
- Connect with fellow graduates based on location, company, and career path
- Browse and RSVP to alumni events
- Share and discover event photos
- Search the directory using natural language queries powered by LLM
- Track career progression and employment history

## Key Features

- **Alumni Profiles**: Comprehensive alumni information including employment history, education, and contact details
- **Event Management**: Create, browse, and RSVP to networking events and gatherings
- **Photo Gallery**: Upload and browse event photos with tag-based search
- **Natural Language Search**: AI-powered chat interface to query the database in plain English
- **Role-Based Access**: Separate interfaces for alumni and administrators
- **GraphQL API**: Modern, efficient API for data queries and mutations

## Technology Stack

- **Frontend**: React 18 with Material-UI
- **Backend**: Node.js + Express + Apollo Server (GraphQL)
- **Database**: MongoDB Atlas (cloud)
- **AI/LLM**: Ollama (Mistral model) + LangChain
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Local filesystem (production-ready for cloud migration)

## Architecture

```
React Frontend (Port 3000)
    ↓
GraphQL API (Port 4000) ←→ Python LLM Service (Port 5000)
    ↓                              ↓
MongoDB Atlas (Cloud)          Ollama (Mistral)
```

## Quick Start

See [instructions.md](instructions.md) for complete setup instructions.

```bash
# 1. Setup MongoDB Atlas and get connection string
# 2. Backend
cd backend
npm install
# Create .env with MongoDB URI
npm run dev

# 3. Frontend
cd frontend
npm install
# Create .env with API endpoints
npm start

# 4. LLM Service
cd llm_service
pip install -r requirements.txt
python llm_server.py

# 5. Generate sample data
cd scripts
python generate_sample_data.py
```

Access the app at http://localhost:3000

## Documentation

- **[instructions.md](instructions.md)** - Complete setup and run guide (START HERE)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design decisions
- **[SCHEMA_PROPOSAL.md](SCHEMA_PROPOSAL.md)** - Database schema documentation
- **[database_description.md](database_description.md)** - Business rules and requirements
- **[term_project_description.md](term_project_description.md)** - Project requirements and goals

## Project Structure

```
adv_db_final_project/
├── backend/              # Node.js GraphQL server
├── frontend/             # React application
├── llm_service/          # Python LLM integration
├── scripts/              # Database seeding and utilities
├── docs/                 # Additional documentation
└── instructions.md       # Setup guide
```

## Default Credentials

After running the sample data generator:
- **Admin**: Username: `admin_clp`, Password: `admin123`
- **Alumni**: Use any email from sample data, Password: `password123`

## Development

- Backend runs on port 4000 with GraphQL Playground at http://localhost:4000/graphql
- Frontend runs on port 3000 with hot reload
- LLM service runs on port 5000

## License

Academic project for Advanced Databases (CS 5600) at University of Missouri

## Author

Truman Gouldsmith