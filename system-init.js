// BloodConnect System Initialization and Troubleshooting
// This file verifies all critical functions are working and logs diagnostics

console.log('=== BloodConnect System Initialization ===');

// Check if all required libraries are loaded
function checkLibraries() {
  const checks = {
    'Firebase Auth': typeof firebase !== 'undefined' && firebase.auth,
    'Firebase Realtime DB': typeof firebase !== 'undefined' && firebase.database,
    'Auth Manager': typeof authManager !== 'undefined',
    'App Functions': typeof appFunctions !== 'undefined',
    'BloodConnect DB': typeof bloodConnectDB !== 'undefined',
    'Page Loader': typeof pageLoader !== 'undefined'
  };

  console.log('Library Status:', checks);
  return Object.values(checks).every(v => v);
}

// Initialize all modules
async function initializeSystem() {
  try {
    console.log('Initializing BloodConnect...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => initializeModules());
    } else {
      await initializeModules();
    }

    console.log('✓ BloodConnect initialized successfully');
    return true;
  } catch (error) {
    console.error('✗ Initialization error:', error);
    return false;
  }
}

async function initializeModules() {
  try {
    // Check current page
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    console.log(`Current page: ${page}`);

    // Map of pages to initialization functions
    const pageInitializers = {
      'donor-dashboard.html': async () => {
        if (typeof pageLoader !== 'undefined') {
          await pageLoader.initDonorDashboard();
          pageLoader.addLogoutHandler();
        }
      },
      'admin.html': async () => {
        if (typeof pageLoader !== 'undefined') {
          await pageLoader.initAdminDashboard();
          pageLoader.addLogoutHandler();
        }
      },
      'hospital-dashboard.html': async () => {
        if (typeof pageLoader !== 'undefined') {
          await pageLoader.initHospitalDashboard();
          pageLoader.addLogoutHandler();
        }
      },
      'login.html': async () => {
        if (typeof pageLoader !== 'undefined') {
          await pageLoader.initLoginPage();
        }
      },
      'register.html': async () => {
        if (typeof pageLoader !== 'undefined') {
          await pageLoader.initSignupPage();
        }
      },
      'Signup.html': async () => {
        if (typeof pageLoader !== 'undefined') {
          await pageLoader.initSignupPage();
        }
      }
    };

    // Execute page initializer if exists
    const initializer = pageInitializers[page];
    if (initializer) {
      await initializer();
    }

    console.log(`✓ Page ${page} initialized`);
  } catch (error) {
    console.error('Module initialization error:', error);
  }
}

// Diagnose issues
async function diagnoseSystem() {
  console.log('\n=== Diagnostics ===');

  try {
    // Check authentication
    if (typeof authManager !== 'undefined' && authManager.getAuthUser) {
      const user = await authManager.getAuthUser?.();
      console.log('Current user:', user ? `${user.email} (${user.uid})` : 'Not authenticated');
    }

    // Check database access
    if (typeof bloodConnectDB !== 'undefined') {
      const users = await bloodConnectDB.getUsers?.();
      console.log('Database access:', users ? `✓ (${Object.keys(users).length} users)` : '✗ No data');
    }

    // Check app functions
    if (typeof appFunctions !== 'undefined') {
      console.log('App functions:', Object.keys(appFunctions).length, 'methods available');
    }

    console.log('=== Diagnostics Complete ===\n');
  } catch (error) {
    console.error('Diagnosis error:', error);
  }
}

// Setup global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    // Run diagnostics in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setTimeout(diagnoseSystem, 1000);
    }
  });
} else {
  initializeSystem();
}

// Make diagnostic function available globally
window.diagnoseBloodConnect = diagnoseSystem;
window.checkBloodConnectLibraries = checkLibraries;

console.log('System initialization script loaded');
console.log('Run window.diagnoseBloodConnect() for diagnostics');
