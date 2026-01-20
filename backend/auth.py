from fastapi import Header, HTTPException
from firebase_admin import auth, initialize_app, credentials

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email")
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")