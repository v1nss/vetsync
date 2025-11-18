const petsData = [
  {
    id: "PET-001",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: "4 years",
    gender: "Male",
    color: "Golden",
    weight: "32 kg",
    lastVisit: "2025-01-10",
    photo: null,
    appointmentHistory: [
      {
        date: "2025-01-10",
        reason: "Annual Wellness Exam",
        veterinarian: "Sarah Johnson",
        status: "Completed",
        notes: "Patient is in excellent health. All vital signs normal. Recommended continuing current diet and exercise routine.",
        labResults: [
          {
            test: "Complete Blood Count (CBC)",
            value: "Normal",
            range: "Within normal limits",
            status: "Normal",
            notes: "All blood cell counts are within healthy range."
          },
          {
            test: "Heartworm Test",
            value: "Negative",
            range: "Negative",
            status: "Normal",
            notes: "No heartworm detected. Continue preventive medication."
          }
        ],
        vaccines: [
          {
            name: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
            type: "Core",
            lotNumber: "DHV-2025-0142",
            nextDue: "2026-01-10",
            notes: "No adverse reactions observed."
          },
          {
            name: "Rabies Vaccine",
            type: "Core",
            lotNumber: "RAB-2025-0089",
            nextDue: "2028-01-10",
            notes: "3-year vaccine administered."
          }
        ],
        prescriptions: [
          {
            medication: "Heartgard Plus",
            dosage: "51-100 lbs chewable",
            frequency: "Once monthly",
            duration: "12 months",
            status: "Active",
            instructions: "Give on the same day each month. Can be given with or without food."
          }
        ]
      },
      {
        date: "2024-07-15",
        reason: "Skin Allergy Consultation",
        veterinarian: "Michael Chen",
        status: "Completed",
        notes: "Patient presented with itching and mild skin irritation. Diagnosed with seasonal allergies.",
        labResults: [
          {
            test: "Skin Scraping",
            value: "No parasites found",
            range: "Negative",
            status: "Normal",
            notes: "Ruled out parasitic infection."
          }
        ],
        vaccines: [],
        prescriptions: [
          {
            medication: "Apoquel (Oclacitinib)",
            dosage: "16 mg",
            frequency: "Twice daily",
            duration: "30 days",
            status: "Completed",
            instructions: "Give with food. Monitor for any digestive issues."
          },
          {
            medication: "Medicated Shampoo",
            dosage: "As needed",
            frequency: "2-3 times per week",
            duration: "Ongoing",
            status: "Active",
            instructions: "Lather and leave on for 10 minutes before rinsing."
          }
        ]
      }
    ]
  },
  {
    id: "PET-002",
    name: "Mochi",
    species: "Cat",
    breed: "Scottish Fold",
    age: "2 years",
    gender: "Female",
    color: "Gray",
    weight: "4.2 kg",
    lastVisit: "2025-02-02",
    photo: null,
    appointmentHistory: [
      {
        date: "2025-02-02",
        reason: "Spay Surgery Follow-up",
        veterinarian: "Emily Rodriguez",
        status: "Completed",
        notes: "Post-operative check. Incision healing well. Sutures removed successfully.",
        labResults: [],
        vaccines: [],
        prescriptions: [
          {
            medication: "Gabapentin",
            dosage: "50 mg",
            frequency: "Twice daily",
            duration: "5 days",
            status: "Completed",
            instructions: "Give for pain management. Can cause drowsiness."
          }
        ]
      },
      {
        date: "2025-01-15",
        reason: "Spay Surgery",
        veterinarian: "Emily Rodriguez",
        status: "Completed",
        notes: "Ovariohysterectomy performed successfully. Patient recovered well from anesthesia.",
        labResults: [
          {
            test: "Pre-Anesthetic Blood Panel",
            value: "Normal",
            range: "All values WNL",
            status: "Normal",
            notes: "Cleared for anesthesia."
          }
        ],
        vaccines: [],
        prescriptions: [
          {
            medication: "Buprenorphine",
            dosage: "0.02 mg/kg",
            frequency: "Every 8-12 hours",
            duration: "3 days",
            status: "Completed",
            instructions: "Pain relief. Apply to gums or inner cheek."
          },
          {
            medication: "E-collar (Cone)",
            dosage: "Size Small",
            frequency: "Continuous wear",
            duration: "10-14 days",
            status: "Completed",
            instructions: "Prevent licking surgical site until fully healed."
          }
        ]
      },
      {
        date: "2024-11-20",
        reason: "Vaccination Appointment",
        veterinarian: "Sarah Johnson",
        status: "Completed",
        notes: "Routine vaccination. Patient is healthy and active.",
        labResults: [],
        vaccines: [
          {
            name: "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
            type: "Core",
            lotNumber: "FVR-2024-0567",
            nextDue: "2027-11-20",
            notes: "3-year booster administered."
          },
          {
            name: "Rabies Vaccine",
            type: "Core",
            lotNumber: "RAB-2024-0234",
            nextDue: "2027-11-20",
            notes: "No adverse reactions."
          }
        ],
        prescriptions: []
      }
    ]
  },
  {
    id: "PET-003",
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: "3 years",
    gender: "Male",
    color: "Tri-color",
    weight: "12 kg",
    lastVisit: "2024-12-28",
    photo: null,
    appointmentHistory: [
      {
        date: "2024-12-28",
        reason: "Ear Infection Treatment",
        veterinarian: "Michael Chen",
        status: "Completed",
        notes: "Bilateral otitis externa diagnosed. Ears cleaned and treated.",
        labResults: [
          {
            test: "Ear Cytology",
            value: "Yeast present",
            range: "Should be negative",
            status: "Abnormal",
            notes: "Malassezia yeast infection confirmed."
          }
        ],
        vaccines: [],
        prescriptions: [
          {
            medication: "Otomax Ointment",
            dosage: "Apply to affected ears",
            frequency: "Twice daily",
            duration: "14 days",
            status: "Active",
            instructions: "Clean ears before application. Massage base of ear after applying."
          },
          {
            medication: "Apoquel (Oclacitinib)",
            dosage: "5.4 mg",
            frequency: "Twice daily",
            duration: "14 days",
            status: "Active",
            instructions: "Give with food to reduce itching and inflammation."
          }
        ]
      },
      {
        date: "2024-09-10",
        reason: "Annual Exam & Vaccinations",
        veterinarian: "Sarah Johnson",
        status: "Completed",
        notes: "Routine wellness exam. Patient is healthy. Minor plaque buildup noted - recommend dental cleaning within 6 months.",
        labResults: [
          {
            test: "Fecal Examination",
            value: "Negative",
            range: "No parasites",
            status: "Normal",
            notes: "No intestinal parasites detected."
          }
        ],
        vaccines: [
          {
            name: "DHPP Booster",
            type: "Core",
            lotNumber: "DHV-2024-0892",
            nextDue: "2025-09-10",
            notes: "Annual booster given."
          },
          {
            name: "Leptospirosis",
            type: "Non-Core",
            lotNumber: "LEP-2024-0445",
            nextDue: "2025-09-10",
            notes: "Recommended for dogs with outdoor exposure."
          },
          {
            name: "Bordetella",
            type: "Non-Core",
            lotNumber: "BOR-2024-0678",
            nextDue: "2025-09-10",
            notes: "Kennel cough prevention."
          }
        ],
        prescriptions: [
          {
            medication: "Simparica Trio",
            dosage: "11.1-22 lbs chewable",
            frequency: "Once monthly",
            duration: "12 months",
            status: "Active",
            instructions: "Flea, tick, and heartworm prevention. Give on the same date each month."
          }
        ]
      }
    ]
  },
  {
    id: "PET-004",
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: "5 years",
    gender: "Female",
    color: "White",
    weight: "5.1 kg",
    lastVisit: "2025-01-20",
    photo: null,
    appointmentHistory: [
      {
        date: "2025-01-20",
        reason: "Dental Cleaning & Exam",
        veterinarian: "Emily Rodriguez",
        status: "Completed",
        notes: "Professional dental cleaning performed under anesthesia. Two teeth extracted due to severe periodontal disease. Patient recovered well.",
        labResults: [
          {
            test: "Pre-Anesthetic Bloodwork",
            value: "Normal",
            range: "All parameters WNL",
            status: "Normal",
            notes: "Kidney and liver values normal. Safe for anesthesia."
          },
          {
            test: "Dental Radiographs",
            value: "Two teeth with bone loss",
            range: "N/A",
            status: "Abnormal",
            notes: "Teeth #108 and #208 showed significant periodontal disease and were extracted."
          }
        ],
        vaccines: [],
        prescriptions: [
          {
            medication: "Buprenorphine SR",
            dosage: "Single injection",
            frequency: "One time",
            duration: "72 hours pain relief",
            status: "Completed",
            instructions: "Long-acting pain medication given during procedure."
          },
          {
            medication: "Clavamox (Amoxicillin-Clavulanate)",
            dosage: "62.5 mg",
            frequency: "Twice daily",
            duration: "10 days",
            status: "Active",
            instructions: "Antibiotic. Give with food to prevent nausea."
          },
          {
            medication: "Soft Food Diet",
            dosage: "As needed",
            frequency: "For 7-10 days",
            duration: "Until healed",
            status: "Active",
            instructions: "Feed soft/wet food only during recovery period."
          }
        ]
      },
      {
        date: "2024-08-05",
        reason: "Upper Respiratory Infection",
        veterinarian: "Michael Chen",
        status: "Completed",
        notes: "Patient presented with sneezing, nasal discharge, and decreased appetite. Diagnosed with URI.",
        labResults: [],
        vaccines: [],
        prescriptions: [
          {
            medication: "Clavamox Drops",
            dosage: "1 mL",
            frequency: "Twice daily",
            duration: "14 days",
            status: "Completed",
            instructions: "Shake well before use. Give directly into mouth."
          },
          {
            medication: "L-Lysine Supplement",
            dosage: "250 mg",
            frequency: "Twice daily",
            duration: "30 days",
            status: "Completed",
            instructions: "Immune support supplement. Mix with food."
          }
        ]
      },
      {
        date: "2024-05-12",
        reason: "Annual Wellness Check",
        veterinarian: "Sarah Johnson",
        status: "Completed",
        notes: "Routine exam. Patient is healthy but has dental tartar buildup. Scheduled dental cleaning.",
        labResults: [
          {
            test: "Senior Blood Panel",
            value: "All values normal",
            range: "WNL",
            status: "Normal",
            notes: "Thyroid, kidney, and liver function all normal for age."
          }
        ],
        vaccines: [
          {
            name: "FVRCP Booster",
            type: "Core",
            lotNumber: "FVR-2024-0123",
            nextDue: "2025-05-12",
            notes: "Annual booster administered."
          }
        ],
        prescriptions: []
      }
    ]
  },
  {
    id: "PET-005",
    name: "Rocky",
    species: "Dog",
    breed: "Bulldog",
    age: "6 years",
    gender: "Male",
    color: "Brown",
    weight: "25 kg",
    lastVisit: "2024-11-15",
    photo: null,
    appointmentHistory: [
      {
        date: "2024-11-15",
        reason: "Skin Fold Dermatitis Treatment",
        veterinarian: "Michael Chen",
        status: "Completed",
        notes: "Facial fold dermatitis with secondary bacterial infection. Cleaned and treated affected areas.",
        labResults: [
          {
            test: "Skin Culture",
            value: "Staphylococcus bacteria",
            range: "Should be negative",
            status: "Abnormal",
            notes: "Bacterial infection confirmed. Sensitive to prescribed antibiotic."
          }
        ],
        vaccines: [],
        prescriptions: [
          {
            medication: "Cephalexin",
            dosage: "500 mg",
            frequency: "Three times daily",
            duration: "21 days",
            status: "Active",
            instructions: "Antibiotic. Give with food. Complete entire course."
          },
          {
            medication: "Chlorhexidine Wipes",
            dosage: "As needed",
            frequency: "Daily cleaning",
            duration: "Ongoing",
            status: "Active",
            instructions: "Clean facial folds daily. Dry thoroughly after cleaning."
          },
          {
            medication: "Ketoconazole Cream",
            dosage: "Apply thin layer",
            frequency: "Twice daily",
            duration: "14 days",
            status: "Active",
            instructions: "Apply to affected skin folds after cleaning."
          }
        ]
      },
      {
        date: "2024-08-22",
        reason: "Breathing Difficulty Assessment",
        veterinarian: "Emily Rodriguez",
        status: "Completed",
        notes: "Brachycephalic obstructive airway syndrome (BOAS) evaluation. Moderate stenotic nares noted. Recommended weight management and monitoring.",
        labResults: [
          {
            test: "Chest X-Ray",
            value: "Mild tracheal narrowing",
            range: "Normal trachea size",
            status: "Borderline",
            notes: "Consistent with breed. No immediate surgical intervention needed."
          }
        ],
        vaccines: [],
        prescriptions: [
          {
            medication: "Weight Management Diet",
            dosage: "2 cups daily",
            frequency: "Split into 2 meals",
            duration: "Ongoing",
            status: "Active",
            instructions: "Weight loss will help breathing. Target weight: 22 kg."
          }
        ]
      },
      {
        date: "2024-05-30",
        reason: "Annual Exam & Vaccinations",
        veterinarian: "Sarah Johnson",
        status: "Completed",
        notes: "Routine wellness exam. Patient is overweight (27 kg, target 23 kg). Discussed diet and exercise plan.",
        labResults: [
          {
            test: "Complete Blood Count",
            value: "Normal",
            range: "WNL",
            status: "Normal"
          },
          {
            test: "Chemistry Panel",
            value: "Slightly elevated cholesterol",
            range: "100-270 mg/dL",
            status: "Borderline",
            notes: "Cholesterol at 285 mg/dL. Related to obesity. Recheck after weight loss."
          }
        ],
        vaccines: [
          {
            name: "DHPP Annual Booster",
            type: "Core",
            lotNumber: "DHV-2024-0556",
            nextDue: "2025-05-30"
          },
          {
            name: "Rabies Vaccine",
            type: "Core",
            lotNumber: "RAB-2024-0198",
            nextDue: "2027-05-30",
            notes: "3-year vaccine."
          }
        ],
        prescriptions: [
          {
            medication: "NexGard Chewable",
            dosage: "24.1-60 lbs",
            frequency: "Once monthly",
            duration: "12 months",
            status: "Active",
            instructions: "Flea and tick prevention. Give on same day each month."
          }
        ]
      }
    ]
  }
];

export default petsData;