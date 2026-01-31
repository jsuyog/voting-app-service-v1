import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";


export default function Dashboard() {

  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const user = auth.currentUser;


  // Load username from Firestore
  useEffect(() => {

    const loadUsername = async () => {

      if (!user) return;

      try {

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUsername(snap.data().username);
        }

      } catch (err) {
        console.error("Username load failed", err);
      }
    };

    loadUsername();

  }, [user]);


  const logout = async () => {

    await signOut(auth);

    localStorage.clear(); // optional, can remove later

    navigate("/");
  };


  return (
    <div className="center">

      <h2>
        Welcome{username ? `, ${username}` : ""}
      </h2>


      <div className="card">

        <button
          className="btn"
          onClick={() => navigate("/create")}
        >
          Create Room
        </button>

        <button
          className="btn"
          onClick={() => navigate("/vote")}
        >
          Vote for Room
        </button>

        <button
          className="btn"
          onClick={() => navigate("/results")}
        >
          View Results
        </button>

      </div>


      <button
        className="btn"
        style={{
          background: "#dc2626",
          marginTop: "20px"
        }}
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
}
  