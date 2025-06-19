const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} = require('firebase/firestore');

const app = express();
const PORT = 5000;

// ✅ Enable CORS + JSON parsing
app.use(cors());
app.use(bodyParser.json());

// 🔑 Firebase config (storageBucket fixed)
const firebaseConfig = {
  apiKey: "AIzaSyBjvQnkPGMPToU0tV3pNQ1ASLzkbW8DFYk",
  authDomain: "yantrakartira.firebaseapp.com",
  projectId: "yantrakartira",
  storageBucket: "yantrakartira.firebasestorage.app",
  messagingSenderId: "292792177748",
  appId: "1:292792177748:web:73890624ce1c29da7a49c1",
  measurementId: "G-MVNGVNSMX1"
};

// 🔥 Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
console.log("✅ Firebase initialized");

// 🔽 POST route: Submit feedback
app.post('/submit-feedback', async (req, res) => {
  const { name, message } = req.body;

  // Basic input validation
  if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
    return res.status(400).send({ success: false, message: 'Name and message are required.' });
  }

  try {
    await addDoc(collection(db, 'feedbacks'), {
      name,
      message,
      approved: false,
      timestamp: Timestamp.now(),
    });
    res.status(200).send({ success: true, message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('❌ Error submitting feedback:', error);
    res.status(500).send({ success: false, message: 'Error submitting feedback.' });
  }
});

// 🔽 GET route: View approved feedbacks (now includes doc ID)
app.get('/approved-feedbacks', async (req, res) => {
  try {
    const feedbackRef = collection(db, 'feedbacks');
    const q = query(feedbackRef, where('approved', '==', true));
    const snapshot = await getDocs(q);

    const approved = [];
    snapshot.forEach(docSnap => {
      approved.push({ id: docSnap.id, ...docSnap.data() });
    });

    res.status(200).send(approved);
  } catch (error) {
    console.error('❌ Error getting feedbacks:', error);
    res.status(500).send({ message: 'Error fetching feedbacks.' });
  }
});

// 🔽 PUT route: Admin approves feedback by document ID
app.put('/approve-feedback/:id', async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedbackDoc = doc(db, 'feedbacks', feedbackId);
    await updateDoc(feedbackDoc, { approved: true });
    res.status(200).send({ message: 'Feedback approved.' });
  } catch (error) {
    console.error('❌ Error approving feedback:', error);
    res.status(500).send({ message: 'Error approving feedback.' });
  }
});

// 🔽 Server start
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
