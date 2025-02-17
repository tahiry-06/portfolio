import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your web app's Firebase configuration
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

/*///////////////////////////////////////////*/
/*/ visitors /*/
function getViewersIp(json) {
  let viewersIp = json.ip;

  // count viewers with ip
  countView(viewersIp);
}

function countView(ip) {
  let viewers = 0;
  const ipString = ip.split(".").join("-");

  const db = getDatabase(app);

  const countRef = ref(db, "visitorCount");

  // this will only be called once since it is set
  set(countRef, {
    [ipString]: viewers + 1,
  });

  // what is the snapshot here? this is actually used to get and use the data to display

  const count = get(countRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const viewers = Object.keys(data).length;
      // console.log(viewers);
      return viewers;
    } else {
      console.log("No data available");
    }
  });

  // console.log(count);
  return count;
}

const rights = document.querySelector(".rights");

async function displayView(data) {
  const count = await countView(data.ip);
  // console.log(count);
  rights.innerHTML = `2025 Tahiry Niaina. All Right Reserved. <br/> ${count}`;
}

async function viewerIp() {
  const response = await fetch("https://api.ipify.org?format=json&callback=getViewersIp");
  const data = await response.json();

  getViewersIp(data);
  displayView(data);
}

viewerIp();
