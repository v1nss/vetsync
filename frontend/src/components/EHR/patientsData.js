// Sample patients data
const patientsData = [
  {
    id: 'PET-2024-001', 
    name: 'Luna', 
    species: 'Cat', 
    breed: 'Persian', 
    age: '2 years', 
    gender: 'Female', 
    weight: '4.5 kg', 
    lastVisit: 'Dec 18, 2024', 
    dateOfBirth: 'August 20, 2022', 
    registration: 'September 15, 2022', 
    nextAppointment: 'February 18, 2025', 
    primaryVet: 'Dr. Santos', 
    status: 'Active',
    owner: {
      name: "Maria Cruz",
      phone: "0917-123-4567",
      email: "maria.cruz@example.com",
      address: '789 Maple Drive, City, ST 12345'
    },
    prescriptions: [
      {
        medication: "Carprofen",
        dosage: "50mg twice daily",
        date: "2025-02-10",
        instructions: "Give with food",
        prescribedBy: "Dr. Santos"
      }
    ],
    labResults: [
      {
        testName: "CBC",
        value: "Normal",
        normalRange: "Standard",
        date: "2025-01-22"
      }
    ],
    vaccinations: [
      {
        vaccine: "Rabies Vaccine",
        date: "2024-12-01",
        nextDose: "2025-12-01"
      }
    ]
  },
  {
    id: 'PET-2024-002', 
    name: 'Kerai', 
    species: 'Dog', 
    breed: 'Aspin', 
    age: '4 years', 
    gender: 'Male', 
    weight: '12 kg', 
    lastVisit: 'Dec 18, 2024', 
    dateOfBirth: 'May 21, 2022', 
    registration: 'September 15, 2022', 
    nextAppointment: 'February 18, 2025', 
    primaryVet: 'Dr. Santos', 
    status: 'Active',
    owner: {
      name: "Maria Cruz",
      phone: "0917-123-4567",
      email: "maria.cruz@example.com",
      address: '789 Maple Drive, City, ST 12345'
    },
    prescriptions: [
      {
        medication: "Carprofen",
        dosage: "50mg twice daily",
        date: "2025-02-10",
        instructions: "Give with food",
        prescribedBy: "Dr. Santos"
      }
    ],
    labResults: [
      {
        testName: "CBC",
        value: "Normal",
        normalRange: "Standard",
        date: "2025-01-22"
      }
    ],
    vaccinations: [
      {
        vaccine: "Rabies Vaccine",
        date: "2024-12-01",
        nextDose: "2025-12-01"
      }
    ]
  },
  {
    id: 'PET-2024-003', 
    name: 'Bochog', 
    species: 'Goldie', 
    breed: 'Golden Retriever', 
    age: '2 years', 
    gender: 'Male', 
    weight: '15 kg', 
    lastVisit: 'Jan 15, 2026', 
    dateOfBirth: 'February 21, 2024', 
    registration: 'September 15, 2022', 
    nextAppointment: 'February 18, 2026', 
    primaryVet: 'Dr. Cruz', 
    status: 'Active',
    owner: {
      name: "John Doe",
      phone: "0912-123-4567",
      email: "john.doe@example.com",
      address: '152 Brgy. Tambo, Parañaque City, ST 12345'
    },
    prescriptions: [
      {
        medication: "Carprofen",
        dosage: "50mg twice daily",
        date: "2025-02-10",
        instructions: "Give with food",
        prescribedBy: "Dr. Santos"
      }
    ],
    labResults: [
      {
        testName: "CBC",
        value: "Normal",
        normalRange: "Standard",
        date: "2025-01-22"
      }
    ],
    vaccinations: [
      {
        vaccine: "Rabies Vaccine",
        date: "2024-12-01",
        nextDose: "2025-12-01"
      }
    ]
  },
];

export default patientsData;