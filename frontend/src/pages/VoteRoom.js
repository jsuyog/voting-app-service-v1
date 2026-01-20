import { useState } from "react";
import { voteRoom, getResults } from "../api";

export default function VoteRoom() {
  const [roomId, setRoomId] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [voted, setVoted] = useState(false);

  const user = localStorage.getItem("user");

  // Load room info from backend
  const loadRoom = async () => {
    if (!roomId) {
      alert("Enter Room ID");
      return;
    }

    const res = await getResults(roomId);
    const data = await res.json();

    if (res.ok) {
      setRoomData(data);
    } else {
      alert("Room not found or expired");
    }
  };

  // Submit vote
  const submitVote = async (candidate) => {
    const res = await voteRoom(roomId, user, candidate);
    const data = await res.json();

    if (res.ok) {
      alert("Vote recorded successfully");
      setVoted(true);
      loadRoom(); // refresh live results
    } else {
      alert("Error: " + data.detail);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Vote in Room</h2>

      {!roomData && (
        <>
          <input
            placeholder="Enter Room ID"
            onChange={e => setRoomId(e.target.value)}
          />
          <button className="voteBtn" onClick={loadRoom}>
            Load Room
          </button>
        </>
      )}

      {roomData && (
        <>
          <div className="cardGrid">
            {Object.keys(roomData.results).map(candidate => (
              <div key={candidate} className="voteCard">
                <img
                  src={`https://via.placeholder.com/200?text=${candidate}`}
                  alt={candidate}
                />
                <h4>{candidate}</h4>
                <p>{roomData.results[candidate]} votes</p>

                <button
                  disabled={voted}
                  className="voteBtn"
                  onClick={() => submitVote(candidate)}
                >
                  {voted ? "Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>

          <p style={{ marginTop: "20px" }}>
            Voting ends in: {roomData.ttl} seconds
          </p>
        </>
      )}
    </div>
  );
}