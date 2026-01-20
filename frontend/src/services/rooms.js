import { db, storage, auth } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Create a room
export async function createRoom() {
  const roomRef = await addDoc(collection(db, "rooms"), {
    ownerUid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    status: "active"
  });
  return roomRef.id;
}

// Upload candidate image + save candidate
export async function addCandidate(roomId, name, file) {
  if (!file) throw new Error("Image required");

  // size check (2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be ≤ 2MB");
  }

  const candidateRef = doc(collection(db, `rooms/${roomId}/candidates`));
  const imageRef = ref(
    storage,
    `rooms/${roomId}/candidates/${candidateRef.id}`
  );

  await uploadBytes(imageRef, file);
  const imageUrl = await getDownloadURL(imageRef);

  await setDoc(candidateRef, {
    name,
    imageUrl,
    votes: 0
  });
}
