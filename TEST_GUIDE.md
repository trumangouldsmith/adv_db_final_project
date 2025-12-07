# CLP Alumni Directory - Testing Guide

## Prerequisites
- All services running (backend, frontend, LLM service, Ollama)
- Sample data generated

## Test 1: Backend GraphQL API

### 1.1 Open GraphQL Playground
Navigate to: http://localhost:4000/graphql

### 1.2 Test Query - Get All Alumni
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

Expected: List of 50 alumni

### 1.3 Test Query - Get Alumni by Employer
```graphql
query {
  getAlumniByEmployer(Employer: "Google") {
    Name
    Email
    Employment_title
  }
}
```

Expected: Alumni working at Google

### 1.4 Test Mutation - Login Alumni
```graphql
mutation {
  loginAlumni(
    Email: "test@example.com"
    Password: "password123"
  ) {
    token
    alumni {
      Name
      Email
    }
  }
}
```

Expected: JWT token and alumni data (use any email from generated data)

### 1.5 Test Mutation - Login Admin
```graphql
mutation {
  loginAdmin(
    Username: "admin_clp"
    Password: "admin123"
  ) {
    token
    admin {
      Username
      Role
    }
  }
}
```

Expected: JWT token and admin data

---

## Test 2: Frontend Authentication

### 2.1 Navigate to Frontend
Open: http://localhost:3000

### 2.2 Test Alumni Login
1. Click "Alumni Login" tab
2. Email: Use any from sample data (check GraphQL query)
3. Password: `password123`
4. Click "Login as Alumni"

Expected: Redirect to Dashboard

### 2.3 Test Admin Login
1. Logout
2. Navigate to /login
3. Click "Admin Login" tab
4. Username: `admin_clp`
5. Password: `admin123`
6. Click "Login as Admin"

Expected: Redirect to Dashboard, "Admin" button visible in navbar

---

## Test 3: Alumni Directory

### 3.1 Browse Alumni
1. Click "Alumni" in navbar
2. Verify all alumni cards display

Expected: 50 alumni cards with names, employers, graduation years

### 3.2 Search Alumni
1. Type "Google" in search box
2. Verify filtering works

Expected: Only Google employees shown

### 3.3 View Alumni Profile
1. Click "View Profile" on any alumni card
2. Verify profile details display
3. Check employment history section

Expected: Full profile with personal info, current employment, employment history

---

## Test 4: Events

### 4.1 View Events List
1. Click "Events" in navbar
2. Verify upcoming and past events sections

Expected: Events separated into upcoming/past

### 4.2 View Event Detail
1. Click "View Details" on any event
2. Verify event information displays
3. Check capacity counter

Expected: Event details with date, location, description, capacity

### 4.3 Create RSVP
1. On event detail page, click "RSVP"
2. Enter number of attendees
3. Click "Confirm RSVP"

Expected: Success message, reservation created

---

## Test 5: Photos

### 5.1 View Photos
1. Click "Photos" in navbar
2. Verify photo gallery displays

Expected: Grid of photos with tags and upload dates

### 5.2 Upload Photo (Note: Requires actual file)
1. Click "Upload Photo"
2. Select image file
3. Enter tags: `test, networking, 2025`
4. Optional: Enter Event ID
5. Click "Upload"

Expected: Success message, photo appears in gallery

**Note**: Photo upload requires backend GridFS to be working. If GridFS issues occur, this test may fail.

---

## Test 6: Admin Panel

### 6.1 Access Admin Panel
1. Login as admin
2. Click "Admin" in navbar

Expected: Admin panel with tabs

### 6.2 View Data Tables
1. Click through each tab: Alumni, Events, Reservations, Photos, Admins
2. Verify data displays in tables

Expected: All data shown in respective tabs

### 6.3 Delete Operation
1. Go to Reservations tab
2. Click delete icon on any reservation
3. Confirm deletion

Expected: Reservation removed from table

---

## Test 7: LLM Chat Interface

### 7.1 Access Chat
1. Navigate to Dashboard
2. Scroll to "AI Assistant" section

Expected: Chat interface displayed

### 7.2 Test Natural Language Query
Enter: `Find all alumni working at Microsoft`

