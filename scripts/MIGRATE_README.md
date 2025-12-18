Migration script for converting an existing RTDB export into the app's expected flat `bloodInventory` format.

Steps:
1. Save your existing RTDB JSON (the one you pasted) to the repository root as `existing-rtdb.json`.
2. From the project root run:

```bash
node scripts/migrate-rtdb-format.js existing-rtdb.json migrated-rtdb.json
```

3. The script produces `migrated-rtdb.json` with a flat `bloodInventory` object where each key is of the form `<BloodType>_<HospitalId>` and values are objects with fields: `bloodType`, `quantity`, `hospitalId`, `location`, `status`, `createdAt`, `updatedAt`.

4. Upload `migrated-rtdb.json` to your Realtime Database via Firebase CLI or REST:

Using Firebase CLI:

```bash
firebase database:set / migrated-rtdb.json --project your-project-id
```

Using curl (replace <DB_URL> with your RTDB URL):

```bash
curl -X PUT '<DB_URL>/.json' -d @migrated-rtdb.json
```

Notes:
- The script is conservative: it merges inventory sources from both top-level `bloodInventory` and nested `hospitals/{hid}/bloodInventory`.
- It leaves other nodes (users, hospitals, notifications) intact but ensures `hospitals` entries include a `hospitalName` when possible.
- Review `migrated-rtdb.json` before uploading to production.
