# CLP Alumni Directory - API Documentation

## GraphQL API Endpoint
**URL**: `http://localhost:4000/graphql`

**Playground**: `http://localhost:4000/graphql` (GET request in browser)

---

## Authentication

All protected queries/mutations require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Get token from `loginAlumni` or `loginAdmin` mutations.

---

## Queries

### Alumni Queries

#### getAlumni
Get all alumni in the system.

```graphql
query {
  getAlumni {
    _id
    Alumni_id
    Name
    Email
    Graduation_year
    Field_of_study
    Employer
    Employment_title
    Employer_location {
      City
      State
    }
    Employment_status
    Phone
    Address
  }
}
```

#### getAlumniById
Get single alumni by MongoDB _id.

```graphql
query {
  getAlumniById(id: "63f1234567890abcdef12345") {
    _id
    Alumni_id
    Name
    Email
    Employment_history {
      Employer
      Employment_title
      Start_date
      End_date
      Location {
        City
        State
      }
    }
  }
}
```

#### getAlumniByAlumniId
Get single alumni by custom Alumni_id.

```graphql
query {
  getAlumniByAlumniId(Alumni_id: "A1001") {
    Name
    Email
    Employer
  }
}
```

#### getAlumniByEmail
Get single alumni by email address.

```graphql
query {
  getAlumniByEmail(Email: "john.doe@example.com") {
    Name
    Alumni_id
    Employer
  }
}
```

#### getAlumniByEmployer
Get all alumni working at a specific company.

```graphql
query {
  getAlumniByEmployer(Employer: "Google") {
    Name
    Email
    Employment_title
    Employer_location {
      City
      State
    }
  }
}
```

---

### Event Queries

#### getEvents
Get all events.

```graphql
query {
  getEvents {
    _id
    Event_id
    Name
    Description
    Location
    Date
    Time
    Capacity
    Organizer_id
  }
}
```

#### getEventById
Get single event by MongoDB _id.

```graphql
query {
  getEventById(id: "63f1234567890abcdef12345") {
    Event_id
    Name
    Date
    Location
    Description
  }
}
```

#### getEventByEventId
Get single event by custom Event_id.

```graphql
query {
  getEventByEventId(Event_id: "E1001") {
    Name
    Date
    Location
  }
}
```

#### getEventsByDate
Get events on a specific date.

```graphql
query {
  getEventsByDate(Date: "2025-12-15") {
    Name
    Location
    Time
  }
}
```

---

### Reservation Queries

#### getReservations
Get all reservations.

```graphql
query {
  getReservations {
    _id
    Reservation_id
    Alumni_id
    Event_id
    Number_of_attendees
    Payment_amount
    Payment_status
  }
}
```

#### getReservationById
Get single reservation by MongoDB _id.

```graphql
query {
  getReservationById(id: "63f1234567890abcdef12345") {
    Reservation_id
    Alumni_id
    Event_id
    Payment_status
  }
}
```

#### getReservationsByAlumni
Get all reservations for a specific alumni.

```graphql
query {
  getReservationsByAlumni(Alumni_id: "A1001") {
    Reservation_id
    Event_id
    Number_of_attendees
    Payment_status
  }
}
```

#### getReservationsByEvent
Get all reservations for a specific event.

```graphql
query {
  getReservationsByEvent(Event_id: "E1001") {
    Reservation_id
    Alumni_id
    Number_of_attendees
    Payment_status
  }
}
```

---

### Photo Queries

#### getPhotos
Get all photos.

```graphql
query {
  getPhotos {
    _id
    Photo_id
    File_id
    File_name
    Alumni_id
    Event_id
    Tags
    Upload_date
  }
}
```

#### getPhotoById
Get single photo by MongoDB _id.

```graphql
query {
  getPhotoById(id: "63f1234567890abcdef12345") {
    Photo_id
    File_name
    Tags
  }
}
```

#### getPhotosByEvent
Get all photos from a specific event.

```graphql
query {
  getPhotosByEvent(Event_id: "E1001") {
    Photo_id
    File_name
    Alumni_id
    Tags
  }
}
```

#### getPhotosByAlumni
Get all photos uploaded by a specific alumni.

```graphql
query {
  getPhotosByAlumni(Alumni_id: "A1001") {
    Photo_id
    File_name
    Event_id
    Tags
  }
}
```

#### getPhotosByTags
Get photos matching specific tags.

