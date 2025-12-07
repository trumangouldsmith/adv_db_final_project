import { gql } from '@apollo/client';

// Authentication Mutations
export const LOGIN_ALUMNI = gql`
  mutation LoginAlumni($email: String!, $password: String!) {
    loginAlumni(Email: $email, Password: $password) {
      token
      alumni {
        _id
        Alumni_id
        Name
        Email
      }
    }
  }
`;

export const LOGIN_ADMIN = gql`
  mutation LoginAdmin($username: String!, $password: String!) {
    loginAdmin(Username: $username, Password: $password) {
      token
      admin {
        _id
        Admin_id
        Username
        Role
      }
    }
  }
`;

export const REGISTER_ALUMNI = gql`
  mutation RegisterAlumni($input: AlumniInput!) {
    registerAlumni(input: $input) {
      token
      alumni {
        _id
        Alumni_id
        Name
        Email
      }
    }
  }
`;

// Alumni Mutations
export const CREATE_ALUMNI = gql`
  mutation CreateAlumni($input: AlumniInput!) {
    createAlumni(input: $input) {
      _id
      Alumni_id
      Name
      Email
    }
  }
`;

export const UPDATE_ALUMNI = gql`
  mutation UpdateAlumni($id: ID!, $input: AlumniUpdateInput!) {
    updateAlumni(id: $id, input: $input) {
      _id
      Alumni_id
      Name
      Email
    }
  }
`;

export const DELETE_ALUMNI = gql`
  mutation DeleteAlumni($id: ID!) {
    deleteAlumni(id: $id)
  }
`;

// Event Mutations
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      _id
      Event_id
      Name
      Date
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: EventUpdateInput!) {
    updateEvent(id: $id, input: $input) {
      _id
      Event_id
      Name
      Date
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

// Reservation Mutations
export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationInput!) {
    createReservation(input: $input) {
      _id
      Reservation_id
      Alumni_id
      Event_id
    }
  }
`;

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: ID!, $input: ReservationUpdateInput!) {
    updateReservation(id: $id, input: $input) {
      _id
      Reservation_id
    }
  }
`;

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(id: $id)
  }
`;

// Photo Mutations
export const CREATE_PHOTO = gql`
  mutation CreatePhoto($input: PhotoInput!) {
    createPhoto(input: $input) {
      _id
      Photo_id
      File_id
    }
  }
`;

export const UPDATE_PHOTO = gql`
  mutation UpdatePhoto($id: ID!, $input: PhotoUpdateInput!) {
    updatePhoto(id: $id, input: $input) {
      _id
      Photo_id
    }
  }
`;

export const DELETE_PHOTO = gql`
  mutation DeletePhoto($id: ID!) {
    deletePhoto(id: $id)
  }
`;

// Admin Mutations
export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: AdminInput!) {
    createAdmin(input: $input) {
      _id
      Admin_id
      Username
    }
  }
`;

export const UPDATE_ADMIN = gql`
  mutation UpdateAdmin($id: ID!, $input: AdminUpdateInput!) {
    updateAdmin(id: $id, input: $input) {
      _id
      Admin_id
      Username
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation DeleteAdmin($id: ID!) {
    deleteAdmin(id: $id)
  }
`;

