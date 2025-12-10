import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sequelize from "./global/config/db.js";
import {
  User,
  ClinicAdmin,
  VetProfessional,
  PetOwner,
  Clinic,
  Pet,
} from "./src/models/index.js";

dotenv.config();

// Sample data for seeding
const clinicAdminsData = [
  {
    user: {
      first_name: "John",
      last_name: "Smith",
      email: "john.smith@clinic.com",
      password: "password123",
      phone_number: "+1234567890",
    },
    clinicAdmin: {
      clinic_name: "Happy Paws Veterinary Clinic",
      clinic_address: "123 Main Street, City, State 12345",
    },
    clinic: {
      name: "Happy Paws Veterinary Clinic",
      contact_number: "+1234567890",
      email: "info@happypaws.com",
      description: "Full-service veterinary clinic specializing in small animals",
      service: ["General Checkup", "Surgery", "Dental Care", "Vaccination"],
      secdti_url: { id: "sample", link: "https://example.com/secdti.pdf" },
      mayor_permit_url: { id: "sample", link: "https://example.com/mayor.pdf" },
      bir_url: { id: "sample", link: "https://example.com/bir.pdf" },
      status: "approved",
    },
    vetProfessionals: [
      {
        first_name: "Dr. Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@happypaws.com",
        password: "password123",
        phone_number: "+1234567891",
        license_number: "VET-001-2020",
        specialization: "Small Animal Surgery",
      },
      {
        first_name: "Dr. Michael",
        last_name: "Brown",
        email: "michael.brown@happypaws.com",
        password: "password123",
        phone_number: "+1234567892",
        license_number: "VET-002-2021",
        specialization: "Internal Medicine",
      },
    ],
  },
  {
    user: {
      first_name: "Emily",
      last_name: "Davis",
      email: "emily.davis@clinic.com",
      password: "password123",
      phone_number: "+1234567893",
    },
    clinicAdmin: {
      clinic_name: "Paws & Claws Animal Hospital",
      clinic_address: "456 Oak Avenue, City, State 12346",
    },
    clinic: {
      name: "Paws & Claws Animal Hospital",
      contact_number: "+1234567894",
      email: "info@pawsandclaws.com",
      description: "24/7 emergency and general veterinary services",
      service: ["Emergency Care", "General Checkup", "Laboratory", "Radiology"],
      secdti_url: { id: "sample", link: "https://example.com/secdti.pdf" },
      mayor_permit_url: { id: "sample", link: "https://example.com/mayor.pdf" },
      bir_url: { id: "sample", link: "https://example.com/bir.pdf" },
      status: "approved",
    },
    vetProfessionals: [
      {
        first_name: "Dr. Robert",
        last_name: "Wilson",
        email: "robert.wilson@pawsandclaws.com",
        password: "password123",
        phone_number: "+1234567895",
        license_number: "VET-003-2019",
        specialization: "Emergency Medicine",
      },
      {
        first_name: "Dr. Lisa",
        last_name: "Anderson",
        email: "lisa.anderson@pawsandclaws.com",
        password: "password123",
        phone_number: "+1234567896",
        license_number: "VET-004-2022",
        specialization: "Dermatology",
      },
    ],
  },
];

