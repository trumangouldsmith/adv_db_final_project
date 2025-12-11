const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type EmployerLocation {
    City: String
    State: String
  }

  type EmploymentHistory {
    Employer: String
    Employment_title: String
    Start_date: String
    End_date: String
    Location: EmployerLocation
  }

  type Alumni {
    _id: ID!
    Alumni_id: String!
    Name: String!
    Graduation_year: Int!
    Field_of_study: [String]
    Address: String
    Phone: String
    Email: String!
    Employment_status: String
    Employer: String
    Employer_location: EmployerLocation
    Employment_title: String
    Employment_history: [EmploymentHistory]
    Events_history: [String]
    Created_at: String
    Updated_at: String
  }

  type Event {
    _id: ID!
    Event_id: String!
    Name: String!
    Description: String
    Location: String
    Date: String!
    Time: String
    Capacity: Int
    Organizer_id: String!
    Created_at: String
    Updated_at: String
  }

  type PaymentInformation {
    Payment_method: String
    Card_type: String
    Last_four_digits: String
    Transaction_id: String
    Payment_date: String
  }

  type Reservation {
    _id: ID!
    Reservation_id: String!
    Alumni_id: String!
    Event_id: String!
    Number_of_attendees: Int
    Payment_amount: Float
    Payment_status: String
    Payment_information: PaymentInformation
    Created_at: String
    Updated_at: String
  }

  type Photo {
    _id: ID!
    Photo_id: String!
    File_id: ID!
    File_name: String!
    File_size: Int
    Mime_type: String
    Alumni_id: String!
    Uploader_name: String
    Event_id: String
    Tags: [String]
    Upload_date: String
    Created_at: String
    Updated_at: String
  }

  type Admin {
    _id: ID!
    Admin_id: String!
    Username: String!
    Role: String!
    Email: String
    Created_at: String
    Updated_at: String
    Last_login: String
  }

  type AuthPayload {
    token: String!
    alumni: Alumni
    admin: Admin
  }

  type Query {
    # Alumni queries
    getAlumni: [Alumni!]!
    getAlumniById(id: ID!): Alumni
    getAlumniByAlumniId(Alumni_id: String!): Alumni
    getAlumniByEmail(Email: String!): Alumni
    getAlumniByEmployer(Employer: String!): [Alumni!]!
    
    # Event queries
    getEvents: [Event!]!
    getEventById(id: ID!): Event
    getEventByEventId(Event_id: String!): Event
    getEventsByDate(Date: String!): [Event!]!
    
    # Reservation queries
    getReservations: [Reservation!]!
    getReservationById(id: ID!): Reservation
    getReservationsByAlumni(Alumni_id: String!): [Reservation!]!
    getReservationsByEvent(Event_id: String!): [Reservation!]!
    
    # Photo queries
    getPhotos: [Photo!]!
    getPhotoById(id: ID!): Photo
    getPhotosByEvent(Event_id: String!): [Photo!]!
    getPhotosByAlumni(Alumni_id: String!): [Photo!]!
    getPhotosByTags(Tags: [String!]!): [Photo!]!
    
    # Admin queries
    getAdmins: [Admin!]!
    getAdminById(id: ID!): Admin
  }

  input EmployerLocationInput {
    City: String
    State: String
  }

  input EmploymentHistoryInput {
    Employer: String
    Employment_title: String
    Start_date: String
    End_date: String
    Location: EmployerLocationInput
  }

  input AlumniInput {
    Name: String!
    Graduation_year: Int!
    Field_of_study: [String]
    Address: String
    Phone: String
    Email: String!
    Password: String!
    Employment_status: String
    Employer: String
    Employer_location: EmployerLocationInput
    Employment_title: String
    Employment_history: [EmploymentHistoryInput]
    Events_history: [String]
  }

  input AlumniUpdateInput {
    Name: String
    Graduation_year: Int
    Field_of_study: [String]
    Address: String
    Phone: String
    Email: String
    Password: String
    Employment_status: String
    Employer: String
    Employer_location: EmployerLocationInput
    Employment_title: String
    Employment_history: [EmploymentHistoryInput]
    Events_history: [String]
  }

  input EventInput {
    Name: String!
    Description: String
    Location: String
    Date: String!
    Time: String
    Capacity: Int
    Organizer_id: String!
  }

  input EventUpdateInput {
    Name: String
    Description: String
    Location: String
    Date: String
    Time: String
    Capacity: Int
    Organizer_id: String
  }

  input PaymentInformationInput {
    Payment_method: String
    Card_type: String
    Last_four_digits: String
    Transaction_id: String
    Payment_date: String
  }

  input ReservationInput {
    Alumni_id: String!
    Event_id: String!
    Number_of_attendees: Int
    Payment_amount: Float
    Payment_status: String
    Payment_information: PaymentInformationInput
  }

  input ReservationUpdateInput {
    Alumni_id: String
    Event_id: String
    Number_of_attendees: Int
    Payment_amount: Float
    Payment_status: String
    Payment_information: PaymentInformationInput
  }

  input PhotoInput {
    File_id: ID!
    File_name: String!
    File_size: Int
    Mime_type: String
    Alumni_id: String!
    Event_id: String
    Tags: [String]
  }

  input PhotoUpdateInput {
    File_id: ID
    File_name: String
    File_size: Int
    Mime_type: String
    Alumni_id: String
    Event_id: String
    Tags: [String]
  }

  input AdminInput {
    Username: String!
    Password: String!
    Role: String
    Email: String
  }

  input AdminUpdateInput {
    Username: String
    Password: String
    Role: String
    Email: String
  }

  type Mutation {
    # Alumni mutations
    createAlumni(input: AlumniInput!): Alumni!
    updateAlumni(id: ID!, input: AlumniUpdateInput!): Alumni!
    deleteAlumni(id: ID!): Boolean!
    
    # Event mutations
    createEvent(input: EventInput!): Event!
    updateEvent(id: ID!, input: EventUpdateInput!): Event!
    deleteEvent(id: ID!): Boolean!
    
    # Reservation mutations
    createReservation(input: ReservationInput!): Reservation!
    updateReservation(id: ID!, input: ReservationUpdateInput!): Reservation!
    deleteReservation(id: ID!): Boolean!
    
    # Photo mutations
    createPhoto(input: PhotoInput!): Photo!
    updatePhoto(id: ID!, input: PhotoUpdateInput!): Photo!
    deletePhoto(id: ID!): Boolean!
    
    # Admin mutations
    createAdmin(input: AdminInput!): Admin!
    updateAdmin(id: ID!, input: AdminUpdateInput!): Admin!
    deleteAdmin(id: ID!): Boolean!
    
    # Authentication mutations
    loginAlumni(Email: String!, Password: String!): AuthPayload!
    loginAdmin(Username: String!, Password: String!): AuthPayload!
    registerAlumni(input: AlumniInput!): AuthPayload!
  }
`;

module.exports = { typeDefs };

