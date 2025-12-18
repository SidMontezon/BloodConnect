// Simple Realtime DB helper. Attaches window.bloodConnectDB.
/*
  This file delegates to the richer Realtime DB implementation in
  `firebase-realtime.js`. That module initializes Firebase and creates
  a `window.bloodConnectDB` instance with a full set of helpers.

  If for some reason `firebase-realtime.js` isn't present or hasn't
  initialized, provide a small fallback surface so existing pages
  won't completely break (they'll receive empty responses).
*/

import './firebase-realtime.js';

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

const bloodConnectDB = window.bloodConnectDB || fallback;

window.bloodConnectDB = bloodConnectDB;
export default bloodConnectDB;