Expected:
1. User message displayed
2. Generated GraphQL query shown
3. Results displayed as JSON

### 7.3 Test Event Query
Enter: `Show me upcoming events`

Expected:
1. GraphQL query generated
2. List of upcoming events returned

### 7.4 Test Complex Query
Enter: `Get all photos from networking events`

Expected:
1. GraphQL query using tags filter
2. Photos with "networking" tag returned

---

## Test 8: LLM Service (Direct)

### 8.1 Test Health Endpoint
```bash
curl http://localhost:5000/api/llm/health
```

Expected: `{"status": "healthy", "service": "LLM Query Generator"}`

### 8.2 Test Query Generation
```bash
curl -X POST http://localhost:5000/api/llm/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Find alumni graduated in 2024"}'
```

Expected: JSON with `graphql_query` field containing valid GraphQL

---

## Test 9: Integration Testing

### 9.1 Full Workflow - Alumni
1. Login as alumni
2. Browse alumni directory
3. View another alumni's profile
4. Browse events
5. RSVP to an event
6. Upload a photo
7. Use chat to search for alumni
8. Logout

Expected: All features work seamlessly

### 9.2 Full Workflow - Admin
1. Login as admin
2. View dashboard stats
3. Go to admin panel
4. View all data tables
5. Delete a test reservation
6. Use chat to query data
7. Logout

Expected: Admin has full access to all features

---

## Common Issues and Solutions

### Issue: Backend not connecting to MongoDB
Solution: Check MongoDB Atlas connection string in backend/.env

### Issue: LLM service not responding
Solution: Verify Ollama is running (`ollama serve`)

### Issue: Photos not displaying
Solution: Check GridFS implementation, verify File_id references

### Issue: GraphQL queries fail
Solution: Check backend console for errors, verify JWT token in headers

### Issue: Chat returns errors
Solution: 
1. Check LLM service is running on port 5000
2. Verify Ollama has Mistral model (`ollama list`)
3. Check backend GraphQL endpoint is accessible

---

## Performance Tests

### Test 10.1: Large Query
Query all alumni with full employment history:
```graphql
query {
  getAlumni {
    _id
    Name
    Employment_history {
      Employer
      Employment_title
      Start_date
      End_date
    }
  }
}
```

Expected: Response time < 2 seconds

### Test 10.2: Multiple Concurrent Users
1. Open 3 browser windows
2. Login different alumni in each
3. Perform actions simultaneously

Expected: No errors, all requests succeed

---

## Test Results Checklist

- [ ] Backend GraphQL queries work
- [ ] Backend mutations work
- [ ] Authentication (alumni and admin) works
- [ ] Alumni directory displays and filters
- [ ] Alumni profiles display correctly
- [ ] Events list and detail pages work
- [ ] RSVP functionality works
- [ ] Photos display in gallery
- [ ] Photo upload works
- [ ] Admin panel displays all data
- [ ] Admin delete operations work
- [ ] LLM chat generates queries
- [ ] LLM chat executes queries
- [ ] LLM chat displays results
- [ ] All navigation links work
- [ ] Protected routes enforce authentication
- [ ] Admin-only routes enforce admin role
- [ ] Logout functionality works
- [ ] No console errors in browser
- [ ] No errors in backend logs

---

## Automated Test Script (Optional)

Create `test_all.py`:
```python
import requests
import json

GRAPHQL_URL = "http://localhost:4000/graphql"
LLM_URL = "http://localhost:5000/api/llm/query"

def test_graphql_query():
    query = """
    query {
      getAlumni {
        Name
      }
    }
    """
    response = requests.post(GRAPHQL_URL, json={"query": query})
    assert response.status_code == 200
    assert "data" in response.json()
    print("GraphQL query test: PASSED")

def test_llm_service():
    response = requests.post(LLM_URL, json={"query": "Find all alumni"})
    assert response.status_code == 200
    assert "graphql_query" in response.json()
    print("LLM service test: PASSED")

if __name__ == "__main__":
    test_graphql_query()
    test_llm_service()
    print("All tests passed!")
```

Run: `python test_all.py`

