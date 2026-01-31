import { useState } from "react";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ChooseUsername() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    const user = auth.currentUser;

    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      username,
      email: user.email
    });

    navigate("/dashboard");
  };

  return (
    <div className="center">
      <h2>Choose Username</h2>
      <input onChange={e => setUsername(e.target.value)} />
      <button className="btn" onClick={submit}>Save</button>
    </div>
  );
}