```graphql
query {
  getPhotosByTags(Tags: ["networking", "gala"]) {
    Photo_id
    File_name
    Event_id
    Alumni_id
  }
}
```

---

### Admin Queries

#### getAdmins
Get all admins (admin-only).

```graphql
query {
  getAdmins {
    _id
    Admin_id
    Username
    Role
    Email
  }
}
```

#### getAdminById
Get single admin by MongoDB _id.

```graphql
query {
  getAdminById(id: "63f1234567890abcdef12345") {
    Username
    Role
  }
}
```

---

## Mutations

### Authentication Mutations

#### loginAlumni
Alumni login.

```graphql
mutation {
  loginAlumni(
    Email: "john.doe@example.com"
    Password: "password123"
  ) {
    token
    alumni {
      _id
      Alumni_id
      Name
      Email
    }
  }
}
```

**Returns**: JWT token and alumni data

#### loginAdmin
Admin login.

```graphql
mutation {
  loginAdmin(
    Username: "admin_clp"
    Password: "admin123"
  ) {
    token
    admin {
      _id
      Admin_id
      Username
      Role
    }
  }
}
```

**Returns**: JWT token and admin data

#### registerAlumni
Register new alumni account.

```graphql
mutation {
  registerAlumni(input: {
    Name: "Jane Smith"
    Email: "jane.smith@example.com"
    Password: "securepass123"
    Graduation_year: 2024
    Field_of_study: ["Finance", "Economics"]
  }) {
    token
    alumni {
      Alumni_id
      Name
      Email
    }
  }
}
```

**Returns**: JWT token and new alumni data

---

### Alumni Mutations

#### createAlumni
Create new alumni (admin-only).

```graphql
mutation {
  createAlumni(input: {
    Name: "John Doe"
    Email: "john.doe@example.com"
    Password: "password123"
    Graduation_year: 2023
    Field_of_study: ["Marketing"]
    Employer: "Google"
    Employment_title: "Marketing Manager"
    Employer_location: {
      City: "San Francisco"
      State: "CA"
    }
  }) {
    _id
    Alumni_id
    Name
    Email
  }
}
```

#### updateAlumni
Update alumni information.

```graphql
mutation {
  updateAlumni(
    id: "63f1234567890abcdef12345"
    input: {
      Employer: "Microsoft"
      Employment_title: "Senior Engineer"
      Employer_location: {
        City: "Seattle"
        State: "WA"
      }
    }
  ) {
    Alumni_id
    Name
    Employer
  }
}
```

#### deleteAlumni
Delete alumni (admin-only).

```graphql
mutation {
  deleteAlumni(id: "63f1234567890abcdef12345")
}
```

**Returns**: Boolean (true if deleted)

---

### Event Mutations

#### createEvent
Create new event.

```graphql
mutation {
  createEvent(input: {
    Name: "Annual Networking Gala 2025"
    Description: "Join us for networking and celebration"
    Location: "Downtown Kansas City, MO"
    Date: "2025-11-15"
    Time: "18:30"
    Capacity: 150
    Organizer_id: "A1001"
  }) {
    _id
    Event_id
    Name
    Date
  }
}
```

#### updateEvent
Update event information.

```graphql
mutation {
  updateEvent(
    id: "63f1234567890abcdef12345"
    input: {
      Capacity: 200
      Description: "Updated description"
    }
  ) {
    Event_id
    Name
    Capacity
  }
}
```

#### deleteEvent
Delete event (admin or organizer).

```graphql
mutation {
  deleteEvent(id: "63f1234567890abcdef12345")
}
```

**Returns**: Boolean (true if deleted)

---

### Reservation Mutations

#### createReservation
Create event reservation.

```graphql
mutation {
  createReservation(input: {
    Alumni_id: "A1001"
    Event_id: "E1001"
    Number_of_attendees: 2
    Payment_amount: 75.00
    Payment_status: "Paid"
    Payment_information: {
      Payment_method: "Credit Card"
      Card_type: "Visa"
      Last_four_digits: "4242"
      Transaction_id: "TXN-12345"
      Payment_date: "2025-11-01"
    }
  }) {
    _id
    Reservation_id
    Alumni_id
    Event_id
  }
}
```

#### updateReservation
Update reservation.

```graphql
mutation {
  updateReservation(
    id: "63f1234567890abcdef12345"
    input: {
      Payment_status: "Refunded"
    }
  ) {
    Reservation_id
    Payment_status
  }
}
```

