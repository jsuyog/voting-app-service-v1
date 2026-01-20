import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const user = localStorage.getItem("user");

  return (
    <div className="container">
      <h2 className="title">Hello, {user}</h2>
      <p className="subtitle">Choose your action</p>

      <div className="cardGrid">
        <div className="voteCard">
          <h4>Create Room</h4>
          <button className="voteBtn" onClick={() => nav("/create")}>Create</button>
        </div>

        <div className="voteCard">
          <h4>Vote for Room</h4>
          <button className="voteBtn" onClick={() => nav("/vote")}>Vote</button>
        </div>

        <div className="voteCard">
          <h4>See Results</h4>
          <button className="voteBtn" onClick={() => nav("/results")}>Results</button>
        </div>
      </div>
    </div>
  );
}
