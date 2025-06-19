import express from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjvQnkPGMPToU0tV3pNQ1ASLzkbW8DFYk",
  authDomain: "yantrakartira.firebaseapp.com",
  projectId: "yantrakartira",
  storageBucket: "yantrakartira.firebasestorage.app",
  messagingSenderId: "292792177748",
  appId: "1:292792177748:web:73890624ce1c29da7a49c1",
  measurementId: "G-MVNGVNSMX1"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Health check route (only once)
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Feedback submission route
app.post('/submit-feedback', async (req, res) => {
  const { name, message } = req.body;
  try {
    await addDoc(collection(db, "feedbacks"), {
      name,
      message,
      approved: false,
      timestamp: new Date(),
    });
    res.status(200).send({ success: true, message: "Feedback submitted for review" });
  } catch (e) {
    res.status(500).send({ success: false, error: e.message });
  }
});

// Get approved feedbacks
app.get('/approved-feedbacks', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "feedbacks"));
    const approved = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.approved) {
        approved.push({ id: docSnap.id, ...data });
      }
    });
    res.send(approved);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Approve feedback (admin)
app.post('/approve-feedback/:id', async (req, res) => {
  const feedbackId = req.params.id;
  try {
    const feedbackRef = doc(db, "feedbacks", feedbackId);
    await updateDoc(feedbackRef, { approved: true });
    res.send({ success: true, message: "Feedback approved" });
  } catch (e) {
    res.status(500).send({ success: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
