const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'LcwdzSUi8XPFgUVZCqrXqEzOL7H2'; // <-- Your admin user's UID

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set for user:', uid);
    process.exit();
  })
  .catch(error => {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  });
