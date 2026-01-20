from fastapi import FastAPI, HTTPException, Depends
import redis, time, json, random, os
from auth import verify_token
from firebase import db

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
r = redis.Redis(host = REDIS_HOST, port = 6379, decode_responses = True, db = 0)

ROOM_TTL = 300  # Room time-to-live in seconds

USER_FILE = "users.json"
RESULTS_FILE = "results.json"

def load_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/secure/ping")
def secure_ping(user=Depends(verify_token)):
    return {
        "message": "Secure pong",
        "uid": user["uid"],
        "email": user["email"]
    }

@app.post("/login")
def login(username: str):
    user = load_json(USER_FILE)
    if username in user:
        return {"status": "success", "message": "Login successful"}

    user[username] = {"created_at": time.time()}
    save_json(USER_FILE, user)
    return {"status": "success", "message": "User created and logged in"}

@app.post("/room/create")
def create_room(owner: str, candidates:list[str]):
    if len(candidates) < 2 and len(candidates) > 3:
        raise HTTPException(status_code=400, detail="Number of candidates must be between 2 and 3")
    
    room_id = str(random.randint(1000, 9999))

    r.hset(f"room:{room_id}", mapping={
        "owner": owner,
        "candidates": ",".join(candidates),
        "start": time.time()
    })

    r.expire(f"room:{room_id}", ROOM_TTL)

    return {"status": "success", "room_id": room_id}

@app.post("/room/vote")
def vote(room_id: str, username: str, candidate: str):
    key = f"room:{room_id}"

    if not r.exists(key):
        raise HTTPException(404, "Room expired")

    owner = r.hget(key, "owner")
    if username == owner:
        raise HTTPException(403, "Owner cannot vote")

    if r.hexists(key, f"vote:{username}"):
        raise HTTPException(409, "Already voted")

    valid = r.hget(key, "candidates").split(",")

    if candidate not in valid:
        raise HTTPException(400, "Invalid candidate")

    r.hset(key, f"vote:{username}", candidate)

    return {"message": "Vote recorded"}


# @app.get("/room/results")
# def results(room_id: str):
#     key = f"room:{room_id}"

#     if r.exists(key):
#         data = r.hgetall(key)
#         candidates = data["candidates"].split(",")

#         res = {candidate: 0 for candidate in candidates}

#         for k, v in data.items():
#             if k.startswith("vote:"):
#                 res[v] += 1
        
#         return {"status": "success", "results": res}
    
#     stored_results = load_json(RESULTS_FILE)

#     if room_id not in stored_results:
#         raise HTTPException(status_code=404, detail="Room not found or results unavailable")
    
#     return {"status": "success", "results": stored_results[room_id]}

@app.get("/room/results")
def results(room_id: str):
    key = f"room:{room_id}"

    # If room expired, try loading stored results
    if not r.exists(key):
        stored = load_json(RESULTS_FILE)
        if room_id in stored:
            return {"status": "closed", "results": stored[room_id]}
        raise HTTPException(404, "Room not found")

    data = r.hgetall(key)

    candidates = data["candidates"].split(",")

    # Initialize result counters
    res = {c: 0 for c in candidates}

    # Count votes
    for k, v in data.items():
        if k.startswith("vote:"):
            res[v] += 1

    # Return live results + TTL
    return {
        "status": "active",
        "ttl": r.ttl(key),
        "results": res
    }



#save results when room expires
import threading

def watcher():
    while True:
        for key in r.keys("room:*"):
            if r.ttl(key) == 1:
                rid = key.split(":")[1]
                data = r.hgetall(key)
                candidates = data["candidates"].split(",")
                res = {candidate: 0 for candidate in candidates}

                for k, v in data.items():
                    if k.startswith("vote:"):
                        res[v] += 1
                
                stored_results = load_json(RESULTS_FILE)
                stored_results[rid] = res
                save_json(RESULTS_FILE, stored_results)

        time.sleep(1)
    

threading.Thread(target=watcher, daemon=True).start()