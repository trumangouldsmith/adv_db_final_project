# CLP Alumni Directory - Data Dictionary

## Overview
This document provides a comprehensive reference for all data structures in the CLP Alumni Directory system.

**Database:** MongoDB Atlas  
**Database Name:** clp_alumni  
**Last Updated:** December 2025

---

## Collections

### 1. Alumni Collection

**Collection Name:** `alumni`  
**Description:** Stores alumni member information, employment history, and authentication credentials.

| Field Name | Data Type | Required | Unique | Description | Sample Value |
|------------|-----------|----------|--------|-------------|--------------|
| `_id` | ObjectId | Yes | Yes | MongoDB auto-generated document ID | `507f1f77bcf86cd799439011` |
| `Alumni_id` | String | Yes | Yes | Auto-generated alumni identifier (A1001+) | `A1005` |
| `Name` | String | Yes | No | Full name of the alumni | `John Smith` |
| `Email` | String | Yes | Yes | Email address (used for login) | `john.smith@example.com` |
| `Password` | String | Yes | No | Bcrypt-hashed password | `$2a$10$...` |
| `Graduation_year` | Number | Yes | No | Year of graduation | `2020` |
| `Field_of_study` | Array[String] | No | No | Major(s) studied | `["Finance", "Economics"]` |
| `Address` | String | No | No | Full mailing address | `123 Main St, Kansas City, MO 64105` |
| `Phone` | String | No | No | Contact phone number | `(555) 123-4567` |
| `Employment_status` | String | No | No | Current employment status | `Full-Time`, `Part-Time`, `Self-Employed` |
| `Employer` | String | No | No | Current employer name | `Google` |
| `Employment_title` | String | No | No | Current job title | `Software Engineer` |
| `Employer_location` | Object | No | No | Current employer location | `{ City: "San Francisco", State: "CA" }` |
| `Employer_location.City` | String | No | No | City of employment | `San Francisco` |
| `Employer_location.State` | String | No | No | State abbreviation | `CA` |
| `Employment_history` | Array[Object] | No | No | Past employment records | See Employment History structure |
| `Events_history` | Array[String] | No | No | Event IDs the alumni has attended | `["E1001", "E1003"]` |
| `Created_at` | Date | No | No | Record creation timestamp | `2025-12-08T10:00:00.000Z` |
| `Updated_at` | Date | No | No | Last update timestamp | `2025-12-08T15:30:00.000Z` |

**Employment History Structure (Embedded):**
| Field Name | Data Type | Description | Sample Value |
|------------|-----------|-------------|--------------|
| `Employer` | String | Previous employer name | `Microsoft` |
| `Employment_title` | String | Job title held | `Data Analyst` |
| `Start_date` | Date | Employment start date | `2018-06-01` |
| `End_date` | Date | Employment end date | `2020-05-31` |
| `Location` | Object | Employment location | `{ City: "Seattle", State: "WA" }` |
| `Location.City` | String | City of employment | `Seattle` |
| `Location.State` | String | State abbreviation | `WA` |

**Indexes:**
- `Alumni_id` (unique)
- `Email` (unique)

---

### 2. Event Collection

**Collection Name:** `events`  
**Description:** Stores alumni events, including networking events, reunions, and professional development activities.

| Field Name | Data Type | Required | Unique | Description | Sample Value |
|------------|-----------|----------|--------|-------------|--------------|
| `_id` | ObjectId | Yes | Yes | MongoDB auto-generated document ID | `507f1f77bcf86cd799439012` |
| `Event_id` | String | Yes | Yes | Auto-generated event identifier (E1001+) | `E1005` |
| `Name` | String | Yes | No | Event name/title | `Annual Networking Gala 2025` |
| `Description` | String | No | No | Detailed event description | `Join us for an evening of networking...` |
| `Location` | String | No | No | Event venue or "Virtual" | `Downtown Kansas City, MO` or `Virtual` |
| `Date` | Date | Yes | No | Event date | `2025-12-20` |
| `Time` | String | No | No | Event start time (24-hour format) | `18:00` |
| `Capacity` | Number | No | No | Maximum number of attendees | `150` |
| `Organizer_id` | String | Yes | No | Alumni_id of the event organizer | `A1005` |
| `Created_at` | Date | No | No | Record creation timestamp | `2025-12-08T10:00:00.000Z` |
| `Updated_at` | Date | No | No | Last update timestamp | `2025-12-08T15:30:00.000Z` |

