// BloodConnect Realtime Database Manager
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  query,
  orderByChild,
  equalTo,
  onValue,
  off
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
const getDbRef = path => ref(database, path);

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
  createUser(userId, userData) {
    return set(getDbRef(`users/${userId}`), { ...userData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  getUser(userId) {
    return get(getDbRef(`users/${userId}`)).then(snap => snap.exists() ? snap.val() : null);
  }

  updateUser(userId, data) {
    return update(getDbRef(`users/${userId}`), { ...data, updatedAt: new Date().toISOString() });
  }

  getUsers() {
    return get(getDbRef(`users`)).then(snap => snap.exists() ? snap.val() : {});
  }

  // ---------------------------
  // VERIFICATIONS
  // ---------------------------
  createVerification(data) {
    const newRef = push(getDbRef("verifications"));
    return set(getDbRef(`verifications/${newRef.key}`), { ...data });
  }

  getVerifications() {
    return get(getDbRef("verifications")).then(snap => snap.exists() ? snap.val() : {});
  }

  updateVerification(id, data) {
    return update(getDbRef(`verifications/${id}`), { ...data });
  }

  // ---------------------------
  // NOTIFICATIONS
  // ---------------------------
  createNotification(data) {
    const newRef = push(getDbRef("notifications"));
    return set(getDbRef(`notifications/${newRef.key}`), { ...data, isRead: false, createdAt: new Date().toISOString() });
  }

  getNotifications(userId = null) {
    return get(getDbRef("notifications")).then(snap => {
      const all = snap.exists() ? snap.val() : {};
      if (!userId) return Object.entries(all).map(([id, n]) => ({ id, ...n }));
      return Object.entries(all)
        .filter(([id, n]) => n.userId === userId || n.userId === 'admin')
        .map(([id, n]) => ({ id, ...n }));
    });
  }

  markNotificationAsRead(id) {
    return update(getDbRef(`notifications/${id}`), { isRead: true, readAt: new Date().toISOString() });
  }

  // ---------------------------
  // REALTIME LISTENERS
  // ---------------------------
  listen(path, callback) {
    if (this.listeners[path]) return; // already listening
    const dbRef = getDbRef(path);
    onValue(dbRef, snap => callback(snap.exists() ? snap.val() : {}));
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
