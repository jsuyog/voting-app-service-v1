import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      navigate("/dashboard");
    } else {
      navigate("/username");
    }
  };

  return (
    <div className="center">
      <h1>Voting App</h1>
      <button onClick={login} className="btn">
        Sign in with Google
      </button>
    </div>
  );
}
