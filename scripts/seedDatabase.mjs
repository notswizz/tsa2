import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

// Staff schema fields we can see from the components:
// - name
// - email
// - phone
// - location (ATL, NYC, LA, DAL)
// - birthday
// - shoeSize
// - dressSize
// - notes
// - resumeUrl (optional)

// Client schema fields we can see from the components:
// - companyName
// - contacts (array of { name, ... })

// Define schemas since we're not importing models directly
const staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  birthday: Date,
  shoeSize: String,
  dressSize: String,
  notes: String,
  resumeUrl: String
});

const clientSchema = new mongoose.Schema({
  companyName: String,
  contacts: [{
    name: String,
    email: String,
    phone: String,
    title: String
  }]
});

const showSchema = new mongoose.Schema({
  type: String,
  location: String,
  startDate: Date,
  endDate: Date,
  notes: String
});

const bookingSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  startDate: Date,
  endDate: Date,
  status: String,
  notes: String,
  dailyStaffing: [{
    date: Date,
    staffNeeded: Number,
    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }]
  }]
});

const locations = ['ATL', 'NYC', 'LA', 'DAL'];
const shoeSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];
const dressSizes = ['0', '2', '4', '6', '8', '10', '12', '14'];
const showTypes = ['Fashion', 'Trade', 'Corporate', 'Wedding', 'Private'];
const bookingStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const generateStaff = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number('(###) ###-####'),
  location: faker.helpers.arrayElement(locations),
  birthday: faker.date.between({ from: '1985-01-01', to: '2000-12-31' }),
  shoeSize: faker.helpers.arrayElement(shoeSizes),
  dressSize: faker.helpers.arrayElement(dressSizes),
  notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
  resumeUrl: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.5 }),
});

const generateClient = () => ({
  companyName: faker.company.name(),
  contacts: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number('(###) ###-####'),
    title: faker.person.jobTitle()
  }))
});

const generateShow = () => {
  const startDate = faker.date.future();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 7 }));
  
  return {
    type: faker.helpers.arrayElement(showTypes),
    location: faker.helpers.arrayElement(locations),
    startDate,
    endDate,
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 })
  };
};

const generateBooking = (show, client, staffList) => {
  const startDate = new Date(show.startDate);
  const endDate = new Date(show.endDate);
  const days = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const staffNeeded = faker.number.int({ min: 1, max: 5 });
    const availableStaff = [...staffList]
      .sort(() => 0.5 - Math.random())
      .slice(0, staffNeeded);

    days.push({
      date: new Date(currentDate),
      staffNeeded,
      assignedStaff: availableStaff.map(staff => staff._id)
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    show: show._id,
    client: client._id,
    startDate,
    endDate,
    status: faker.helpers.arrayElement(bookingStatuses),
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
    dailyStaffing: days
  };
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create models
    const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
    const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
    const Show = mongoose.models.Show || mongoose.model('Show', showSchema);
    const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

    // Clear existing data
    await Promise.all([
      Staff.deleteMany({}),
      Client.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Generate and insert staff
    const staffData = Array.from({ length: 10 }, generateStaff);
    const staff = await Staff.insertMany(staffData);
    console.log('Created', staff.length, 'staff members');

    // Generate and insert clients
    const clientData = Array.from({ length: 10 }, generateClient);
    const clients = await Client.insertMany(clientData);
    console.log('Created', clients.length, 'clients');

    // Generate and insert shows
    const showData = Array.from({ length: 5 }, generateShow);
    const shows = await Show.insertMany(showData);
    console.log('Created', shows.length, 'shows');

    // Generate and insert bookings
    const bookingPromises = shows.map(show => {
      const client = faker.helpers.arrayElement(clients);
      return generateBooking(show, client, staff);
    });
    const bookings = await Booking.insertMany(bookingPromises);
    console.log('Created', bookings.length, 'bookings');

    // Log a sample booking with populated references
    const sampleBooking = await Booking.findById(bookings[0]._id)
      .populate('show')
      .populate('client')
      .populate('dailyStaffing.assignedStaff');

    console.log('\nSample Booking:');
    console.log(JSON.stringify(sampleBooking, null, 2));

    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase(); 