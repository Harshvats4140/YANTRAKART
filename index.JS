import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const app = express();
const port = 5000;

// Firebase config (replace with your own config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint to submit feedback
app.post('/submit-feedback', async (req, res) => {
  const { name, phone, feedback } = req.body;

  if (!name || !phone || !feedback) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const docRef = await addDoc(collection(db, 'feedbacks'), {
      name,
      phone,
      feedback,
      approved: false,
      timestamp: new Date()
    });

    res.status(200).json({ message: 'Feedback submitted successfully.', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
