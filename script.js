import { db, collection, addDoc, getDocs, onSnapshot } from "./firebase.js";

// REGISTER
window.register = async function () {
  let real = document.getElementById("realName").value;
  let nick = document.getElementById("nickName").value;

  if (!real || !nick) {
    alert("Fill all fields");
    return;
  }

  const snapshot = await getDocs(collection(db, "players"));
  let id = String(snapshot.size + 1).padStart(3, '0');

  await addDoc(collection(db, "players"), {
    realName: real,
    nickName: nick,
    playerId: id,
    points: 1
  });

  alert("Registered! ID: " + id);
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