// Comprehensive BloodConnect Application Functions
// This file provides unified functionality for Donor, Admin, and Hospital roles

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, get, set, update, push, remove, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
  authDomain: "bloodconnect-b5142.firebaseapp.com",
  databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
  projectId: "bloodconnect-b5142",
  storageBucket: "bloodconnect-b5142.firebasestorage.app",
  messagingSenderId: "631993835929",
  appId: "1:631993835929:web:75554aca166e9058473308"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getDatabase();

// ===================== GENERAL APPLICATION FUNCTIONS =====================

export const appFunctions = {
  // ==================== Authentication ====================
  
  async getAuthUser() {
    return auth.currentUser;
  },

  async getUserData(uid) {
    try {
      const snapshot = await get(ref(db, `users/${uid}`));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  // ==================== DONOR FUNCTIONS ====================

  async getDonorDashboard(donorId) {
    try {
      const [userData, donations, schedules, events] = await Promise.all([
        this.getUserData(donorId),
        this.getDonations(),
        this.getDonationSchedules(donorId),
        this.getHospitalEvents()
      ]);

      return {
        userData,
        totalDonations: Object.keys(donations || {}).length,
        upcomingAppointments: (schedules || []).filter(s => s.status !== 'completed').length,
        livesSaved: Math.floor((Object.keys(donations || {}).length || 0) * 3),
        upcomingEvents: (events || []).filter(e => new Date(e.eventDate) >= new Date())
      };
    } catch (error) {
      console.error('Error getting donor dashboard:', error);
      return null;
    }
  },

  async scheduleDonation(donationData) {
    try {
      const newRef = push(ref(db, 'donationSchedules'));
      await set(newRef, {
        ...donationData,
        status: 'pending_screening',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newRef.key, message: 'Donation scheduled successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getDonationSchedules(donorId) {
    try {
      const snapshot = await get(ref(db, 'donationSchedules'));
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([_, schedule]) => schedule.donorId === donorId)
        .map(([id, schedule]) => ({ id, ...schedule }));
    } catch (error) {
      console.error('Error getting donation schedules:', error);
      return [];
    }
  },

  async getDonations() {
    try {
      const snapshot = await get(ref(db, 'donations'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting donations:', error);
      return {};
    }
  },

  async checkDonorEligibility(donorId) {
    try {
      const donations = await this.getDonations();
      const userDonations = Object.values(donations || {}).filter(d => d && d.donorId === donorId);
      
      if (userDonations.length === 0) {
        return { eligible: true, daysUntilEligible: 0, message: 'You can donate!' };
      }

      const lastDonation = userDonations.sort((a, b) => 
        new Date(b.donationDate || 0) - new Date(a.donationDate || 0)
      )[0];

      const lastDate = new Date(lastDonation.donationDate);
      const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
      const daysUntilEligible = Math.max(0, 56 - daysSince);

      return {
        eligible: daysUntilEligible === 0,
        daysUntilEligible,
        lastDonationDate: lastDonation.donationDate,
        message: daysUntilEligible === 0 ? 'You are eligible to donate!' : `You can donate in ${daysUntilEligible} days`
      };
    } catch (error) {
      console.error('Error checking eligibility:', error);
      return { eligible: false, daysUntilEligible: 56, message: 'Unable to check eligibility' };
    }
  },

  async applyForEligibilityCheck(donorId) {
    try {
      const newRef = push(ref(db, 'eligibilityApplications'));
      await set(newRef, {
        donorId,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      return { success: true, id: newRef.key, message: 'Eligibility application submitted' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async updateDonorProfile(donorId, profileData) {
    try {
      await update(ref(db, `users/${donorId}`), {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ==================== ADMIN FUNCTIONS ====================

  async getAdminDashboard() {
    try {
      const [users, hospitals, inventory, requests, donations] = await Promise.all([
        this.getUsers(),
        this.getHospitals(),
        this.getBloodInventory(),
        this.getBloodRequests(),
        this.getDonations()
      ]);

      const inventoryMap = inventory || {};
      const bloodTotals = {
        'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
        'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0
      };

      Object.values(inventoryMap).forEach(item => {
        if (item.bloodType && bloodTotals.hasOwnProperty(item.bloodType)) {
          bloodTotals[item.bloodType] += (item.quantity || 0);
        }
      });

      return {
        totalUsers: Object.keys(users || {}).length,
        totalHospitals: Object.keys(hospitals || {}).length,
        bloodInventory: bloodTotals,
        pendingRequests: Object.values(requests || {}).filter(r => r.status === 'pending').length,
        totalDonations: Object.keys(donations || {}).length,
        pendingVerifications: 0
      };
    } catch (error) {
      console.error('Error getting admin dashboard:', error);
      return null;
    }
  },

  async getBloodInventory() {
    try {
      const snapshot = await get(ref(db, 'bloodInventory'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting blood inventory:', error);
      return {};
    }
  },

  async getBloodRequests() {
    try {
      const snapshot = await get(ref(db, 'bloodRequests'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting blood requests:', error);
      return {};
    }
  },

  async approveBloodRequest(requestId, updatedBy) {
    try {
      await update(ref(db, `bloodRequests/${requestId}`), {
        status: 'approved',
        updatedBy,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Request approved successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async rejectBloodRequest(requestId, reason, updatedBy) {
    try {
      await update(ref(db, `bloodRequests/${requestId}`), {
        status: 'rejected',
        rejectionReason: reason,
        updatedBy,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Request rejected successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getUsers() {
    try {
      const snapshot = await get(ref(db, 'users'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting users:', error);
      return {};
    }
  },

  // Verification functions removed

  async setDonorEligibility(donorId, eligible) {
    try {
      await update(ref(db, `users/${donorId}`), {
        eligible: !!eligible,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Donor eligibility updated' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getHospitals() {
    try {
      const snapshot = await get(ref(db, 'hospitals'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting hospitals:', error);
      return {};
    }
  },

  async approveHospitalRegistration(hospitalId) {
    try {
      await update(ref(db, `hospitals/${hospitalId}`), {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Hospital approved' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async rejectHospitalRegistration(hospitalId, reason) {
    try {
      await update(ref(db, `hospitals/${hospitalId}`), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Hospital rejected' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ==================== HOSPITAL FUNCTIONS ====================

  async getHospitalDashboard(hospitalId) {
    try {
      const [hospitalData, requests, inventory, events, schedules] = await Promise.all([
        this.getUserData(hospitalId),
        this.getHospitalBloodRequests(hospitalId),
        this.getHospitalInventory(hospitalId),
        this.getHospitalEvents(hospitalId),
        this.getHospitalDonationSchedules(hospitalId)
      ]);

      const totalInventory = Object.values(inventory || {}).reduce((sum, item) => sum + (item.quantity || 0), 0);
      const pendingRequests = Object.values(requests || {}).filter(r => r.status === 'pending').length;

      return {
        hospitalData,
        totalBloodUnits: totalInventory,
        pendingRequests,
        activeEvents: (events || []).filter(e => new Date(e.eventDate) >= new Date()).length,
        upcomingSchedules: (schedules || []).filter(s => s.status !== 'completed').length
      };
    } catch (error) {
      console.error('Error getting hospital dashboard:', error);
      return null;
    }
  },

  async getHospitalBloodRequests(hospitalId) {
    try {
      const snapshot = await get(ref(db, 'bloodRequests'));
      if (!snapshot.exists()) return {};
      
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([_, request]) => request.hospitalId === hospitalId)
        .reduce((acc, [id, request]) => ({ ...acc, [id]: { id, ...request } }), {});
    } catch (error) {
      console.error('Error getting hospital blood requests:', error);
      return {};
    }
  },

  async getHospitalInventory(hospitalId) {
    try {
      const snapshot = await get(ref(db, 'bloodInventory'));
      if (!snapshot.exists()) return {};
      
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([_, item]) => item.hospitalId === hospitalId)
        .reduce((acc, [id, item]) => ({ ...acc, [id]: { id, ...item } }), {});
    } catch (error) {
      console.error('Error getting hospital inventory:', error);
      return {};
    }
  },

  async createBloodRequest(requestData) {
    try {
      const newRef = push(ref(db, 'bloodRequests'));
      await set(newRef, {
        ...requestData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newRef.key, message: 'Blood request created' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async updateBloodRequest(requestId, updateData) {
    try {
      await update(ref(db, `bloodRequests/${requestId}`), {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Blood request updated' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async updateInventory(inventoryId, updateData) {
    try {
      await update(ref(db, `bloodInventory/${inventoryId}`), {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Inventory updated' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async createHospitalEvent(eventData) {
    try {
      const newRef = push(ref(db, 'hospitalEvents'));
      await set(newRef, {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newRef.key, message: 'Hospital event created' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getHospitalEvents(hospitalId) {
    try {
      const snapshot = await get(ref(db, 'hospitalEvents'));
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([_, event]) => !hospitalId || event.hospitalId === hospitalId)
        .map(([id, event]) => ({ id, ...event }));
    } catch (error) {
      console.error('Error getting hospital events:', error);
      return [];
    }
  },

  async getHospitalDonationSchedules(hospitalId) {
    try {
      const snapshot = await get(ref(db, 'donationSchedules'));
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([_, schedule]) => schedule.hospitalId === hospitalId)
        .map(([id, schedule]) => ({ id, ...schedule }));
    } catch (error) {
      console.error('Error getting donation schedules:', error);
      return [];
    }
  },

  async approveDonationSchedule(scheduleId, hospitalId) {
    try {
      await update(ref(db, `donationSchedules/${scheduleId}`), {
        status: 'confirmed',
        hospitalId,
        confirmedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Donation scheduled confirmed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ==================== SHARED FUNCTIONS ====================

  async createNotification(notificationData) {
    try {
      const newRef = push(ref(db, 'notifications'));
      await set(newRef, {
        ...notificationData,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: newRef.key };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getNotifications(userId) {
    try {
      const snapshot = await get(ref(db, 'notifications'));
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([_, notif]) => !userId || notif.userId === userId)
        .map(([id, notif]) => ({ id, ...notif }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      await update(ref(db, `notifications/${notificationId}`), {
        isRead: true,
        readAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async recordDonation(donationData) {
    try {
      const newRef = push(ref(db, 'donations'));
      await set(newRef, {
        ...donationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newRef.key };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// Export to window for use in HTML pages
window.appFunctions = appFunctions;
export default appFunctions;
