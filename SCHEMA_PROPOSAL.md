# Database Schema Proposal

This document outlines the complete MongoDB schema for the CLP Alumni Directory, including all collections, fields, data types, and relationships.

## Collection: Alumni

### Purpose
Stores comprehensive information about CLP alumni including personal details, employment history, and event participation.

### Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  Alumni_id: String,                // Custom alumni identifier (e.g., "A1001")
  Name: String,                     // Full name (required)
  Graduation_year: Number,          // Year graduated (required)
  Field_of_study: [String],         // Array of majors/concentrations
  Address: String,                  // Current residential address
  Phone: String,                    // Contact phone number
  Email: String,                    // Email address (required, unique)
  Password: String,                 // Hashed password (bcrypt, required)
  Employment_status: String,        // "Full-Time", "Part-Time", "Unemployed", "Student", etc.
  Employer: String,                 // Current employer name
  Employer_location: {              // Current employer location (embedded object)
    City: String,
    State: String
  },
  Employment_title: String,         // Current job title
  Employment_history: [             // Array of previous positions (embedded)
    {
      Employer: String,
      Employment_title: String,
      Start_date: Date,             // ISO date string
      End_date: Date,               // ISO date string
      Location: {                   // Job location (embedded object)
        City: String,
        State: String
      }
    }
  ],
  Events_history: [String],         // Array of Event_id references
  Created_at: Date,                 // Timestamp of record creation
  Updated_at: Date                  // Timestamp of last update
}
```

### Indexes
- `Email`: Unique index for authentication
- `Alumni_id`: Unique index for custom ID lookups
- `Employer`: Index for company searches
- `Graduation_year`: Index for year-based queries

---

## Collection: Events

### Purpose
Stores information about CLP events including networking galas, receptions, and other alumni gatherings.

### Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  Event_id: String,                 // Custom event identifier (e.g., "E1001")
  Name: String,                     // Event name (required)
  Description: String,              // Detailed event description
  Location: String,                 // Physical location/address
  Date: Date,                       // Event date (ISO date)
  Time: String,                     // Event time (e.g., "18:30")
  Capacity: Number,                 // Maximum attendees
  Organizer_id: String,             // Reference to Alumni.Alumni_id (event creator)
  Created_at: Date,                 // Timestamp of creation
  Updated_at: Date                  // Timestamp of last update
}
```

### Indexes
- `Event_id`: Unique index
- `Date`: Index for chronological queries
- `Organizer_id`: Index for organizer lookups

---

## Collection: Reservations

### Purpose
Tracks alumni RSVPs and attendance for events, including payment information.

### Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  Reservation_id: String,           // Custom reservation identifier (e.g., "R1001")
  Alumni_id: String,                // Reference to Alumni.Alumni_id (required)
  Event_id: String,                 // Reference to Events.Event_id (required)
  Number_of_attendees: Number,      // Number of people attending (default: 1)
  Payment_amount: Number,           // Payment amount in USD
  Payment_status: String,           // "Paid", "Pending", "Refunded", "Cancelled"
  Payment_information: {            // Payment details (embedded object)
    Payment_method: String,         // "Credit Card", "Cash", "Check", etc.
    Card_type: String,              // "Visa", "Mastercard", etc. (optional)
    Last_four_digits: String,       // Last 4 digits of card (optional)
    Transaction_id: String,         // Payment transaction ID
    Payment_date: Date              // Date payment was made
  },
  Created_at: Date,                 // Timestamp of reservation creation
  Updated_at: Date                  // Timestamp of last update
}
```

### Indexes
- `Reservation_id`: Unique index
- `Alumni_id`: Index for alumni lookup
- `Event_id`: Index for event lookup
- Compound index on `(Alumni_id, Event_id)`: Ensure unique reservation per alumni per event

---

## Collection: Photos

### Purpose
Stores photo metadata and file references for event photos and general alumni photos.

### Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  Photo_id: String,                 // Custom photo identifier (e.g., "P1001")
  File_id: ObjectId,                // GridFS file reference
  File_name: String,                // Original filename
  File_size: Number,                // File size in bytes
  Mime_type: String,                // MIME type (e.g., "image/jpeg")
  Alumni_id: String,                // Reference to Alumni.Alumni_id (uploader/owner, required)
  Event_id: String,                 // Reference to Events.Event_id (optional, null if not event-related)
  Tags: [String],                   // Array of descriptive keywords for searching
  Upload_date: Date,                // Date photo was uploaded
  Created_at: Date,                 // Timestamp of record creation
  Updated_at: Date                  // Timestamp of last update
}
```

