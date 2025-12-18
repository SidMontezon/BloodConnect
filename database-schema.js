// BloodConnect Firebase Realtime Database Schema
// This file defines the database structure and provides sample data

const BloodConnectSchema = {
  // Users collection
  users: {
    // Structure: users/{userId}
    structure: {
      userId: {
        firstName: "string",
        lastName: "string", 
        email: "string",
        role: "string", // 'donor', 'hospital', 'patient', 'admin'
        phone: "string",
        address: "string",
        city: "string",
        state: "string",
        zipCode: "string",
        dateOfBirth: "string",
        bloodType: "string", // For donors
        isEligible: "boolean", // For donors
        lastDonationDate: "string", // For donors
        createdAt: "string",
        updatedAt: "string"
      }
    },
    sampleData: {
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
      }
    }
  },

  // Blood Inventory collection
  bloodInventory: {
    // Structure: bloodInventory/{inventoryId}
    structure: {
      inventoryId: {
        bloodType: "string", // A+, A-, B+, B-, AB+, AB-, O+, O-
        quantity: "number", // in units (1 unit = ~450ml)
        location: "string", // hospital or blood bank name
        expiryDate: "string",
        collectionDate: "string",
        donorId: "string", // reference to users
        status: "string", // 'available', 'reserved', 'used', 'expired'
        temperature: "string", // storage temperature
        notes: "string",
        createdAt: "string",
        updatedAt: "string"
      }
    },
    sampleData: {
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
      }
    }
  },

  // Blood Requests collection
  bloodRequests: {
    // Structure: bloodRequests/{requestId}
    structure: {
      requestId: {
        requesterId: "string", // user ID of hospital/patient
        requesterType: "string", // 'hospital', 'patient'
        bloodType: "string",
        quantity: "number",
        urgency: "string", // 'low', 'medium', 'high', 'critical'
        reason: "string",
        patientName: "string",
        patientAge: "number",
        patientWeight: "number",
        hospitalName: "string",
        contactPerson: "string",
        contactPhone: "string",
        status: "string", // 'pending', 'approved', 'rejected', 'fulfilled', 'cancelled'
        requestedDate: "string",
        requiredDate: "string",
        fulfilledDate: "string",
        notes: "string",
        createdAt: "string",
        updatedAt: "string"
      }
    },
    sampleData: {
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
      }
    }
  },

  // Donations collection
  donations: {
    // Structure: donations/{donationId}
    structure: {
      donationId: {
        donorId: "string", // reference to users
        bloodType: "string",
        quantity: "number",
        donationDate: "string",
        location: "string",
        collectionMethod: "string", // 'whole_blood', 'platelets', 'plasma'
        hemoglobin: "number",
        bloodPressure: "string",
        pulse: "number",
        temperature: "number",
        weight: "number",
        eligibilityCheck: "object", // health screening results
        status: "string", // 'completed', 'deferred', 'rejected'
        notes: "string",
        createdAt: "string",
        updatedAt: "string"
      }
    },
    sampleData: {
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
      }
    }
  },

  // Hospitals collection
  hospitals: {
    // Structure: hospitals/{hospitalId}
    structure: {
      hospitalId: {
        name: "string",
        address: "string",
        city: "string",
        state: "string",
        zipCode: "string",
        phone: "string",
        email: "string",
        licenseNumber: "string",
        contactPerson: "string",
        bloodBankLicense: "string",
        storageCapacity: "number",
        currentInventory: "object",
        isActive: "boolean",
        createdAt: "string",
        updatedAt: "string"
      }
    },
    sampleData: {
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
      }
    }
  },

  // Notifications collection
  notifications: {
    // Structure: notifications/{notificationId}
    structure: {
      notificationId: {
        userId: "string",
        type: "string", // 'request', 'donation', 'inventory', 'system'
        title: "string",
        message: "string",
        isRead: "boolean",
        priority: "string", // 'low', 'medium', 'high', 'urgent'
        actionUrl: "string",
        createdAt: "string"
      }
    },
    sampleData: {
      "notif001": {
        userId: "user001",
        type: "donation",
        title: "Donation Successful",
        message: "Your blood donation has been successfully processed and added to inventory.",
        isRead: false,
        priority: "medium",
        actionUrl: "/donor-dashboard",
        createdAt: "2024-01-15T10:30:00.000Z"
      }
    }
  },

  // System Settings
  systemSettings: {
    structure: {
      bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      donationIntervals: {
        whole_blood: 56, // days
        platelets: 7, // days
        plasma: 28 // days
      },
      storageConditions: {
        temperature: "1-6°C",
        humidity: "40-60%",
        maxStorageDays: 42
      },
      eligibilityCriteria: {
        minAge: 18,
        maxAge: 65,
        minWeight: 50, // kg
        minHemoglobin: 12.5 // g/dL for women, 13.5 for men
      }
    }
  }
};

// Export schema for use in other files
window.BloodConnectSchema = BloodConnectSchema;

// Helper functions for schema validation
window.SchemaValidators = {
  validateUser: (userData) => {
    const required = ['firstName', 'lastName', 'email', 'role'];
    return required.every(field => userData[field]);
  },

  validateBloodInventory: (inventoryData) => {
    const required = ['bloodType', 'quantity', 'location', 'expiryDate'];
    return required.every(field => inventoryData[field]);
  },

  validateBloodRequest: (requestData) => {
    const required = ['requesterId', 'bloodType', 'quantity', 'urgency'];
    return required.every(field => requestData[field]);
  },

  validateDonation: (donationData) => {
    const required = ['donorId', 'bloodType', 'quantity', 'donationDate'];
    return required.every(field => donationData[field]);
  }
};

console.log('BloodConnect Database Schema loaded successfully!');
