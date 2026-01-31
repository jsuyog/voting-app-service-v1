import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreateRoom() {
  const [candidates, setCandidates] = useState([
    { name: "", file: null },
    { name: "", file: null }
  ]);

  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoomId = () =>
    Math.floor(1000 + Math.random() * 9000).toString();

  const addCandidate = () => {
    if (candidates.length < 3) {
      setCandidates([...candidates, { name: "", file: null }]);
    }
  };

  const updateCandidate = (i, field, value) => {
    const copy = [...candidates];
    copy[i][field] = value;
    setCandidates(copy);
  };

  const resetForm = () => {
    setCandidates([
      { name: "", file: null },
      { name: "", file: null }
    ]);
  };

  const submit = async () => {
    if (loading) return;

    const user = auth.currentUser;
    if (!user) return alert("Login required");

    for (let c of candidates) {
      if (!c.name || !c.file) {
        alert("All candidates need name + image");
        return;
      }
    }

    try {
      setLoading(true);
      setRoomId(null);

      const id = generateRoomId();
      const uploaded = [];

      // Upload images
      for (let i = 0; i < candidates.length; i++) {
        const imgRef = ref(
          storage,
          `rooms/${id}/candidate_${i}.jpg`
        );

        await uploadBytes(imgRef, candidates[i].file);

        const url = await getDownloadURL(imgRef);

        uploaded.push({
          name: candidates[i].name,
          image: url,
          votes: 0
        });
      }

      // Save room
      await setDoc(doc(db, "rooms", id), {

  ownerUid: user.uid,
  ownerName: localStorage.getItem("username"),

  createdAt: serverTimestamp(),

  status: "active",
  winner: null,

  candidates: uploaded,
  voters: []
});


      setRoomId(id);
      resetForm();

    } catch (err) {
      console.error(err);
      alert("Failed to create room");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">

      <h2>Create Voting Room</h2>

      {candidates.map((c, i) => (
        <div key={i} className="card">

          <input
            placeholder="Candidate name"
            value={c.name}
            disabled={loading}
            onChange={e =>
              updateCandidate(i, "name", e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={e =>
              updateCandidate(i, "file", e.target.files[0])
            }
          />

        </div>
      ))}

      {candidates.length < 3 && !loading && (
        <button onClick={addCandidate} className="btn">
          + Add Candidate
        </button>
      )}

      <button
        onClick={submit}
        className="btn"
        disabled={loading}
      >
        {loading ? "Creating Room..." : "Create Room"}
      </button>

      {loading && (
        <p style={{ marginTop: "10px" }}>
          Uploading images, please wait...
        </p>
      )}

      {roomId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Room Created!</h3>
          <h2>{roomId}</h2>
          <p>Share this code to vote</p>
        </div>
      )}

    </div>
  );
}
