// BloodConnect Realtime Database Manager
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onValue,
  off,
  update,
  query,
  orderByChild,
  equalTo
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// ---------------------------
// Prevent multiple Firebase apps
// ---------------------------
let app;
if (!getApps().length) {
  app = initializeApp({
    apiKey: "AIzaSyAG6Drx2JJlBX1TGvLMWPHp_D2xBDTPIjI",
    authDomain: "bloodconnect-b5142.firebaseapp.com",
    databaseURL: "https://bloodconnect-b5142-default-rtdb.firebaseio.com",
    projectId: "bloodconnect-b5142",
    storageBucket: "bloodconnect-b5142.firebasestorage.app",
    messagingSenderId: "631993835929",
    appId: "1:631993835929:web:75554aca166e9058473308"
  });
} else {
  app = getApps()[0];
}

const database = getDatabase(app);

// ---------------------------
// Helper
// ---------------------------
const getDbRef = (path) => ref(database, path);

// ---------------------------
// BloodConnect Realtime Database
// ---------------------------
class BloodConnectRealtimeDB {
  constructor() {
    this.listeners = {};
  }

  // ---------------------------
  // USERS
  // ---------------------------
  async createUser(userId, userData) {
    return this.safeSet(`users/${userId}`, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async getUser(userId) {
    return this.safeGet(`users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.safeUpdate(`users/${userId}`, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
  }

  async getUsers() {
    return this.safeGet(`users`);
  }

  // ---------------------------
  // BLOOD INVENTORY
  // ---------------------------
  async addBloodInventory(data) {
    const newRef = push(getDbRef("bloodInventory"));
    return this.safeSet(`bloodInventory/${newRef.key}`, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, newRef.key);
  }

  async getBloodInventory() {
    return this.safeGet("bloodInventory");
  }

  async updateBloodInventory(id, data) {
    return this.safeUpdate(`bloodInventory/${id}`, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async searchBloodByType(bloodType) {
    try {
      const snapshot = await get(query(getDbRef('bloodInventory'), orderByChild('bloodType'), equalTo(bloodType)));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error searching blood by type:', error);
      return {};
    }
  }

  // ---------------------------
  // BLOOD REQUESTS
  // ---------------------------
  async createBloodRequest(data) {
    const newRef = push(getDbRef("bloodRequests"));
    return this.safeSet(`bloodRequests/${newRef.key}`, {
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, newRef.key);
  }

  async getBloodRequests() {
    return this.safeGet("bloodRequests");
  }

  async updateBloodRequestStatus(requestId, status, updatedBy) {
    return this.safeUpdate(`bloodRequests/${requestId}`, {
      status,
      updatedBy,
      updatedAt: new Date().toISOString()
    });
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

  // ---------------------------
  // DONATIONS
  // ---------------------------
  async recordDonation(data) {
    const newRef = push(getDbRef("donations"));
    return this.safeSet(`donations/${newRef.key}`, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, newRef.key);
  }

  async getDonations() {
    return this.safeGet("donations");
  }

  // ---------------------------
  // HOSPITALS
  // ---------------------------
  async addHospital(data) {
    const newRef = push(getDbRef("hospitals"));
    return this.safeSet(`hospitals/${newRef.key}`, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, newRef.key);
  }

  async getHospitals() {
    return this.safeGet("hospitals");
  }

  // ---------------------------
  // NOTIFICATIONS
  // ---------------------------
  async createNotification(data) {
    const newRef = push(getDbRef("notifications"));
    return this.safeSet(`notifications/${newRef.key}`, {
      ...data,
      isRead: false,
      createdAt: new Date().toISOString()
    }, newRef.key);
  }

  async getNotifications(userId = null) {
    const all = await this.safeGet("notifications");
    if (!userId) return Object.entries(all || {}).map(([id, n]) => ({ id, ...n }));
    return Object.entries(all || {})
      .filter(([id, n]) => n.userId === userId || n.userId === 'admin')
      .map(([id, n]) => ({ id, ...n }));
  }

  async markNotificationAsRead(id) {
    return this.safeUpdate(`notifications/${id}`, { isRead: true, readAt: new Date().toISOString() });
  }

  // ---------------------------
  // DONATION SCHEDULES
  // ---------------------------
  async scheduleDonation(data) {
    const newRef = push(getDbRef("donationSchedules"));
    return this.safeSet(`donationSchedules/${newRef.key}`, {
      ...data,
      status: "pending_screening",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, newRef.key);
  }

  async getDonationSchedules(donorId = null) {
    const all = await this.safeGet("donationSchedules");
    if (!donorId) return Object.entries(all || {}).map(([id, s]) => ({ id, ...s }));
    return Object.entries(all || {})
      .filter(([id, s]) => s.donorId === donorId)
      .map(([id, s]) => ({ id, ...s }));
  }

  async updateDonationScheduleStatus(id, status, updatedBy) {
    return this.safeUpdate(`donationSchedules/${id}`, { status, updatedBy, updatedAt: new Date().toISOString() });
  }

  async getDonationSchedule(id) {
    const data = await this.safeGet(`donationSchedules/${id}`);
    return data ? { id, ...data } : null;
  }

  // ---------------------------
  // SAFE HELPERS
  // ---------------------------
  async safeSet(path, data, id=null) {
    try {
      await set(getDbRef(path), data);
      return { success: true, id, message: "Success" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async safeGet(path) {
    try {
      const snapshot = await get(getDbRef(path));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (err) {
      console.error("Database get error:", err);
      return null;
    }
  }

  async safeUpdate(path, data) {
    try {
      await update(getDbRef(path), data);
      return { success: true, message: "Updated successfully" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // ---------------------------
  // CLEANUP LISTENERS
  // ---------------------------
  listen(path, callback) {
    if (this.listeners[path]) return; // already listening
    const dbRef = getDbRef(path);
    onValue(dbRef, (snap) => callback(snap.exists() ? snap.val() : {}));
    this.listeners[path] = dbRef;
  }

  stopListening(path) {
    if (!this.listeners[path]) return;
    off(this.listeners[path]);
    delete this.listeners[path];
  }

  stopAll() {
    Object.values(this.listeners).forEach(off);
    this.listeners = {};
  }
}

// ---------------------------
const bloodConnectDB = new BloodConnectRealtimeDB();
window.bloodConnectDB = bloodConnectDB;

console.log("BloodConnectRealtimeDB loaded successfully");
