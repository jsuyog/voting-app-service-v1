import { useState } from "react";
import { createRoom, addCandidate } from "../services/rooms";

export default function CreateRoom() {
  const [candidates, setCandidates] = useState([
    { name: "", file: null },
    { name: "", file: null },
    { name: "", file: null }
  ]);
  const [loading, setLoading] = useState(false);

  const validCount = candidates.filter(c => c.name && c.file).length;

  const submit = async () => {
    if (validCount < 2 || validCount > 3) {
      alert("Add 2 or 3 candidates with images");
      return;
    }

    setLoading(true);
    try {
      const roomId = await createRoom();

      for (const c of candidates) {
        if (c.name && c.file) {
          await addCandidate(roomId, c.name, c.file);
        }
      }

      alert(`Room created: ${roomId}`);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Create Room</h2>

      {candidates.map((c, i) => (
        <div key={i} className="voteCard">
          <input
            placeholder={`Candidate ${i + 1} name`}
            onChange={e => {
              const arr = [...candidates];
              arr[i].name = e.target.value;
              setCandidates(arr);
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const arr = [...candidates];
              arr[i].file = e.target.files[0];
              setCandidates(arr);
            }}
          />
        </div>
      ))}

      <button
        className="voteBtn"
        disabled={loading || validCount < 2 || validCount > 3}
        onClick={submit}
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
}
