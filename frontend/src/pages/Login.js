import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if (result.user) {
      nav("/username");
    }
  };

  return (
    <div className="container">
      <h1>Voting App</h1>
      <button className="voteBtn" onClick={signIn}>
        Sign in with Google
      </button>
    </div>
  );
}
