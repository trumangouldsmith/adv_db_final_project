const Alumni = require('../models/Alumni');
const Event = require('../models/Event');
const Reservation = require('../models/Reservation');
const Photo = require('../models/Photo');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    // Alumni queries
    async getAlumni() {
      return await Alumni.find();
    },
    async getAlumniById(_, { id }) {
      return await Alumni.findById(id);
    },
    async getAlumniByAlumniId(_, { Alumni_id }) {
      return await Alumni.findOne({ Alumni_id });
    },
    async getAlumniByEmail(_, { Email }) {
      return await Alumni.findOne({ Email });
    },
    async getAlumniByEmployer(_, { Employer }) {
      return await Alumni.find({ Employer });
    },

    // Event queries
    async getEvents() {
      return await Event.find();
    },
    async getEventById(_, { id }) {
      return await Event.findById(id);
    },
    async getEventByEventId(_, { Event_id }) {
      return await Event.findOne({ Event_id });
    },
    async getEventsByDate(_, { Date }) {
      return await Event.find({ Date });
    },

    // Reservation queries
    async getReservations() {
      return await Reservation.find();
    },
    async getReservationById(_, { id }) {
      return await Reservation.findById(id);
    },
    async getReservationsByAlumni(_, { Alumni_id }) {
      return await Reservation.find({ Alumni_id });
    },
    async getReservationsByEvent(_, { Event_id }) {
      return await Reservation.find({ Event_id });
    },

    // Photo queries
    async getPhotos() {
      return await Photo.find();
    },
    async getPhotoById(_, { id }) {
      return await Photo.findById(id);
    },
    async getPhotosByEvent(_, { Event_id }) {
      return await Photo.find({ Event_id });
    },
    async getPhotosByAlumni(_, { Alumni_id }) {
      return await Photo.find({ Alumni_id });
    },
    async getPhotosByTags(_, { Tags }) {
      return await Photo.find({ Tags: { $in: Tags } });
    },

    // Admin queries
    async getAdmins() {
      return await Admin.find();
    },
    async getAdminById(_, { id }) {
      return await Admin.findById(id);
    },
  },

  Mutation: {
    // Alumni mutations
    async createAlumni(_, { input }) {
      const hashedPassword = await bcrypt.hash(input.Password, 10);
      const alumni = new Alumni({
        ...input,
        Password: hashedPassword
      });
      const result = await alumni.save();
      return result;
    },
    async updateAlumni(_, { id, input }) {
      if (input.Password) {
        input.Password = await bcrypt.hash(input.Password, 10);
      }
      const updated = await Alumni.findByIdAndUpdate(id, input, { new: true });
      return updated;
    },
    async deleteAlumni(_, { id }) {
      const deleted = await Alumni.findByIdAndDelete(id);
      return deleted ? true : false;
    },

    // Event mutations
    async createEvent(_, { input }) {
      const event = new Event(input);
      const result = await event.save();
      return result;
    },
    async updateEvent(_, { id, input }) {
      const updated = await Event.findByIdAndUpdate(id, input, { new: true });
      return updated;
    },
    async deleteEvent(_, { id }) {
      const deleted = await Event.findByIdAndDelete(id);
      return deleted ? true : false;
    },

    // Reservation mutations
    async createReservation(_, { input }) {
      const reservation = new Reservation(input);
      const result = await reservation.save();
      return result;
    },
    async updateReservation(_, { id, input }) {
      const updated = await Reservation.findByIdAndUpdate(id, input, { new: true });
      return updated;
    },
    async deleteReservation(_, { id }) {
      const deleted = await Reservation.findByIdAndDelete(id);
      return deleted ? true : false;
    },

    // Photo mutations
    async createPhoto(_, { input }) {
      const photo = new Photo(input);
      const result = await photo.save();
      return result;
    },
    async updatePhoto(_, { id, input }) {
      const updated = await Photo.findByIdAndUpdate(id, input, { new: true });
      return updated;
    },
    async deletePhoto(_, { id }) {
      const deleted = await Photo.findByIdAndDelete(id);
      return deleted ? true : false;
    },

    // Admin mutations
    async createAdmin(_, { input }) {
      const hashedPassword = await bcrypt.hash(input.Password, 10);
      const admin = new Admin({
        ...input,
        Password: hashedPassword
      });
      const result = await admin.save();
      return result;
    },
    async updateAdmin(_, { id, input }) {
      if (input.Password) {
        input.Password = await bcrypt.hash(input.Password, 10);
      }
      const updated = await Admin.findByIdAndUpdate(id, input, { new: true });
      return updated;
    },
    async deleteAdmin(_, { id }) {
      const deleted = await Admin.findByIdAndDelete(id);
      return deleted ? true : false;
    },

    // Authentication mutations
    async loginAlumni(_, { Email, Password }) {
      const alumni = await Alumni.findOne({ Email });
      if (!alumni) {
        throw new Error('Alumni not found');
      }

      const isValid = await bcrypt.compare(Password, alumni.Password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { id: alumni._id, Alumni_id: alumni.Alumni_id, type: 'alumni' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        alumni,
        admin: null
      };
    },

    async loginAdmin(_, { Username, Password }) {
      const admin = await Admin.findOne({ Username });
      if (!admin) {
        throw new Error('Admin not found');
      }

      const isValid = await bcrypt.compare(Password, admin.Password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      await Admin.findByIdAndUpdate(admin._id, { Last_login: new Date() });

      const token = jwt.sign(
        { id: admin._id, Admin_id: admin.Admin_id, type: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        alumni: null,
        admin
      };
    },

    async registerAlumni(_, { input }) {
      const existingAlumni = await Alumni.findOne({ Email: input.Email });
      if (existingAlumni) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(input.Password, 10);
      const alumni = new Alumni({
        ...input,
        Password: hashedPassword
      });
      const result = await alumni.save();

      const token = jwt.sign(
        { id: result._id, Alumni_id: result.Alumni_id, type: 'alumni' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        alumni: result,
        admin: null
      };
    },
  },
};

module.exports = { resolvers };

