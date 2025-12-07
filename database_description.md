# Database Description and Business Rules for CLP Alumni Directory

## Overview
The Cornell Leadership Program (CLP) Alumni Directory database is designed to connect graduates of the program in the Trulaske College of Business at the University of Missouri. The database maintains comprehensive information about alumni, their professional histories, contact details, and participation in CLP events. The purpose of the database is to facilitate networking, alumni engagement, and event organization for both alumni and program administrators.

## Database Purpose
- Enable alumni networking based on location, company, and career path
- Allow program administrators to organize targeted alumni events
- Provide current students access to alumni for internship/job opportunities
- Maintain historical records of events and participation
- Store and organize event photos with searchable metadata

## Data Entities and Relationships

### Alumni
Each alumnus has a unique record containing identifying information such as their name, graduation year, and contact information. For each alumnus, the system stores their current location and employment details, including their current company and job title. Each alumnus may have several prior positions recorded in their job history. Each job history entry includes the company name, title, start and end dates, and job location. This allows users to view career progression and professional experience for each alumnus.

### Events
The database maintains information about CLP events. Each event has a unique identifier, name, description, location, date, time, capacity, and organizer information. Alumni may attend multiple events, and each event may have multiple alumni attendees. Alumni can organize events, establishing a relationship between Alumni and Events collections through Alumni_id and Organizer_id.

### Reservations
Alumni create reservations for events, which track attendance, payment details, and RSVP status. Each reservation links an alumni member to a specific event and contains payment information.

### Photos
The database stores photographs taken during CLP events or uploaded by alumni. Each photo record contains a unique photo identifier, a reference to the event at which it was taken (optional), the alumni owner who uploaded it, and descriptive tags for searchability. Photos can be tagged with keywords to make them easily discoverable.

### Admins
System administrators have accounts with credentials for managing the entire system. Admins have full oversight and can perform any necessary maintenance, monitoring, and modification operations.

## Query Capabilities
The database supports queries that allow users to find alumni based on various criteria, such as company, job title, graduation year, or location. Program administrators can query alumni data to determine where alumni are currently located and plan events to maximize engagement in specific areas. Current students can also query the database to find alumni working at companies of interest to them for networking or internship opportunities.

## Sample Data

### Sample Alumni
```json
{
  "Alumni_id": "A1001",
  "Name": "Truman Gouldsmith",
  "Graduation_year": 2024,
  "Field_of_study": ["Mathematics", "Economics", "Computer Science"],
  "Address": "123 Berry St, New York, NY 31256",
  "Phone": "816-123-4567",
  "Email": "truman.gouldsmith@clp.org",
  "Employment_status": "Full-Time",
  "Employer": "Tradebot Systems",
  "Employer_location": {
    "City": "Kansas City",
    "State": "MO"
  },
  "Employment_title": "Financial Analyst",
  "Employment_history": [
    {
      "Employer": "PwC",
      "Employment_title": "Intern",
      "Start_date": "2023-05-15",
      "End_date": "2023-08-15",
      "Location": {
        "City": "New York",
        "State": "NY"
      }
    }
  ],
  "Events_history": ["E1001", "E1002"]
}
```

### Sample Event
```json
{
  "Event_id": "E1001",
  "Name": "CLP Alumni Networking Gala 2025",
  "Description": "An annual networking event bringing together CLP alumni and students.",
  "Location": "RAC, University of Missouri, Columbia, MO",
  "Date": "2025-11-15",
  "Time": "18:30",
  "Capacity": 200,
  "Organizer_id": "A1001"
}
```

### Sample Reservation
```json
{
  "Reservation_id": "R1001",
  "Alumni_id": "A1001",
  "Event_id": "E1001",
  "Number_of_attendees": 2,
  "Payment_amount": 75.00,
  "Payment_status": "Paid",
  "Payment_information": {
    "Payment_method": "Credit Card",
    "Card_type": "Visa",
    "Last_four_digits": "4821",
    "Transaction_id": "TXN-20251025-7890",
    "Payment_date": "2025-10-25"
  }
}
```

### Sample Photo
```json
{
  "Photo_id": "P1001",
  "File_path": "uploads/photos/clp_gala_2025_group_photo.jpg",
  "File_url": "http://localhost:5000/uploads/photos/clp_gala_2025_group_photo.jpg",
  "Alumni_id": "A1001",
  "Event_id": "E1001",
  "Tags": ["networking", "gala", "2025", "columbia"],
  "Upload_date": "2025-11-16"
}
```

### Sample Admin
```json
{
  "Admin_id": "AD1001",
  "Username": "admin_clp",
  "Password": "hashed_password_here",
  "Role": "Super Admin"
}
```

## Supported Operations

### Admin Operations
- Full CRUD access to all collections (Alumni, Events, Reservations, Photos, Admins)
- System monitoring and maintenance
- Data export and reporting
- User management

### Alumni Operations
- **Profile Management**: View and update own profile information
- **Event Management**: Create, view, update, and delete events they organize
- **Event Participation**: Browse events, create reservations, view event details
- **Photo Management**: Upload photos (with optional event association), add tags, view photos
- **Alumni Search**: Query other alumni by company, location, graduation year, job title
- **Networking**: View other alumni profiles for networking opportunities

### Query Operations
- Search alumni by: name, company, job title, location, graduation year, field of study
- Search events by: date, location, organizer
- Search photos by: event, tags, alumni
- Filter alumni by current employment status and location
- View career progression through employment history

## Database Collections
- **Alumni**: Stores alumni profile and career information
- **Events**: Stores event details and organizer information
- **Reservations**: Links alumni to events with RSVP and payment data
- **Photos**: Stores photo metadata with file references and tags
- **Admins**: Stores administrator credentials and permissions
