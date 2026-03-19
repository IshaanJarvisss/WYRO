import { db, collection, addDoc, getDocs, onSnapshot } from "./firebase.js";

// REGISTER
window.register = async function () {
  const real = document.getElementById("realName").value.trim();
  const nick = document.getElementById("nickName").value.trim();

  if (!real || !nick) {
    alert("Fill all fields");
    return;
  }

  // Check if already registered on this device
  if (localStorage.getItem("registered")) {
    alert("You have already registered on this device.");
    return;
  }

  // Check duplicate nickname
  const snapshot = await getDocs(collection(db, "players"));
  let duplicate = false;
  snapshot.forEach(doc => {
    if (doc.data().nickName.toLowerCase() === nick.toLowerCase()) duplicate = true;
  });

  if (duplicate) {
    alert("Nickname already taken!");
    return;
  }

  const id = String(snapshot.size + 1).padStart(3, '0');

  await addDoc(collection(db, "players"), {
    realName: real,
    nickName: nick,
    playerId: id,
    points: 1
  });

  localStorage.setItem("registered", "true");
  localStorage.setItem("playerId", id);
  
  // Redirect to thank you page
  window.location.href = "thankyou.html";
};

// PARTICIPANTS
window.loadParticipants = function () {
  const list = document.getElementById("list");

  onSnapshot(collection(db, "players"), (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach(doc => {
      let p = doc.data();
      list.innerHTML += `<p>${p.playerId} - ${p.nickName}</p>`;
    });
  });
};

// LEADERBOARD
window.loadLeaderboard = function () {
  const board = document.getElementById("leaderboard");

  onSnapshot(collection(db, "players"), (snapshot) => {
    let players = [];

    snapshot.forEach(doc => players.push(doc.data()));

    players.sort((a, b) => b.points - a.points);

    board.innerHTML = "";
    players.forEach(p => {
      board.innerHTML += `<p>${p.playerId} - ${p.nickName} : ${p.points}</p>`;
    });
  });
};