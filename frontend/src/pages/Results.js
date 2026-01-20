import { useState } from "react";
import { getResults } from "../api";

export default function Results() {
  const [room, setRoom] = useState("");
  const [data, setData] = useState(null);

  const fetchResults = async () => {
    const res = await getResults(room);
    setData(await res.json());
  };

  return (
    <div className="container">
      <h2 className="title">Room Results</h2>

      <input placeholder="Room ID" onChange={e => setRoom(e.target.value)} />
      <button className="voteBtn" onClick={fetchResults}>Show Results</button>

      {data && (
        <div className="cardGrid">
          {Object.entries(data.results).map(([name, votes]) => (
            <div key={name} className="voteCard">
              <h4>{name}</h4>
              <p>{votes} votes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
