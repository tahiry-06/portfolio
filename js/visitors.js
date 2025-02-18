import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your web app's Firebase configuration (keep it public)
const firebaseConfig = {
  apiKey: "AIzaSyDQiz0alaXW1LvoPbQZaTBxx3915pfIuAw",
  authDomain: "visitor-counter-b1c47.firebaseapp.com",
  databaseURL: "https://visitor-counter-b1c47-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "visitor-counter-b1c47",
  storageBucket: "visitor-counter-b1c47.firebasestorage.app",
  messagingSenderId: "313975289224",
  appId: "1:313975289224:web:89075997c874773a58363d",
  measurementId: "G-8HFC7GE9NN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to count visitor
async function countVisitor() {
  const ipData = await fetch("https://api.ipify.org?format=json").then((res) => res.json());
  const visitorIp = ipData.ip.replace(/\./g, "-"); // Convert IP to valid Firebase key

  const countRef = ref(db, `visitorCount/${visitorIp}`);

  // Check if IP exists
  const snapshot = await get(countRef);
  if (!snapshot.exists()) {
    // New visitor, update the database
    await update(ref(db, "visitorCount"), { [visitorIp]: true });
  }

  // Get total unique visitors
  const totalSnapshot = await get(ref(db, "visitorCount"));
  if (totalSnapshot.exists()) {
    const totalVisitors = Object.keys(totalSnapshot.val()).length;
    document.querySelector(".rights").innerHTML = `2025 Tahiry Niaina. All Rights Reserved. <br/> ${totalVisitors}`;
  }
}

// Run the function
countVisitor();
