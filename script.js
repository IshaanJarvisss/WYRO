import { db, collection, getDocs, onSnapshot, addDoc, updateDoc, doc } from "./firebase.js";

// 1️⃣ Register user
export async function registerPlayer(real, nick) {
  if (localStorage.getItem("playerId")) {
    return localStorage.getItem("playerId"); // already registered
  }

  // Check duplicate nickname
  const snapshot = await getDocs(collection(db, "players"));
  let duplicate = false;
  snapshot.forEach(d => {
    if (d.data().nickName.toLowerCase() === nick.toLowerCase()) duplicate = true;
  });
  if (duplicate) throw new Error("Nickname already taken");

  const id = String(snapshot.size + 1).padStart(3, "0");

  const docRef = await addDoc(collection(db, "players"), {
    realName: real,
    nickName: nick,
    playerId: id,
    events: {
      "Speed Quiz": false,
      "Puzzle Hunt": false,
      "Trivia Race": false,
      "Memory Challenge": false,
      "Coding Sprint": false
    },
    points: 0
  });

  localStorage.setItem("playerId", id);
  localStorage.setItem("docId", docRef.id); // save Firebase doc ID for future updates
  return id;
}

// 2️⃣ Register participation in an event
export async function registerEvent(eventName) {
  const docId = localStorage.getItem("docId");
  if (!docId) throw new Error("Player not registered");

  const docRef = doc(db, "players", docId);
  const snapshot = await getDocs(collection(db, "players"));
  let playerData;

  snapshot.forEach(d => {
    if (d.id === docId) playerData = d.data();
  });

  if (!playerData) throw new Error("Player not found");

  if (playerData.events[eventName]) {
    alert("Already registered for this event");
    return;
  }

  // Update event participation
  await updateDoc(docRef, {
    [`events.${eventName}`]: true,
    points: playerData.points + 1
  });

  return true;
}

// 3️⃣ Load participants for an event
export async function loadParticipants(eventName, containerId) {
  const container = document.getElementById(containerId);
  onSnapshot(collection(db, "players"), snapshot => {
    container.innerHTML = "";
    snapshot.forEach(d => {
      const p = d.data();
      if (p.events[eventName]) {
        container.innerHTML += `<p>${p.playerId} - ${p.nickName}</p>`;
      }
    });
  });
}

// 4️⃣ Load leaderboard
export async function loadLeaderboard(containerId) {
  const container = document.getElementById(containerId);
  onSnapshot(collection(db, "players"), snapshot => {
    let players = [];
    snapshot.forEach(d => players.push(d.data()));
    players.sort((a,b)=> b.points - a.points);

    container.innerHTML = "";
    players.forEach(p => {
      container.innerHTML += `<p>${p.playerId} - ${p.nickName} : ${p.points}</p>`;
    });
  });
}
