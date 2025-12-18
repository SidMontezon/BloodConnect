// bloodConnectDB.js

import './firebase-realtime.js'; // Ensure firebase-realtime.js runs and initializes window.bloodConnectDB

// Fallback functions if window.bloodConnectDB is not yet initialized
const fallback = {
  _once: async () => ({}),
  getUsers: async () => ({}),
  getDonations: async () => ({}),
  getDonationSchedules: async () => [],
  getHospitals: async () => ({}),
  getHospitalEvents: async () => [],
  getVerifications: async () => ({}),
  getDonors: async () => ({}),
  getBloodInventory: async () => ({}),
  getHospitalRequests: async () => ({}),
  updateVerificationStatus: async () => ({ success: true }),
  updateUser: async () => ({ success: true }),
  createNotification: async () => ({ success: true }),
  addBloodInventory: async () => ({ success: true, id: null }),
  updateBloodInventory: async () => ({ success: true }),
  getBloodRequests: async () => ({}),
  getDonationSchedule: async () => null,
  updateDonationSchedule: async () => ({ success: true }),
  createHospitalEvent: async () => ({ success: true, id: null }),
  scheduleDonation: async () => ({ success: true }),
  createDonationSchedule: async () => ({ success: true }),
  updateDonationScheduleStatus: async () => ({ success: true }),
  getDonationSchedules: async () => []
};

// Real implementations using global window.bloodConnectDB instance
const bloodConnectDB = window.bloodConnectDB || {};

// ✅ ONLY FIX HERE: remove the broken `.database` check
async function getNotifications() {
  try {
    if (window.bloodConnectDB.getNotifications) {
      return await window.bloodConnectDB.getNotifications();
    }
    return {};
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    return {};
  }
}

async function getUsers() {
  try {
    if (window.bloodConnectDB.getUsers) {
      const users = await window.bloodConnectDB.getUsers();
      return users || {};
    }
    return {};
  } catch (err) {
    console.error('Failed to fetch users:', err);
    return {};
  }
}

// Provide fallbacks if methods missing on window.bloodConnectDB
bloodConnectDB.getNotifications =
  bloodConnectDB.getNotifications || getNotifications;

bloodConnectDB.getUsers =
  bloodConnectDB.getUsers || getUsers;

// Merge fallback methods if missing
for (const fn in fallback) {
  if (!bloodConnectDB[fn]) {
    bloodConnectDB[fn] = fallback[fn];
  }
}

window.bloodConnectDB = bloodConnectDB;
export default bloodConnectDB;
