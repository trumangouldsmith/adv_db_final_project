# CLP Alumni Directory - System Architecture

## Technology Stack

### Backend
- **Database**: MongoDB Atlas (Cloud)
- **API Layer**: Node.js + Apollo Server (GraphQL)
- **File Storage**: GridFS (MongoDB Atlas)
- **Authentication**: JWT tokens + bcrypt password hashing

### Frontend
- **Framework**: React 18+
- **Routing**: React Router v6
- **State Management**: React Context API + hooks
- **UI Library**: Material-UI (MUI) or Tailwind CSS
- **HTTP Client**: Apollo Client (GraphQL)
- **File Upload**: Multipart form handling

### AI/LLM Integration
- **LLM**: Ollama with Mistral model (local, open-source)
- **Bridge**: Python service with LangChain
- **Communication**: REST API between frontend and Python LLM service
- **Query Translation**: Natural language → GraphQL queries

### Development Tools
- **Package Management**: npm (Node.js), pip (Python)
- **Environment Variables**: dotenv
- **Code Quality**: ESLint, Prettier
- **API Testing**: GraphQL Playground / Apollo Studio

---

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Dashboard   │  │  Alumni      │  │  LLM Chat Interface  │  │
│  │              │  │  Directory   │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Events      │  │  Photos      │  │  Admin Panel         │  │
│  │              │  │  Gallery     │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────┬─────────────────────────────┬──────────────┘
                    │                             │
                    │ GraphQL (Apollo Client)     │ REST API
                    │                             │
      ┌─────────────▼──────────────┐      ┌────────▼──────────┐
      │   GraphQL Server (Apollo)  │      │  Python LLM       │
      │   - Type Definitions       │      │  Service          │
      │   - Resolvers              │      │  (LangChain +     │
      │   - Authentication         │      │   Ollama/Mistral) │
      │   - File Upload Handling   │      │                   │
      └────────────┬───────────────┘      └────────┬──────────┘
                   │                               │
                   │                               │
                   │ Mongoose ODM                  │ Generates
                   │                               │ GraphQL queries
                   │                               │
           ┌───────▼───────────────────────────────▼──────────┐
           │         MongoDB Atlas (Cloud Database)            │
           │  Collections: Alumni, Events, Reservations,       │
           │               Photos, Admins                      │
           │  GridFS: Photo file storage                       │
           └───────────────────────────────────────────────────┘
