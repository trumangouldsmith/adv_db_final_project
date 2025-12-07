import { gql } from '@apollo/client';

// Alumni Queries
export const GET_ALUMNI = gql`
  query GetAlumni {
    getAlumni {
      _id
      Alumni_id
      Name
      Graduation_year
      Field_of_study
      Email
      Phone
      Address
      Employment_status
      Employer
      Employment_title
      Employer_location {
        City
        State
      }
    }
  }
`;

export const GET_ALUMNI_BY_ID = gql`
  query GetAlumniById($id: ID!) {
    getAlumniById(id: $id) {
      _id
      Alumni_id
      Name
      Graduation_year
      Field_of_study
      Email
      Phone
      Address
      Employment_status
      Employer
      Employment_title
      Employer_location {
        City
        State
      }
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
      Events_history
      Created_at
      Updated_at
    }
  }
`;

export const GET_ALUMNI_BY_EMPLOYER = gql`
  query GetAlumniByEmployer($employer: String!) {
    getAlumniByEmployer(Employer: $employer) {
      _id
      Alumni_id
      Name
      Employment_title
      Email
    }
  }
`;

// Event Queries
export const GET_EVENTS = gql`
  query GetEvents {
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
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    getEventById(id: $id) {
      _id
      Event_id
      Name
      Description
      Location
      Date
      Time
      Capacity
      Organizer_id
      Created_at
      Updated_at
    }
  }
`;

// Reservation Queries
export const GET_RESERVATIONS = gql`
  query GetReservations {
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
`;

export const GET_RESERVATIONS_BY_ALUMNI = gql`
  query GetReservationsByAlumni($alumniId: String!) {
    getReservationsByAlumni(Alumni_id: $alumniId) {
      _id
      Reservation_id
      Event_id
      Number_of_attendees
      Payment_amount
      Payment_status
    }
  }
`;

export const GET_RESERVATIONS_BY_EVENT = gql`
  query GetReservationsByEvent($eventId: String!) {
    getReservationsByEvent(Event_id: $eventId) {
      _id
      Reservation_id
      Alumni_id
      Number_of_attendees
      Payment_amount
      Payment_status
    }
  }
`;

// Photo Queries
export const GET_PHOTOS = gql`
  query GetPhotos {
    getPhotos {
      _id
      Photo_id
      File_id
      File_name
      File_size
      Mime_type
      Alumni_id
      Event_id
      Tags
      Upload_date
    }
  }
`;

export const GET_PHOTOS_BY_EVENT = gql`
  query GetPhotosByEvent($eventId: String!) {
    getPhotosByEvent(Event_id: $eventId) {
      _id
      Photo_id
      File_id
      File_name
      Alumni_id
      Tags
      Upload_date
    }
  }
`;

export const GET_PHOTOS_BY_TAGS = gql`
  query GetPhotosByTags($tags: [String!]!) {
    getPhotosByTags(Tags: $tags) {
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
`;

// Admin Queries
export const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins {
      _id
      Admin_id
      Username
      Role
      Email
    }
  }
`;

