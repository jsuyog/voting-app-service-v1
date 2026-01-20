import firebase_admin
from firebase_admin import credentials, firestore

# Use a service account JSON (recommended for server)
cred = credentials.Certificate("/app/firebase-service-account.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