```

---

## Project Structure

```
adv_db_final_project/
│
├── backend/                          # Node.js GraphQL Server
│   ├── server.js                     # Express + Apollo Server entry point
│   ├── config/
│   │   └── db.js                     # MongoDB connection configuration
│   ├── models/                       # Mongoose models
│   │   ├── Alumni.js
│   │   ├── Event.js
│   │   ├── Reservation.js
│   │   ├── Photo.js
│   │   └── Admin.js
│   ├── schema/                       # GraphQL schema
│   │   ├── typeDefs.js               # GraphQL type definitions
│   │   └── resolvers.js              # GraphQL resolvers
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication middleware
│   │   └── gridfs.js                 # GridFS file upload/retrieval
│   ├── utils/
│   │   ├── generateId.js             # Custom ID generation
│   │   ├── validators.js             # Input validation helpers
│   │   └── counter.js                # Auto-increment counter system
│   ├── package.json
│   └── .env                          # Environment variables
│
├── frontend/                         # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js                  # React entry point
│   │   ├── App.js                    # Main App component
│   │   ├── apollo/
│   │   │   └── client.js             # Apollo Client configuration
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── AlumniCard.js
│   │   │   ├── EventCard.js
│   │   │   ├── PhotoGallery.js
│   │   │   ├── ChatInterface.js      # LLM chat component
│   │   │   └── ProtectedRoute.js     # Auth route wrapper
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── AlumniDirectory.js
│   │   │   ├── AlumniProfile.js
│   │   │   ├── Events.js
│   │   │   ├── EventDetail.js
│   │   │   ├── Photos.js
│   │   │   ├── Login.js
│   │   │   └── AdminPanel.js
│   │   ├── context/
│   │   │   └── AuthContext.js        # Authentication context
│   │   ├── graphql/                  # GraphQL queries/mutations
│   │   │   ├── queries.js
│   │   │   └── mutations.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── styles/
│   │       └── App.css
│   ├── package.json
│   └── .env                          # Frontend environment variables
│
├── llm_service/                      # Python LLM Service
│   ├── llm_server.py                 # Flask REST API server
│   ├── query_generator.py            # LangChain + Ollama integration
│   ├── prompts/
│   │   └── system_prompt.py          # LLM prompt templates
│   ├── requirements.txt
│   └── .env
│
├── scripts/                          # Utility scripts
│   ├── generate_sample_data.py       # Generate sample database data
│   └── seed_database.py              # Seed MongoDB with sample data
│
├── docs/                             # Documentation
│   ├── API_DOCUMENTATION.md          # GraphQL API docs
│   └── USER_GUIDE.md                 # End-user documentation
│
├── instructions.md                   # Step-by-step setup guide
├── README.md                         # Project overview
├── SCHEMA_PROPOSAL.md                # Database schema
├── ARCHITECTURE.md                   # This file
├── database_description.md           # Database business rules
└── term_project_description.md       # Project requirements
```

---

## Component Responsibilities

### Backend (Node.js + Apollo Server)

#### GraphQL Type Definitions (`schema/typeDefs.js`)
- Define GraphQL types for Alumni, Event, Reservation, Photo, Admin
- Define input types for create/update operations
- Define Query and Mutation types

#### GraphQL Resolvers (`schema/resolvers.js`)
- **Queries**: Fetch data from MongoDB
  - `getAlumni`, `getAlumniById`, `getAlumniByEmail`
  - `getEvents`, `getEventById`, `getEventsByDate`
  - `getReservations`, `getReservationsByAlumni`, `getReservationsByEvent`
  - `getPhotos`, `getPhotosByEvent`, `getPhotosByTags`
  - Admin queries
- **Mutations**: Modify data in MongoDB
  - Alumni CRUD
  - Event CRUD
  - Reservation CRUD
  - Photo CRUD (with file upload)
  - Admin CRUD
  - Authentication (login, register)

#### Mongoose Models (`models/`)
- Define MongoDB schemas with validation
- Create indexes for performance
- Handle data relationships

#### Authentication Middleware (`middleware/auth.js`)
- Verify JWT tokens
- Protect GraphQL resolvers
- Role-based access control (admin vs alumni)

#### GridFS Middleware (`middleware/gridfs.js`)
- Handle multipart/form-data for photo uploads
- Validate file types (images only: jpg, png, gif)
- Store files in MongoDB using GridFS
- Generate unique filenames and File_id references
- Retrieve photos via GridFS streams

---

### Frontend (React)

#### Authentication Context (`context/AuthContext.js`)
- Store logged-in user information
- Provide login/logout functions
- Persist auth state (localStorage + JWT)

#### Apollo Client Configuration (`apollo/client.js`)
- Configure GraphQL endpoint
- Add authentication headers (JWT)
- Error handling and retry logic

#### Pages
- **Dashboard**: Overview of recent events, alumni count, quick actions
- **Alumni Directory**: Searchable/filterable list of all alumni
- **Alumni Profile**: Detailed view of individual alumni with career history
- **Events**: Browse upcoming and past events
- **Event Detail**: Event information with RSVP functionality
- **Photos**: Gallery view with filtering by tags/events
- **Login**: Authentication page for alumni and admins
- **Admin Panel**: Admin-only interface for data management

#### Chat Interface (`components/ChatInterface.js`)
- Natural language input field
- Send queries to Python LLM service via REST API
- Display generated GraphQL query
- Execute GraphQL query via Apollo Client
- Display results in user-friendly format

#### Protected Routes (`components/ProtectedRoute.js`)
- Check authentication status
- Redirect to login if not authenticated
- Role-based route protection (admin routes)

---

### LLM Service (Python + Flask)

#### Flask REST API (`llm_server.py`)
- Endpoint: `POST /api/llm/query`
- Accept natural language query from frontend
- Call LangChain + Ollama to generate GraphQL
- Return GraphQL query string to frontend

#### Query Generator (`query_generator.py`)
- Initialize Ollama with Mistral model
- Define prompt template with schema context
- Parse natural language input
- Generate valid GraphQL query
- Handle errors and edge cases

#### Prompt Engineering (`prompts/system_prompt.py`)
- System prompt with full GraphQL schema
- Example queries for few-shot learning
- Instructions for handling CRUD operations
- Formatting guidelines for output

---

## Data Flow Examples

### Example 1: Alumni Searches for Other Alumni by Company

1. User types in chat: "Find all alumni working at Google"
2. Frontend sends POST request to `http://localhost:5000/api/llm/query`
3. Python LLM service uses LangChain + Ollama to generate:
   ```graphql
   query {
     getAlumni(filter: { employer: "Google" }) {
       Alumni_id
       Name
       Employment_title
       Employer_location {
         City
         State
       }
       Email
     }
   }
   ```
4. Frontend receives GraphQL query, displays it to user
5. Frontend executes query via Apollo Client to GraphQL server
6. Backend resolver queries MongoDB for alumni with `Employer: "Google"`
7. Results returned to frontend and displayed as alumni cards

### Example 2: Alumni Creates Event Reservation

1. User browses Events page, clicks "RSVP" on an event
2. User fills out RSVP form (number of attendees, payment info)
3. Frontend calls GraphQL mutation:
   ```graphql
   mutation {
     createReservation(input: {
       Alumni_id: "A1001"
       Event_id: "E1001"
       Number_of_attendees: 2
       Payment_amount: 75.00
       Payment_status: "Paid"
       Payment_information: { ... }
     }) {
       Reservation_id
       Alumni_id
       Event_id
     }
   }
   ```
