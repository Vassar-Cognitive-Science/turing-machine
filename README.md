# Turing Machine
A web based Turing Machine simulator

# Firebase
1. Follow https://firebase.google.com/docs/cli#initialize_a_firebase_project
2. Run `firebase login`
3. Fill in `firebaseProjectId` in /config/config.js.

# Dev
1. Run `npm run backend`, which starts a local firebase emulator.
2. Run `npm run dev`, which watches for dependency changes and builds app.
3. The app will be hosted locally http://localhost:5000.

# Production
1. Run `npm run pre-deploy` for preview.
2. Run `npm run deploy` to rollout production release.