### Indexes
- `Photo_id`: Unique index
- `Alumni_id`: Index for owner lookup
- `Event_id`: Index for event photos
- `Tags`: Index for tag-based searches

---

## Collection: Admins

### Purpose
Stores administrator credentials and permissions for system management.

### Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  Admin_id: String,                 // Custom admin identifier (e.g., "AD1001")
  Username: String,                 // Admin username (required, unique)
  Password: String,                 // Hashed password (bcrypt, required)
  Role: String,                     // "Super Admin", "Admin", "Moderator"
  Email: String,                    // Admin email (optional)
  Created_at: Date,                 // Timestamp of account creation
  Updated_at: Date,                 // Timestamp of last update
  Last_login: Date                  // Timestamp of last login
}
```

### Indexes
- `Admin_id`: Unique index
- `Username`: Unique index for login

---

## Relationships

### Alumni ↔ Events (Many-to-Many)
- **Organizer Relationship**: `Events.Organizer_id` → `Alumni.Alumni_id`
- **Attendance Relationship**: `Alumni.Events_history` array contains `Event_id` strings

### Alumni ↔ Reservations (One-to-Many)
- `Reservations.Alumni_id` → `Alumni.Alumni_id`
- One alumni can have multiple reservations

### Events ↔ Reservations (One-to-Many)
- `Reservations.Event_id` → `Events.Event_id`
- One event can have multiple reservations

### Alumni ↔ Photos (One-to-Many)
- `Photos.Alumni_id` → `Alumni.Alumni_id` (owner/uploader)
- One alumni can upload multiple photos

### Events ↔ Photos (One-to-Many, Optional)
- `Photos.Event_id` → `Events.Event_id` (optional)
- Photos may or may not be associated with an event

---

## Authentication Schema Notes

### Alumni Authentication
- Alumni authenticate using `Email` and `Password`
- Password hashed using bcrypt before storage

### Admin Authentication
- Admins authenticate using `Username` and `Password`
- Passwords stored as bcrypt hashes
- Role-based permissions: Super Admin > Admin > Moderator

---

## Data Validation Rules

### Required Fields
- **Alumni**: Name, Email, Password, Graduation_year
- **Events**: Name, Date, Organizer_id
- **Reservations**: Alumni_id, Event_id
- **Photos**: File_path, Alumni_id
- **Admins**: Username, Password, Role

### Unique Constraints
- Alumni.Email
- Alumni.Alumni_id
- Events.Event_id
- Reservations.Reservation_id
- Photos.Photo_id
- Admins.Username
- Admins.Admin_id

### Enum Values
- **Employment_status**: ["Full-Time", "Part-Time", "Unemployed", "Student", "Self-Employed"]
- **Payment_status**: ["Paid", "Pending", "Refunded", "Cancelled"]
- **Admin.Role**: ["Super Admin", "Admin", "Moderator"]

---

## Schema Decisions (Approved)

1. **Custom IDs**: Auto-generated and auto-incremented (A1001, E1001, R1001, P1001, AD1001)
2. **File Storage**: GridFS (photos stored in MongoDB Atlas)
3. **Additional Fields**: None needed
4. **Employment History Location**: Included and uniform across schemas
5. **Photo File Metadata**: Included (File_name, File_size, Mime_type)
6. **Alumni Authentication**: Password field added (bcrypt hashed)

## Implementation Notes

### Auto-Increment IDs
- Counter collection tracks next ID for each type
- Format: Prefix + 4-digit number (A1001, E1002, etc.)
- Atomic increment operations

### GridFS Photo Storage
- Files stored in MongoDB using GridFS
- Photos collection stores metadata + GridFS file reference
- Max file size: 16MB per GridFS chunk
- Retrieve photos via File_id reference

