import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Query closed rooms
    const q = query(
      collection(db, "rooms"),
      where("status", "==", "closed"),
      orderBy("endedAt", "desc")
    );

    // Realtime listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRooms(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="center">

      <h2>Voting Results</h2>

      {/* Loading */}
      {loading && <p>Loading results...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* No Data */}
      {!loading && rooms.length === 0 && (
        <p>No completed rooms yet.</p>
      )}

      {/* Results */}
      <div className="results-list">

        {rooms.map((room) => (
          <div key={room.id} className="result-card">

            <h3>Room: {room.rooom}</h3>

            <p>
              <strong>Winner:</strong>{" "}
              {room.winner || "Not decided"}
            </p>

            <p>
              <strong>Owner:</strong>{" "}
              {room.ownerName || "Unknown"}
            </p>

            {room.endedAt && (
              <p className="time">
                {new Date(
                  room.endedAt.seconds * 1000
                ).toLocaleString()}
              </p>
            )}

          </div>
        ))}

      </div>

      <button
        className="btn"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

    </div>
  );
}