const petOwnersData = [
  {
    user: {
      first_name: "Alice",
      last_name: "Martinez",
      email: "alice.martinez@email.com",
      password: "password123",
      phone_number: "+1234567897",
    },
    petOwner: {
      address: "789 Pine Street, City, State 12347",
    },
    pets: [
      {
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        birthdate: "2020-05-15",
        gender: "male",
        color: "Golden",
        weight: "30 kg",
        owner_email: "alice.martinez@email.com",
      },
      {
        name: "Luna",
        species: "Cat",
        breed: "Persian",
        birthdate: "2021-08-20",
        gender: "female",
        color: "White",
        weight: "4 kg",
        owner_email: "alice.martinez@email.com",
      },
    ],
  },
  {
    user: {
      first_name: "David",
      last_name: "Thompson",
      email: "david.thompson@email.com",
      password: "password123",
      phone_number: "+1234567898",
    },
    petOwner: {
      address: "321 Elm Street, City, State 12348",
    },
    pets: [
      {
        name: "Buddy",
        species: "Dog",
        breed: "Labrador",
        birthdate: "2019-03-10",
        gender: "male",
        color: "Black",
        weight: "35 kg",
        owner_email: "david.thompson@email.com",
      },
    ],
  },
  {
    user: {
      first_name: "Maria",
      last_name: "Garcia",
      email: "maria.garcia@email.com",
      password: "password123",
      phone_number: "+1234567899",
    },
    petOwner: {
      address: "654 Maple Drive, City, State 12349",
    },
    pets: [
      {
        name: "Whiskers",
        species: "Cat",
        breed: "Siamese",
        birthdate: "2022-01-05",
        gender: "male",
        color: "Seal Point",
        weight: "3.5 kg",
        owner_email: "maria.garcia@email.com",
      },
      {
        name: "Bella",
        species: "Dog",
        breed: "Beagle",
        birthdate: "2020-11-12",
        gender: "female",
        color: "Tri-color",
        weight: "12 kg",
        owner_email: "maria.garcia@email.com",
      },
      {
        name: "Charlie",
        species: "Dog",
        breed: "French Bulldog",
        birthdate: "2021-07-25",
        gender: "male",
        color: "Brindle",
        weight: "11 kg",
        owner_email: "maria.garcia@email.com",
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Sync models
    await sequelize.sync({ alter: false });
    console.log("Models synced.");

    // Seed Clinic Admins with Clinics and Vet Professionals
    console.log("\n=== Seeding Clinic Admins ===");
    for (const adminData of clinicAdminsData) {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: adminData.user.email },
      });

      if (existingUser) {
        console.log(`User ${adminData.user.email} already exists. Skipping...`);
        continue;
      }

      // Create User
      const hashedPassword = await bcrypt.hash(adminData.user.password, 10);
      const user = await User.create({
        ...adminData.user,
        password_hash: hashedPassword,
        user_type: "clinic_admin",
      });
      console.log(`Created clinic admin user: ${user.email}`);

      // Create ClinicAdmin
      const clinicAdmin = await ClinicAdmin.create({
        user_id: user.id,
        ...adminData.clinicAdmin,
      });
      console.log(`Created clinic admin record: ${clinicAdmin.clinic_name}`);

      // Create Clinic
      const clinic = await Clinic.create({
        owner_id: user.id,
        ...adminData.clinic,
      });
      console.log(`Created clinic: ${clinic.name}`);

      // Create Vet Professionals
      for (const vetData of adminData.vetProfessionals) {
        const existingVet = await User.findOne({
          where: { email: vetData.email },
        });

        if (existingVet) {
          console.log(`Vet ${vetData.email} already exists. Skipping...`);
          continue;
        }

        const vetHashedPassword = await bcrypt.hash(vetData.password, 10);
        const vetUser = await User.create({
          first_name: vetData.first_name,
          last_name: vetData.last_name,
          email: vetData.email,
          password_hash: vetHashedPassword,
          user_type: "vet_professional",
          phone_number: vetData.phone_number,
        });

        await VetProfessional.create({
          user_id: vetUser.id,
          clinic_admin_id: user.id,
          clinic_id: clinic.clinic_id,
          license_number: vetData.license_number,
          specialization: vetData.specialization,
        });
        console.log(`Created vet professional: ${vetUser.email}`);
      }
    }

    // Seed Pet Owners with Pets
    console.log("\n=== Seeding Pet Owners ===");
    for (const ownerData of petOwnersData) {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: ownerData.user.email },
      });

      if (existingUser) {
        console.log(`User ${ownerData.user.email} already exists. Skipping...`);
        continue;
      }

      // Create User
      const hashedPassword = await bcrypt.hash(ownerData.user.password, 10);
      const user = await User.create({
        ...ownerData.user,
        password_hash: hashedPassword,
        user_type: "pet_owner",
      });
      console.log(`Created pet owner user: ${user.email}`);

      // Create PetOwner
      const petOwner = await PetOwner.create({
        user_id: user.id,
        ...ownerData.petOwner,
      });
      console.log(`Created pet owner record for: ${user.email}`);

      // Create Pets
      for (const petData of ownerData.pets) {
        await Pet.create({
          owner_id: user.id,
          ...petData,
        });
        console.log(`Created pet: ${petData.name} (${petData.species})`);
      }
    }

    console.log("\n=== Seeding completed successfully! ===");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

// Run the seeding script
seedDatabase()
  .then(() => {
    console.log("Seeding script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding script failed:", error);
    process.exit(1);
  });

