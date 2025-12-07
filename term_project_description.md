# CLP Alumni Directory - Term Project Description

**Project Name:** The Mizzou Cornell Leadership Program Alumni Directory  
**Course:** Advanced Databases - CS 5600  
**Author:** Truman Gouldsmith

## Project Overview

### About the Cornell Leadership Program
The Cornell Leadership Program is a four-year undergraduate program for business students in the Trulaske College of Business at the University of Missouri. Top performing business students study, travel, and embrace the ideals of integrity, gratitude, humility, community, motivation, and leadership.

### Problem Statement
A need for connectedness among alumni has been expressed as a key priority for expanding the program's sustainability beyond graduation. Currently, there is no centralized system for alumni to:
- Connect with former classmates
- Share career progression and opportunities
- Organize and track events
- Maintain engagement with the program

### Solution
A CLP directory database will serve as the foundation for program alumni to connect with former classmates. It will be a comprehensive touchpoint containing:
- Current alumni information and contact details
- Career histories and current employment
- Event information (past and upcoming)
- Tagged photo repository
- Event RSVP and attendance tracking

## Database Purpose

This database will house all necessary and relevant information on Cornell Leadership Program alumni, including:
- Esteemed career paths with durations, roles, and companies
- Historical and upcoming event information
- Tagged photo repository for event memories
- Contact information for alumni networking

## User Types and Use Cases

### Alumni
- Query CLP alumni by role, location, tenure, and position
- Update their own profile and employment information
- Browse and RSVP to events
- Upload and tag photos from events
- Network with other alumni at target companies

### Program Administrators
- Look up current alumni locations to optimize "alumni reception events" and maximize engagement
- Create and manage events
- Monitor alumni participation and engagement
- Generate reports on alumni career paths

### Current Students
- Look up alumni by company to gauge internship/job opportunities
- Start their job search with a connection through the shared CLP program
- View career progression paths of alumni

## Key Features

### Data Entry & Update
- Add new alumni as they graduate
- Allow users to update their information (career changes, location, contact info)
- Admin capabilities for data maintenance

### Advanced Querying
- Sort, filter, and lookup by multiple conditions
- Tailored searches for alumni and events
- Complex queries on employment history and location

### Photo Management
- Upload photos with event associations
- Tag photos with descriptive keywords
- Search photos by tags, events, or alumni

### Event Management
- Create and manage events
- RSVP tracking and attendance management
- Payment processing for event fees

## LLM Integration

### Natural Language Interface
A chat interface will be embedded that allows users to interact with the database using natural language queries. The LLM will:
- Accept plain English queries about alumni, events, and careers
- Translate natural language to appropriate database queries (GraphQL)
- Execute queries and return results
- Enable users to find particular alumni faster based on any trait or piece of information
- Support all CRUD operations through conversational interface

### Benefits
- Lower barrier to entry for non-technical users
- Faster, more intuitive searching
- Discover connections and alumni through natural conversation
- Support complex, multi-criteria searches without knowledge of query syntax

## Technical Requirements

### Data Input
- Alumni: name, graduation year, field of study, job history (employer, location, title, start/end dates), current location, contact information
- Events: name, description, location, date, time, capacity, organizer
- Reservations: attendee count, payment information, RSVP status
- Photos: file upload, event association, tags, upload date

### Operations
- **CRUD Operations**: Full Create, Read, Update, Delete for all entities
- **File Upload**: Photo storage with metadata
- **Authentication**: User login system (admin and alumni roles)
- **Search**: Multi-criteria filtering and search
- **LLM Queries**: Natural language to database query translation