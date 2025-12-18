// REMOVED: sample data script cleared by maintainer
// This file has been cleared to remove large sample dataset.
// If you need the original sample data, restore from your backup.
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
