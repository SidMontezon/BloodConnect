// migrate-rtdb-format.js
// Usage: node migrate-rtdb-format.js [input.json] [output.json]
// Defaults: input.json = existing-rtdb.json, output.json = migrated-rtdb.json

const fs = require('fs');
const path = require('path');

const inFile = process.argv[2] || path.join(process.cwd(), 'existing-rtdb.json');
const outFile = process.argv[3] || path.join(process.cwd(), 'migrated-rtdb.json');

function safeGet(obj, pathArr, fallback = null) {
  return pathArr.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : null, obj) || fallback;
}

function idify(bloodType, hospitalId) {
  return `${bloodType.replace(/[^A-Za-z0-9]/g,'')}_${hospitalId}`;
}

try {
  if (!fs.existsSync(inFile)) {
    console.error(`Input file not found: ${inFile}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inFile, 'utf8');
  const data = JSON.parse(raw);

  const users = data.users || {};
  const hospitals = data.hospitals || {};

  const newRoot = {
    ...data,
    bloodInventory: {},
  };

  const outputInventory = {};

  // Transform top-level bloodInventory (grouped by blood type -> hospitals -> qty)
  if (data.bloodInventory && typeof data.bloodInventory === 'object') {
    for (const [bloodType, content] of Object.entries(data.bloodInventory)) {
      // If the format is bloodType -> hospitals -> { hospitalId: { quantity } }
      const hospitalsObj = content && content.hospitals ? content.hospitals : null;
      if (hospitalsObj) {
        for (const [hid, info] of Object.entries(hospitalsObj)) {
          const qty = (info && (info.quantity || info.qty || info)) || 0;
          const id = idify(bloodType, hid);
          if (!outputInventory[id]) {
            outputInventory[id] = {
              bloodType: bloodType,
              quantity: Number(qty) || 0,
              hospitalId: hid,
              location: safeGet(hospitals, [hid, 'location']) || safeGet(users, [hid, 'hospitalName']) || safeGet(users, [hid, 'firstName']) || null,
              status: 'available',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
        }
      } else {
        // Possibly already flat objects (skip)
      }
    }
  }

  // Also transform hospitals/*/bloodInventory if present
  for (const [hid, hdata] of Object.entries(hospitals)) {
    const hInv = hdata.bloodInventory || {};
    for (const [bloodType, info] of Object.entries(hInv)) {
      const qty = (info && (info.quantity || info.qty || info)) || 0;
      const id = idify(bloodType, hid);
      if (!outputInventory[id]) {
        outputInventory[id] = {
          bloodType: bloodType,
          quantity: Number(qty) || 0,
          hospitalId: hid,
          location: safeGet(hospitals, [hid, 'location']) || safeGet(users, [hid, 'hospitalName']) || safeGet(users, [hid, 'firstName']) || null,
          status: 'available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }
  }

  newRoot.bloodInventory = outputInventory;

  // Optionally, keep hospitals as-is but ensure hospitals have a hospitalName field for consistency
  for (const [hid, hdata] of Object.entries(hospitals)) {
    if (!hdata.hospitalName) {
      const nameFromUser = safeGet(users, [hid, 'hospitalName']) || safeGet(users, [hid, 'firstName']) || hdata.location || null;
      if (nameFromUser) {
        newRoot.hospitals[hid] = {
          ...hdata,
          hospitalName: nameFromUser
        };
      }
    }
  }

  // Write output
  fs.writeFileSync(outFile, JSON.stringify(newRoot, null, 2), 'utf8');
  console.log(`Migration complete. Output written to ${outFile}`);
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
}
