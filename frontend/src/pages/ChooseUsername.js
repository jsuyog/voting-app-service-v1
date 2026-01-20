import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ChooseUsername() {
  const [username, setUsername] = useState("");
  const nav = useNavigate();
  const user = auth.currentUser;

  const submit = async () => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      nav("/dashboard");
      return;
    }

    await setDoc(ref, {
      email: user.email,
      username: username
    });

    nav("/dashboard");
  };

  return (
    <div className="container">
      <h2>Choose Username</h2>
      <input onChange={e => setUsername(e.target.value)} />
      <button onClick={submit}>Continue</button>
    </div>
  );
}