#### deleteReservation
Delete reservation.

```graphql
mutation {
  deleteReservation(id: "63f1234567890abcdef12345")
}
```

**Returns**: Boolean (true if deleted)

---

### Photo Mutations

#### createPhoto
Create photo metadata (after upload via REST endpoint).

```graphql
mutation {
  createPhoto(input: {
    File_id: "63f1234567890abcdef12345"
    File_name: "gala_photo.jpg"
    File_size: 2048576
    Mime_type: "image/jpeg"
    Alumni_id: "A1001"
    Event_id: "E1001"
    Tags: ["networking", "gala", "2025"]
  }) {
    _id
    Photo_id
    File_id
  }
}
```

#### updatePhoto
Update photo metadata (tags, event association).

```graphql
mutation {
  updatePhoto(
    id: "63f1234567890abcdef12345"
    input: {
      Tags: ["networking", "gala", "2025", "columbia"]
    }
  ) {
    Photo_id
    Tags
  }
}
```

#### deletePhoto
Delete photo.

```graphql
mutation {
  deletePhoto(id: "63f1234567890abcdef12345")
}
```

**Returns**: Boolean (true if deleted)

---

### Admin Mutations

#### createAdmin
Create new admin (super admin only).

```graphql
mutation {
  createAdmin(input: {
    Username: "new_admin"
    Password: "securepass"
    Role: "Admin"
    Email: "admin@example.com"
  }) {
    _id
    Admin_id
    Username
    Role
  }
}
```

#### updateAdmin
Update admin information.

```graphql
mutation {
  updateAdmin(
    id: "63f1234567890abcdef12345"
    input: {
      Role: "Super Admin"
    }
  ) {
    Admin_id
    Username
    Role
  }
}
```

#### deleteAdmin
Delete admin.

```graphql
mutation {
  deleteAdmin(id: "63f1234567890abcdef12345")
}
```

**Returns**: Boolean (true if deleted)

---

## REST API Endpoints

### Photo Upload
**POST** `/upload-photo`

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `photo`: Image file
- `Alumni_id`: String (required)
- `Event_id`: String (optional)
- `Tags`: JSON array as string (e.g., `'["tag1", "tag2"]'`)

**Example**:
```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);
formData.append('Alumni_id', 'A1001');
formData.append('Event_id', 'E1001');
formData.append('Tags', JSON.stringify(['networking', 'gala']));

fetch('http://localhost:4000/upload-photo', {
  method: 'POST',
  body: formData
});
```

**Response**:
```json
{
  "success": true,
  "photo": {
    "Photo_id": "P1023",
    "File_id": "63f1234567890abcdef12345",
    "File_name": "photo.jpg"
  }
}
```

### Photo Retrieval
**GET** `/photo/:fileId`

**Example**: `http://localhost:4000/photo/63f1234567890abcdef12345`

**Returns**: Image file (content-type: image/jpeg, image/png, etc.)

### Photo Deletion
**DELETE** `/photo/:fileId`

**Example**: `DELETE http://localhost:4000/photo/63f1234567890abcdef12345`

**Response**:
```json
{
  "success": true
}
```

---

## LLM Service API

### Query Generation
**POST** `http://localhost:5000/api/llm/query`

**Request Body**:
```json
{
  "query": "Find all alumni working at Google"
}
```

**Response**:
```json
{
  "success": true,
  "graphql_query": "query { getAlumniByEmployer(Employer: \"Google\") { Name Email Employment_title } }",
  "original_query": "Find all alumni working at Google"
}
```

### Health Check
**GET** `http://localhost:5000/api/llm/health`

**Response**:
```json
{
  "status": "healthy",
  "service": "LLM Query Generator"
}
```

---

## Error Handling

### GraphQL Errors
```json
{
  "errors": [
    {
      "message": "Authentication required",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

### Common Error Messages
- `"Authentication required"` - Missing or invalid JWT token
- `"Admin access required"` - User is not admin
- `"Access denied"` - User doesn't own resource
- `"Alumni not found"` - Invalid alumni ID
- `"Invalid password"` - Login failed
- `"Email already registered"` - Duplicate email

---

## Rate Limiting
Currently no rate limiting implemented. Consider adding for production.

## CORS
CORS is enabled for all origins in development. Restrict in production.