**Indexes:**
- `Event_id` (unique)
- `Date`
- `Organizer_id`

**Relationships:**
- `Organizer_id` references `Alumni.Alumni_id`

---

### 3. Reservation Collection

**Collection Name:** `reservations`  
**Description:** Stores event reservations/RSVPs made by alumni, including payment information.

| Field Name | Data Type | Required | Unique | Description | Sample Value |
|------------|-----------|----------|--------|-------------|--------------|
| `_id` | ObjectId | Yes | Yes | MongoDB auto-generated document ID | `507f1f77bcf86cd799439013` |
| `Reservation_id` | String | Yes | Yes | Auto-generated reservation ID (R1001+) | `R1015` |
| `Alumni_id` | String | Yes | No | Alumni who made the reservation | `A1005` |
| `Event_id` | String | Yes | No | Event being reserved | `E1003` |
| `Number_of_attendees` | Number | No | No | Number of people attending | `2` |
| `Payment_amount` | Number | No | No | Amount paid (in dollars) | `50.00` |
| `Payment_status` | String | No | No | Payment status | `Paid`, `Pending` |
| `Payment_information` | Object | No | No | Payment details | See Payment Information structure |
| `Created_at` | Date | No | No | Record creation timestamp | `2025-12-08T10:00:00.000Z` |
| `Updated_at` | Date | No | No | Last update timestamp | `2025-12-08T15:30:00.000Z` |

**Payment Information Structure (Embedded):**
| Field Name | Data Type | Description | Sample Value |
|------------|-----------|-------------|--------------|
| `Payment_method` | String | Method of payment | `Credit Card` |
| `Card_type` | String | Type of credit card | `Visa`, `Mastercard`, `Amex` |
| `Last_four_digits` | String | Last 4 digits of card | `1234` |
| `Transaction_id` | String | Payment processor transaction ID | `TXN-abc12345` |
| `Payment_date` | Date | Date payment was processed | `2025-11-15` |

**Indexes:**
- `Reservation_id` (unique)
- `Alumni_id`
- `Event_id`

**Relationships:**
- `Alumni_id` references `Alumni.Alumni_id`
- `Event_id` references `Event.Event_id`

---

### 4. Photo Collection

**Collection Name:** `photos`  
**Description:** Stores photo metadata for images uploaded to events or alumni profiles. Actual image files stored in GridFS.

| Field Name | Data Type | Required | Unique | Description | Sample Value |
|------------|-----------|----------|--------|-------------|--------------|
| `_id` | ObjectId | Yes | Yes | MongoDB auto-generated document ID | `507f1f77bcf86cd799439014` |
| `Photo_id` | String | Yes | Yes | Auto-generated photo identifier (P1001+) | `P1008` |
| `File_id` | ObjectId | Yes | No | GridFS file identifier | `507f1f77bcf86cd799439015` |
| `File_name` | String | Yes | No | Original filename | `networking_gala_2025.jpg` |
| `File_size` | Number | No | No | File size in bytes | `2458672` |
| `Mime_type` | String | No | No | MIME type of the file | `image/jpeg` |
| `Alumni_id` | String | No | No | Alumni who uploaded the photo | `A1005` |
| `Event_id` | String | No | No | Event associated with the photo | `E1003` |
| `Tags` | Array[String] | No | No | Searchable tags | `["networking", "2025", "gala"]` |
| `Upload_date` | Date | No | No | Date photo was uploaded | `2025-12-08T10:00:00.000Z` |
| `Created_at` | Date | No | No | Record creation timestamp | `2025-12-08T10:00:00.000Z` |
| `Updated_at` | Date | No | No | Last update timestamp | `2025-12-08T15:30:00.000Z` |

**Indexes:**
- `Photo_id` (unique)
- `Alumni_id`
- `Event_id`
- `Tags`

**Relationships:**
- `Alumni_id` references `Alumni.Alumni_id`
- `Event_id` references `Event.Event_id`
- `File_id` references GridFS file

**Storage:**
- Photo metadata stored in `photos` collection
- Actual image files stored in GridFS (`fs.files` and `fs.chunks` collections)

---

### 5. Admin Collection

**Collection Name:** `admins`  
**Description:** Stores system administrator accounts with elevated privileges.

