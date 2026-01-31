import { useState } from "react";
import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  runTransaction,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

export default function VoteRoom() {

  const [roomId, setRoomId] = useState("");
  const [room, setRoom] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = auth.currentUser;



  // ===============================
  // Load Room
  // ===============================
  const loadRoom = async () => {

    if (!roomId.trim()) return;

    try {
      setLoading(true);

      const ref = doc(db, "rooms", roomId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setRoom(null);
        setMessage("Room not found");
        return;
      }

      setRoom({ id: snap.id, ...snap.data() });
      setMessage("");

    } catch (err) {

      console.error(err);
      setMessage("Failed to load room");

    } finally {
      setLoading(false);
    }
  };



  // ===============================
  // Vote
  // ===============================
  const vote = async (index) => {

    if (!room || !user) return;

    if (room.status === "closed") {
      alert("Voting is closed");
      return;
    }

    const ref = doc(db, "rooms", room.id);

    try {

      setLoading(true);

      await runTransaction(db, async (tx) => {

        const snap = await tx.get(ref);

        if (!snap.exists()) throw "NOT_FOUND";

        const data = snap.data();


        // Owner cannot vote
        if (data.ownerUid === user.uid)
          throw "OWNER";


        // Already voted
        if (data.voters?.includes(user.uid))
          throw "VOTED";


        // Closed
        if (data.status === "closed")
          throw "CLOSED";


        const candidates = [...data.candidates];

        candidates[index].votes =
          (candidates[index].votes || 0) + 1;


        tx.update(ref, {
          candidates,
          voters: [...(data.voters || []), user.uid]
        });

      });


      alert("Vote submitted successfully");
      await loadRoom();


    } catch (err) {

      if (err === "OWNER")
        alert("Owner cannot vote");

      else if (err === "VOTED")
        alert("You already voted");

      else if (err === "CLOSED")
        alert("Voting is closed");

      else
        alert("Vote failed");

      console.error(err);

    } finally {
      setLoading(false);
    }
  };



  // ===============================
  // End Voting (Owner)
  // ===============================
  const endVoting = async () => {

    if (!room || !user) return;

    if (room.ownerUid !== user.uid) {
      alert("Only owner can end voting");
      return;
    }

    if (room.status === "closed") {
      alert("Already closed");
      return;
    }

    try {

      setLoading(true);


      // Find Winner
      let winner = "";
      let maxVotes = -1;

      room.candidates.forEach((c) => {
        const v = c.votes || 0;

        if (v > maxVotes) {
          maxVotes = v;
          winner = c.name;
        }
      });


      await updateDoc(doc(db, "rooms", room.id), {

        status: "closed",
        rooom: room.id,
        winner,

        endedAt: serverTimestamp(),

        ownerName:
          user.email ||
          "Unknown"

      });


      alert("Voting ended successfully");
      await loadRoom();


    } catch (err) {

      console.error(err);
      alert("Failed to close room");

    } finally {
      setLoading(false);
    }
  };



  // ===============================
  // UI
  // ===============================
  return (
    <div className="center">

      <h2>Vote in Room</h2>


      {/* Room Input */}
      <div className="card">

        <input
          placeholder="Enter Room ID"
          value={roomId}
          disabled={loading}
          onChange={e => setRoomId(e.target.value)}
        />

        <button
          className="btn"
          onClick={loadRoom}
          disabled={loading}
        >
          Load Room
        </button>

      </div>


      {message && <p>{message}</p>}


      {/* Owner End Button */}
      {room &&
        user?.uid === room.ownerUid &&
        room.status === "active" && (

          <button
            className="btn"
            style={{
              background: "#dc2626",
              marginTop: "20px"
            }}
            disabled={loading}
            onClick={endVoting}
          >
            End Voting
          </button>
        )
      }


      {/* Status */}
      {room && (

        <h3 style={{ marginTop: "15px" }}>
          Status: {room.status.toUpperCase()}
        </h3>

      )}


      {/* Candidates */}
      {room && (

        <div
          style={{
            display: "flex",
            gap: "25px",
            marginTop: "30px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >

          {room.candidates.map((c, i) => (

            <div
              key={i}
              className="card"
              style={{ width: "220px" }}
            >

              <img
                src={c.image}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px"
                }}
              />

              <h4>{c.name}</h4>

              <p>Votes: {c.votes || 0}</p>


              <button
                className="btn"
                disabled={
                  loading ||
                  room.status === "closed"
                }
                onClick={() => vote(i)}
              >
                Vote
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