4. Backend resolver creates Reservation document in MongoDB
5. Success response returned to frontend
6. Frontend displays confirmation message

### Example 3: Alumni Uploads Event Photo

1. User navigates to Photos page, clicks "Upload Photo"
2. User selects image file, enters tags, selects associated event
3. Frontend sends multipart form data to GraphQL mutation with file upload
4. Backend GridFS middleware stores file in MongoDB GridFS
5. Backend creates Photo document in MongoDB with File_id reference and metadata
6. Photo_id returned to frontend
7. Photo appears in gallery (retrieved via GridFS stream)

---

## Authentication Flow

### Alumni Login
1. User enters email and password on Login page
2. Frontend sends GraphQL mutation:
   ```graphql
   mutation {
     loginAlumni(email: "user@example.com", password: "password123") {
       token
       alumni {
         Alumni_id
         Name
         Email
       }
     }
   }
   ```
3. Backend verifies email/password against Alumni collection
4. Backend generates JWT token with alumni ID and role
5. Frontend stores token in localStorage
6. Frontend redirects to Dashboard

### Admin Login
1. Admin enters username and password
2. Similar flow as alumni, but queries Admin collection
3. JWT token includes admin role
4. Admin-specific routes become accessible

### Protected Requests
1. Frontend includes JWT token in Apollo Client headers
2. Backend middleware verifies token on each request
3. Resolver functions check user role for authorization
4. Unauthorized requests return error

---

## File Upload Strategy

### GridFS Implementation (MongoDB Atlas)
- Files stored directly in MongoDB using GridFS
- GridFS splits large files into chunks (255KB default)
- Photo metadata stored in Photos collection
- File_id (ObjectId) links metadata to GridFS file
- Files retrieved via GridFS streams
- Max file size: 16MB per file (MongoDB document limit)
- Benefits:
  - Single database for all data
  - No separate file storage infrastructure
  - Automatic replication and backup
  - Works seamlessly with MongoDB Atlas
  - No local file system dependency

---

## Environment Variables

### Backend (`.env`)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clp_alumni?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=4000
NODE_ENV=development
MAX_FILE_SIZE=16777216
```

### Frontend (`.env`)
```
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
REACT_APP_LLM_SERVICE_URI=http://localhost:5000/api/llm
```

### LLM Service (`.env`)
```
GRAPHQL_ENDPOINT=http://localhost:4000/graphql
OLLAMA_MODEL=mistral
PORT=5000
```

---

## API Endpoints Summary

### GraphQL Server (Port 4000)
- `POST /graphql` - Main GraphQL endpoint
- `GET /graphql` - GraphQL Playground (development)
- `GET /photo/:photo_id` - Retrieve photo via GridFS stream

### LLM Service (Port 5000)
- `POST /api/llm/query` - Natural language to GraphQL translation
- `GET /api/llm/health` - Service health check

---

## Deployment Strategy (Local)

### Development Mode
1. MongoDB Atlas database (cloud)
2. Backend server: `npm run dev` (port 4000)
3. Frontend server: `npm start` (port 3000)
4. LLM service: `python llm_server.py` (port 5000)
5. Ollama: `ollama serve` (background)

### Production-Ready Considerations
- Environment-specific configurations
- Error logging (Winston, Morgan)
- Rate limiting and security (helmet, cors)
- Database connection pooling
- Graceful shutdown handling
- Docker containerization (future)

---

## Security Considerations

### Authentication
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with expiration (24 hours)
- HTTP-only cookies for token storage (optional)

### Authorization
- Role-based access control (RBAC)
- Alumni can only update own profile
- Admins have full CRUD access
- Event organizers can manage own events

### Input Validation
- GraphQL input types enforce schema
- Backend validators for business rules
- File upload restrictions (type: jpg/png/gif, size: max 16MB)
- NoSQL injection prevention (Mongoose ODM)

### Data Privacy
- Sensitive payment info encrypted
- Email addresses not publicly exposed
- Optional privacy settings per alumni

---

## Testing Strategy

### Backend Testing
- Unit tests for resolvers (Jest)
- Integration tests for GraphQL API
- MongoDB in-memory server for tests

### Frontend Testing
- Component tests (React Testing Library)
- Integration tests with Mock Service Worker
- E2E tests (Cypress - optional)

### LLM Service Testing
- Test prompt generation accuracy
- Validate GraphQL query syntax
- Error handling tests

---

## Performance Optimizations

### Database
- Indexes on frequently queried fields
- Compound indexes for multi-field queries
- Limit query result sizes

### GraphQL
- DataLoader for batching and caching
- Query complexity limits
- Pagination for large result sets

### Frontend
- React lazy loading for routes
- Image optimization and lazy loading
- Apollo Client caching
- Debounced search inputs

### File Uploads
- File size limits (16MB per photo via GridFS)
- Image compression before upload (optional)
- GridFS chunk size optimization (255KB chunks)

---

This architecture provides a solid foundation for a production-ready alumni directory system with modern web technologies and AI-powered search capabilities.

