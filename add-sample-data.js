// Script to add comprehensive sample data to BloodConnect Firebase Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
  authDomain: "bloodconnect-b5142.firebaseapp.com",
  databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
  projectId: "bloodconnect-b5142",
  storageBucket: "bloodconnect-b5142.firebasestorage.app",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample data for BloodConnect system
const sampleData = {
  users: {
    "user001": {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      role: "donor",
      phone: "+1234567890",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      dateOfBirth: "1990-05-15",
      bloodType: "O+",
      isEligible: true,
      lastDonationDate: "2024-01-15",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    "user002": {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@hospital.com",
      role: "hospital",
      phone: "+1234567891",
      address: "456 Hospital Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      hospitalName: "City General Hospital",
      licenseNumber: "HOSP001",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    "user003": {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@email.com",
      role: "donor",
      phone: "+1234567892",
      address: "789 Oak St",
      city: "New York",
      state: "NY",
      zipCode: "10003",
      dateOfBirth: "1985-08-20",
      bloodType: "A+",
      isEligible: true,
      lastDonationDate: "2024-01-10",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-10T14:20:00.000Z"
    },
    "user004": {
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@email.com",
      role: "patient",
      phone: "+1234567893",
      address: "321 Pine St",
      city: "New York",
      state: "NY",
      zipCode: "10004",
      dateOfBirth: "1992-03-10",
      bloodType: "B+",
      medicalCondition: "Surgery scheduled",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    "user005": {
      firstName: "Dr. Robert",
      lastName: "Brown",
      email: "robert.brown@hospital.com",
      role: "admin",
      phone: "+1234567894",
      address: "654 Medical Center Dr",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      hospitalName: "Metro Medical Center",
      licenseNumber: "HOSP002",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    }
  },

  bloodInventory: {
    "inv001": {
      bloodType: "O+",
      quantity: 2,
      location: "City General Hospital",
      expiryDate: "2024-02-15",
      collectionDate: "2024-01-15",
      donorId: "user001",
      status: "available",
      temperature: "4°C",
      notes: "Fresh donation, excellent quality",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    "inv002": {
      bloodType: "A+",
      quantity: 1,
      location: "City General Hospital",
      expiryDate: "2024-02-10",
      collectionDate: "2024-01-10",
      donorId: "user003",
      status: "reserved",
      temperature: "4°C",
      notes: "Reserved for emergency surgery",
      createdAt: "2024-01-10T14:20:00.000Z",
      updatedAt: "2024-01-12T09:15:00.000Z"
    },
    "inv003": {
      bloodType: "B+",
      quantity: 3,
      location: "Metro Medical Center",
      expiryDate: "2024-02-20",
      collectionDate: "2024-01-12",
      donorId: "user006",
      status: "available",
      temperature: "4°C",
      notes: "Multiple units from same donor",
      createdAt: "2024-01-12T11:45:00.000Z",
      updatedAt: "2024-01-12T11:45:00.000Z"
    },
    "inv004": {
      bloodType: "AB-",
      quantity: 1,
      location: "City General Hospital",
      expiryDate: "2024-02-05",
      collectionDate: "2024-01-08",
      donorId: "user007",
      status: "available",
      temperature: "4°C",
      notes: "Rare blood type, high demand",
      createdAt: "2024-01-08T16:30:00.000Z",
      updatedAt: "2024-01-08T16:30:00.000Z"
    },
    "inv005": {
      bloodType: "O-",
      quantity: 2,
      location: "Metro Medical Center",
      expiryDate: "2024-02-18",
      collectionDate: "2024-01-14",
      donorId: "user008",
      status: "available",
      temperature: "4°C",
      notes: "Universal donor blood",
      createdAt: "2024-01-14T13:20:00.000Z",
      updatedAt: "2024-01-14T13:20:00.000Z"
    }
  },

  bloodRequests: {
    "req001": {
      requesterId: "user002",
      requesterType: "hospital",
      bloodType: "O+",
      quantity: 3,
      urgency: "high",
      reason: "Emergency surgery - car accident victim",
      patientName: "Robert Johnson",
      patientAge: 35,
      patientWeight: 70,
      hospitalName: "City General Hospital",
      contactPerson: "Dr. Sarah Wilson",
      contactPhone: "+1234567892",
      status: "pending",
      requestedDate: "2024-01-16",
      requiredDate: "2024-01-17",
      fulfilledDate: null,
      notes: "Patient needs immediate surgery",
      createdAt: "2024-01-16T08:30:00.000Z",
      updatedAt: "2024-01-16T08:30:00.000Z"
    },
    "req002": {
      requesterId: "user005",
      requesterType: "hospital",
      bloodType: "A+",
      quantity: 2,
      urgency: "medium",
      reason: "Scheduled surgery - heart bypass",
      patientName: "Mary Davis",
      patientAge: 58,
      patientWeight: 65,
      hospitalName: "Metro Medical Center",
      contactPerson: "Dr. Robert Brown",
      contactPhone: "+1234567894",
      status: "approved",
      requestedDate: "2024-01-14",
      requiredDate: "2024-01-20",
      fulfilledDate: null,
      notes: "Scheduled for next week",
      createdAt: "2024-01-14T10:15:00.000Z",
      updatedAt: "2024-01-15T14:30:00.000Z"
    },
    "req003": {
      requesterId: "user004",
      requesterType: "patient",
      bloodType: "B+",
      quantity: 1,
      urgency: "low",
      reason: "Regular transfusion for anemia",
      patientName: "Sarah Wilson",
      patientAge: 32,
      patientWeight: 55,
      hospitalName: "City General Hospital",
      contactPerson: "Dr. Lisa Chen",
      contactPhone: "+1234567895",
      status: "fulfilled",
      requestedDate: "2024-01-10",
      requiredDate: "2024-01-12",
      fulfilledDate: "2024-01-12",
      notes: "Successfully completed",
      createdAt: "2024-01-10T09:00:00.000Z",
      updatedAt: "2024-01-12T15:45:00.000Z"
    }
  },

  donations: {
    "don001": {
      donorId: "user001",
      bloodType: "O+",
      quantity: 1,
      donationDate: "2024-01-15",
      location: "City General Hospital",
      collectionMethod: "whole_blood",
      hemoglobin: 14.5,
      bloodPressure: "120/80",
      pulse: 72,
      temperature: 98.6,
      weight: 70,
      eligibilityCheck: {
        passed: true,
        healthQuestions: "all_clear",
        physicalExam: "normal"
      },
      status: "completed",
      notes: "Successful donation, donor felt well",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    "don002": {
      donorId: "user003",
      bloodType: "A+",
      quantity: 1,
      donationDate: "2024-01-10",
      location: "City General Hospital",
      collectionMethod: "whole_blood",
      hemoglobin: 13.8,
      bloodPressure: "118/75",
      pulse: 68,
      temperature: 98.4,
      weight: 75,
      eligibilityCheck: {
        passed: true,
        healthQuestions: "all_clear",
        physicalExam: "normal"
      },
      status: "completed",
      notes: "Regular donor, excellent health",
      createdAt: "2024-01-10T14:20:00.000Z",
      updatedAt: "2024-01-10T14:20:00.000Z"
    },
    "don003": {
      donorId: "user006",
      bloodType: "B+",
      quantity: 1,
      donationDate: "2024-01-12",
      location: "Metro Medical Center",
      collectionMethod: "whole_blood",
      hemoglobin: 15.2,
      bloodPressure: "125/82",
      pulse: 75,
      temperature: 98.7,
      weight: 80,
      eligibilityCheck: {
        passed: true,
        healthQuestions: "all_clear",
        physicalExam: "normal"
      },
      status: "completed",
      notes: "First-time donor, very healthy",
      createdAt: "2024-01-12T11:45:00.000Z",
      updatedAt: "2024-01-12T11:45:00.000Z"
    }
  },

  hospitals: {
    "hosp001": {
      name: "City General Hospital",
      address: "456 Hospital Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      phone: "+1234567891",
      email: "info@citygeneral.com",
      licenseNumber: "HOSP001",
      contactPerson: "Dr. Sarah Wilson",
      bloodBankLicense: "BB001",
      storageCapacity: 1000,
      currentInventory: {
        "O+": 15,
        "O-": 8,
        "A+": 12,
        "A-": 6,
        "B+": 10,
        "B-": 4,
        "AB+": 3,
        "AB-": 2
      },
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    "hosp002": {
      name: "Metro Medical Center",
      address: "789 Medical Plaza",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      phone: "+1234567894",
      email: "info@metromedical.com",
      licenseNumber: "HOSP002",
      contactPerson: "Dr. Robert Brown",
      bloodBankLicense: "BB002",
      storageCapacity: 800,
      currentInventory: {
        "O+": 12,
        "O-": 5,
        "A+": 8,
        "A-": 4,
        "B+": 6,
        "B-": 3,
        "AB+": 2,
        "AB-": 1
      },
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    }
  },

  notifications: {
    "notif001": {
      userId: "user001",
      type: "donation",
      title: "Donation Successful",
      message: "Your blood donation has been successfully processed and added to inventory.",
      isRead: false,
      priority: "medium",
      actionUrl: "/donor-dashboard",
      createdAt: "2024-01-15T10:30:00.000Z"
    },
    "notif002": {
      userId: "user002",
      type: "request",
      title: "New Blood Request",
      message: "A new blood request for O+ blood has been submitted and is pending approval.",
      isRead: false,
      priority: "high",
      actionUrl: "/admin-requests",
      createdAt: "2024-01-16T08:30:00.000Z"
    },
    "notif003": {
      userId: "user003",
      type: "inventory",
      title: "Blood Inventory Update",
      message: "Your donated blood has been added to the inventory and is now available for patients.",
      isRead: true,
      priority: "low",
      actionUrl: "/donor-dashboard",
      createdAt: "2024-01-10T14:20:00.000Z"
    }
  },

  systemSettings: {
    bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    donationIntervals: {
      whole_blood: 56,
      platelets: 7,
      plasma: 28
    },
    storageConditions: {
      temperature: "1-6°C",
      humidity: "40-60%",
      maxStorageDays: 42
    },
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      minWeight: 50,
      minHemoglobin: 12.5
    }
  }
};

// Function to add sample data to Firebase
async function addSampleData() {
  try {
    console.log('Starting to add sample data to Firebase Realtime Database...');
    
    // Add users
    console.log('Adding users...');
    await set(ref(database, 'users'), sampleData.users);
    
    // Add blood inventory
    console.log('Adding blood inventory...');
    await set(ref(database, 'bloodInventory'), sampleData.bloodInventory);
    
    // Add blood requests
    console.log('Adding blood requests...');
    await set(ref(database, 'bloodRequests'), sampleData.bloodRequests);
    
    // Add donations
    console.log('Adding donations...');
    await set(ref(database, 'donations'), sampleData.donations);
    
    // Add hospitals
    console.log('Adding hospitals...');
    await set(ref(database, 'hospitals'), sampleData.hospitals);
    
    // Add notifications
    console.log('Adding notifications...');
    await set(ref(database, 'notifications'), sampleData.notifications);
    
    // Add system settings
    console.log('Adding system settings...');
    await set(ref(database, 'systemSettings'), sampleData.systemSettings);
    
    console.log('✅ Sample data added successfully to Firebase Realtime Database!');
    console.log('📊 Data Summary:');
    console.log(`- Users: ${Object.keys(sampleData.users).length}`);
    console.log(`- Blood Inventory: ${Object.keys(sampleData.bloodInventory).length}`);
    console.log(`- Blood Requests: ${Object.keys(sampleData.bloodRequests).length}`);
    console.log(`- Donations: ${Object.keys(sampleData.donations).length}`);
    console.log(`- Hospitals: ${Object.keys(sampleData.hospitals).length}`);
    console.log(`- Notifications: ${Object.keys(sampleData.notifications).length}`);
    
    return { success: true, message: 'Sample data added successfully!' };
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    return { success: false, message: error.message };
  }
}

// Function to clear all data (use with caution!)
async function clearAllData() {
  try {
    console.log('⚠️ Clearing all data from Firebase Realtime Database...');
    await set(ref(database, ''), null);
    console.log('✅ All data cleared successfully!');
    return { success: true, message: 'All data cleared successfully!' };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return { success: false, message: error.message };
  }
}

// Export functions for use in other files
window.addSampleData = addSampleData;
window.clearAllData = clearAllData;
window.sampleData = sampleData;

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined') {
  console.log('Sample data script loaded. Use addSampleData() to populate the database.');
}

console.log('BloodConnect Sample Data Script loaded successfully!');