| Field Name | Data Type | Required | Unique | Description | Sample Value |
|------------|-----------|----------|--------|-------------|--------------|
| `_id` | ObjectId | Yes | Yes | MongoDB auto-generated document ID | `507f1f77bcf86cd799439016` |
| `Admin_id` | String | Yes | Yes | Auto-generated admin identifier (AD1001+) | `AD1001` |
| `Username` | String | Yes | Yes | Admin login username | `admin_clp` |
| `Password` | String | Yes | No | Bcrypt-hashed password | `$2a$10$...` |
| `Role` | String | No | No | Admin role/title | `Super Admin`, `Moderator` |
| `Email` | String | No | No | Admin email address | `admin@clp.org` |
| `Last_login` | Date | No | No | Last successful login timestamp | `2025-12-08T09:30:00.000Z` |
| `Created_at` | Date | No | No | Record creation timestamp | `2025-01-01T00:00:00.000Z` |
| `Updated_at` | Date | No | No | Last update timestamp | `2025-12-08T15:30:00.000Z` |

**Indexes:**
- `Admin_id` (unique)
- `Username` (unique)

---

### 6. Counter Collection

**Collection Name:** `counters`  
**Description:** Maintains auto-increment sequences for custom ID generation (A1001, E1001, etc.).

| Field Name | Data Type | Required | Unique | Description | Sample Value |
|------------|-----------|----------|--------|-------------|--------------|
| `_id` | String | Yes | Yes | Counter name/identifier | `alumni`, `event`, `reservation`, `photo`, `admin` |
| `seq` | Number | Yes | No | Current sequence number | `1050` |

**Usage:**
- Incremented atomically when creating new records
- Ensures unique, sequential IDs
- Starting value: 1000 (first ID is X1001)

---

## Data Validation Rules

### Alumni
- Email must be unique and valid format
- Password minimum 6 characters (enforced in application layer)
- Graduation_year must be 4-digit year

### Event
- Date must be valid date
- Time in HH:MM format (24-hour)
- Capacity must be positive integer if provided

### Reservation
- Alumni_id must reference existing alumni
- Event_id must reference existing event
- Number_of_attendees must be positive integer
- Payment_amount must be non-negative

### Photo
- File_id must reference valid GridFS file
- Supported MIME types: image/jpeg, image/png, image/gif
- Maximum file size: 10MB (enforced in application layer)

### Admin
- Username must be unique
- Password minimum 8 characters (enforced in application layer)

---

## Referential Integrity

### Maintained by Application Layer:
- Event.Organizer_id → Alumni.Alumni_id
- Reservation.Alumni_id → Alumni.Alumni_id
- Reservation.Event_id → Event.Event_id
- Photo.Alumni_id → Alumni.Alumni_id
- Photo.Event_id → Event.Event_id
- Photo.File_id → GridFS fs.files._id

### Cascading Deletes (Application Logic):
- Deleting Alumni: Remove associated reservations and photos
- Deleting Event: Remove associated reservations and photos
- Deleting Photo: Remove associated GridFS file

---

## Security & Privacy

### Password Storage
- All passwords (Alumni, Admin) hashed using bcrypt with salt rounds = 10
- Passwords never returned in API responses

### Authentication
- JWT tokens with 24-hour expiration
- Tokens include user type (alumni/admin) and ID

### Authorization
- Alumni can view all data, edit only their own records
- Admins have full CRUD access to all collections

---

## Sample Data

### Default Credentials (Development)
**Admin:**
- Username: `admin_clp`
- Password: `admin123`

**Alumni:**
- Email: Any generated email from sample data
- Password: `password123`

---

## Notes

1. **Auto-increment IDs**: All custom IDs (Alumni_id, Event_id, etc.) are auto-generated using the Counter collection
2. **Timestamps**: Created_at and Updated_at are automatically managed by Mongoose middleware
3. **GridFS**: Photos stored in GridFS for efficient large file handling
4. **Embedded Documents**: Employment_history and Payment_information are embedded for performance
5. **Referenced Documents**: Events_history uses string array references for flexibility

---

## Maintenance Scripts

### fix_counters.js
Synchronizes counter sequences with existing data after manual imports.

**Usage:**
```bash
node scripts/fix_counters.js
```

### generate_sample_data.py
Generates sample data for testing and development.

**Usage:**
```bash
python scripts/generate_sample_data.py
```

---

**Document Version:** 1.0  
**Last Updated:** December 8, 2025  
**Maintained By:** CLP Alumni Directory Development Team

