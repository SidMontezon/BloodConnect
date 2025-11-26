import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue, off, remove, update, query, orderByChild, equalTo, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Firebase configuration (same as your existing config)
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

// Database reference helper
const getDbRef = (path) => ref(database, path);

// BloodConnect Realtime Database Manager
class BloodConnectRealtimeDB {
  constructor() {
    this.database = database;
  }

  // User Management
  async createUser(userId, userData) {
    try {
      await set(getDbRef(`users/${userId}`), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUser(userId) {
    try {
      const snapshot = await get(getDbRef(`users/${userId}`));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUser(userId, userData) {
    try {
      await update(getDbRef(`users/${userId}`), {
        ...userData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Blood Inventory Management
  async addBloodInventory(inventoryData) {
    try {
      const newInventoryRef = push(getDbRef('bloodInventory'));
      await set(newInventoryRef, {
        ...inventoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newInventoryRef.key, message: 'Blood inventory added successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getBloodInventory() {
    try {
      const snapshot = await get(getDbRef('bloodInventory'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting blood inventory:', error);
      return {};
    }
  }

  async updateBloodInventory(inventoryId, inventoryData) {
    try {
      await update(getDbRef(`bloodInventory/${inventoryId}`), {
        ...inventoryData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Blood inventory updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Blood Requests Management
  async createBloodRequest(requestData) {
    try {
      const newRequestRef = push(getDbRef('bloodRequests'));
      await set(newRequestRef, {
        ...requestData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newRequestRef.key, message: 'Blood request created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getBloodRequests() {
    try {
      const snapshot = await get(getDbRef('bloodRequests'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting blood requests:', error);
      return {};
    }
  }

  async updateBloodRequestStatus(requestId, status, updatedBy) {
    try {
      await update(getDbRef(`bloodRequests/${requestId}`), {
        status: status,
        updatedBy: updatedBy,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Blood request status updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Donation Records Management
  async recordDonation(donationData) {
    try {
      const newDonationRef = push(getDbRef('donations'));
      await set(newDonationRef, {
        ...donationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newDonationRef.key, message: 'Donation recorded successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getDonations() {
    try {
      const snapshot = await get(getDbRef('donations'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting donations:', error);
      return {};
    }
  }

  // Hospital Management
  async addHospital(hospitalData) {
    try {
      const newHospitalRef = push(getDbRef('hospitals'));
      await set(newHospitalRef, {
        ...hospitalData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newHospitalRef.key, message: 'Hospital added successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getHospitals() {
    try {
      const snapshot = await get(getDbRef('hospitals'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting hospitals:', error);
      return {};
    }
  }

  // Real-time Listeners
  listenToBloodInventory(callback) {
    const inventoryRef = getDbRef('bloodInventory');
    onValue(inventoryRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      callback(data);
    });
    return () => off(inventoryRef);
  }

  listenToBloodRequests(callback) {
    const requestsRef = getDbRef('bloodRequests');
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      callback(data);
    });
    return () => off(requestsRef);
  }

  listenToDonations(callback) {
    const donationsRef = getDbRef('donations');
    onValue(donationsRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      callback(data);
    });
    return () => off(donationsRef);
  }

  // Search and Filter Functions
  async searchBloodByType(bloodType) {
    try {
      const snapshot = await get(query(getDbRef('bloodInventory'), orderByChild('bloodType'), equalTo(bloodType)));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error searching blood by type:', error);
      return {};
    }
  }

  async searchRequestsByStatus(status) {
    try {
      const snapshot = await get(query(getDbRef('bloodRequests'), orderByChild('status'), equalTo(status)));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error searching requests by status:', error);
      return {};
    }
  }

  // Statistics and Analytics
  async getSystemStats() {
    try {
      const [inventorySnapshot, requestsSnapshot, donationsSnapshot] = await Promise.all([
        get(getDbRef('bloodInventory')),
        get(getDbRef('bloodRequests')),
        get(getDbRef('donations'))
      ]);

      const inventory = inventorySnapshot.exists() ? inventorySnapshot.val() : {};
      const requests = requestsSnapshot.exists() ? requestsSnapshot.val() : {};
      const donations = donationsSnapshot.exists() ? donationsSnapshot.val() : {};

      return {
        totalInventoryItems: Object.keys(inventory).length,
        totalRequests: Object.keys(requests).length,
        totalDonations: Object.keys(donations).length,
        pendingRequests: Object.values(requests).filter(req => req.status === 'pending').length,
        completedRequests: Object.values(requests).filter(req => req.status === 'completed').length
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      return {};
    }
  }

  // Upload collection data (for bulk uploads)
  async uploadCollectionData(collectionName, data) {
    try {
      await set(getDbRef(collectionName), data);
      return { success: true, message: `${collectionName} uploaded successfully` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get users (missing method)
  async getUsers() {
    try {
      const snapshot = await get(getDbRef('users'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting users:', error);
      return {};
    }
  }

  // Verification Management
  async createVerification(verificationData) {
    try {
      const newVerificationRef = push(getDbRef('verifications'));
      await set(newVerificationRef, {
        ...verificationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newVerificationRef.key, message: 'Verification created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getVerifications() {
    try {
      const snapshot = await get(getDbRef('verifications'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting verifications:', error);
      return {};
    }
  }

  async updateVerificationStatus(verificationId, status, reviewedBy, rejectionReason = null) {
    try {
      const updates = {
        verificationStatus: status,
        reviewedBy: reviewedBy,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (rejectionReason) {
        updates.rejectionReason = rejectionReason;
      }
      await update(getDbRef(`verifications/${verificationId}`), updates);
      return { success: true, message: 'Verification status updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Notification Management
  async createNotification(notificationData) {
    try {
      const newNotificationRef = push(getDbRef('notifications'));
      await set(newNotificationRef, {
        ...notificationData,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: newNotificationRef.key, message: 'Notification created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getNotifications(userId = null) {
    try {
      const snapshot = await get(getDbRef('notifications'));
      const notifications = snapshot.exists() ? snapshot.val() : {};
      if (userId) {
        return Object.entries(notifications)
          .filter(([id, notif]) => notif.userId === userId || notif.userId === 'admin')
          .map(([id, notif]) => ({ id, ...notif }));
      }
      return Object.entries(notifications).map(([id, notif]) => ({ id, ...notif }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      await update(getDbRef(`notifications/${notificationId}`), {
        isRead: true,
        readAt: new Date().toISOString()
      });
      return { success: true, message: 'Notification marked as read' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateNotification(notificationId, updateData) {
    try {
      await update(getDbRef(`notifications/${notificationId}`), {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Notification updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Hospital Events Management
  async createHospitalEvent(eventData) {
    try {
      const newEventRef = push(getDbRef('hospitalEvents'));
      await set(newEventRef, {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newEventRef.key, message: 'Hospital event created successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getHospitalEvents(hospitalId = null) {
    try {
      const snapshot = await get(getDbRef('hospitalEvents'));
      const events = snapshot.exists() ? snapshot.val() : {};
      if (hospitalId) {
        return Object.entries(events)
          .filter(([id, event]) => event.hospitalId === hospitalId)
          .map(([id, event]) => ({ id, ...event }));
      }
      return Object.entries(events).map(([id, event]) => ({ id, ...event }));
    } catch (error) {
      console.error('Error getting hospital events:', error);
      return [];
    }
  }

  // Donation Scheduling
  async scheduleDonation(donationData) {
    try {
      const newDonationRef = push(getDbRef('donationSchedules'));
      await set(newDonationRef, {
        ...donationData,
        status: donationData.status || 'pending_screening',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newDonationRef.key, message: 'Donation scheduled successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createDonationSchedule(donationData) {
    // Alias for scheduleDonation
    return this.scheduleDonation(donationData);
  }

  async getDonationSchedules(donorId = null) {
    try {
      const snapshot = await get(getDbRef('donationSchedules'));
      const schedules = snapshot.exists() ? snapshot.val() : {};
      if (donorId) {
        return Object.entries(schedules)
          .filter(([id, schedule]) => schedule.donorId === donorId)
          .map(([id, schedule]) => ({ id, ...schedule }));
      }
      return Object.entries(schedules).map(([id, schedule]) => ({ id, ...schedule }));
    } catch (error) {
      console.error('Error getting donation schedules:', error);
      return [];
    }
  }

  async updateDonationScheduleStatus(scheduleId, status, updatedBy) {
    try {
      await update(getDbRef(`donationSchedules/${scheduleId}`), {
        status: status,
        updatedBy: updatedBy,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Donation schedule status updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateDonationSchedule(scheduleId, updateData) {
    try {
      await update(getDbRef(`donationSchedules/${scheduleId}`), {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Donation schedule updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getDonationSchedule(scheduleId) {
    try {
      const snapshot = await get(getDbRef(`donationSchedules/${scheduleId}`));
      return snapshot.exists() ? { id: scheduleId, ...snapshot.val() } : null;
    } catch (error) {
      console.error('Error getting donation schedule:', error);
      return null;
    }
  }

  // Cleanup function
  cleanup() {
    // This would be called when the component/page is unmounted
    // to remove all listeners
    off(getDbRef('bloodInventory'));
    off(getDbRef('bloodRequests'));
    off(getDbRef('donations'));
  }
}

// Create global instance
const bloodConnectDB = new BloodConnectRealtimeDB();

// Export for use in other files
window.BloodConnectRealtimeDB = BloodConnectRealtimeDB;
window.bloodConnectDB = bloodConnectDB;

// Utility functions for common operations
window.realtimeDBUtils = {
  // Format data for display
  formatInventoryData: (inventory) => {
    return Object.entries(inventory).map(([id, data]) => ({
      id,
      ...data
    }));
  },

  // Format requests data
  formatRequestsData: (requests) => {
    return Object.entries(requests).map(([id, data]) => ({
      id,
      ...data
    }));
  },

  // Format donations data
  formatDonationsData: (donations) => {
    return Object.entries(donations).map(([id, data]) => ({
      id,
      ...data
    }));
  },

  // Get blood type statistics
  getBloodTypeStats: (inventory) => {
    const stats = {};
    Object.values(inventory).forEach(item => {
      const bloodType = item.bloodType;
      stats[bloodType] = (stats[bloodType] || 0) + (item.quantity || 0);
    });
    return stats;
  }
};

console.log('Firebase Realtime Database initialized successfully!');
