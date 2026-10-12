
/* ==========================================
   OUR LITTLE UNIVERSE
   Interactive JavaScript
========================================== */

const pages = [
  "page1",
  "page2",
  "page3",
  "page4",
  "page5",
  "page6",
  "page7"
];

const chapterNames = [
  "Chapter 01 · The Beginning",
  "Chapter 02 · The Question",
  "Chapter 03 · Our Date",
  "Chapter 04 · A Tiny Challenge",
  "Chapter 05 · Heartbeats",
  "Chapter 06 · Your Letter",
  "The Story Continues ♥"
];

let score = 0;
let heartTaps = 0;
let noMoves = 0;
let toastTimer;


/* ==========================================
   1. CREATE BACKGROUND STARS
========================================== */

const starfield = document.getElementById("starfield");
const floatLayer = document.getElementById("floatLayer");

for (let i = 0; i < 85; i++) {
  const star = document.createElement("span");

  star.className = "star";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 4 + "s";
  star.style.animationDuration =
    2 + Math.random() * 4 + "s";

  starfield.appendChild(star);
}

for (let i = 0; i < 12; i++) {
  const heart = document.createElement("span");

  heart.className = "ambient-heart";
  heart.textContent = ["♡", "♥", "✧"][i % 3];

  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration =
    17 + Math.random() * 20 + "s";
  heart.style.animationDelay =
    -(Math.random() * 30) + "s";
  heart.style.fontSize =
    12 + Math.random() * 18 + "px";

  floatLayer.appendChild(heart);
}


/* ==========================================
   2. PAGE NAVIGATION
========================================== */

function goTo(pageId) {
  if (!pages.includes(pageId)) return;

  pages.forEach((id) => {
    document.getElementById(id)
      .classList.toggle("active", id === pageId);
  });

  const index = pages.indexOf(pageId);

  document.getElementById("stepPill").textContent =
    chapterNames[index];

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (pageId === "page4") {
    setupGame();
  }

  if (pageId === "page7") {
    celebrate(18);
  }
}


/* ==========================================
   3. TOAST NOTIFICATIONS
========================================== */

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


/* ==========================================
   4. RUNAWAY NO BUTTON
========================================== */

const noBtn = document.getElementById("noBtn");

function moveNoButton() {
  noMoves++;

  const area = noBtn.parentElement;
  const areaRect = area.getBoundingClientRect();

  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = Math.max(
    0,
    areaRect.width - buttonWidth
  );

  const maxY = Math.max(
    0,
    areaRect.height - buttonHeight
  );

  // Keep the moving button inside its proposal area.
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  const hint = document.getElementById("proposalHint");

  if (noMoves < 3) {
    hint.textContent =
      "Hehe! That button is shy. Try again! 💗";
  } else {
    hint.textContent =
      "Your No button has other plans! ✨";
  }
}

// Desktop: move when the pointer approaches.
noBtn.addEventListener("pointerenter", moveNoButton);

// Touch devices: move when someone tries to press it.
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

// Extra keyboard accessibility.
noBtn.addEventListener("focus", moveNoButton);

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});


/* ==========================================
   5. YES BUTTON
========================================== */

function acceptDate() {
  celebrate(28);

  showToast(
    "You just made my heart very, very happy! ♥"
  );

  setTimeout(() => {
    goTo("page3");
  }, 650);
}


/* ==========================================
   6. DATE PLANNER DEFAULT DATE
========================================== */

const dateInput = document.getElementById("dateInput");

const today = new Date();
const dateString = (date) => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

dateInput.min = dateString(today);
dateInput.value = dateString(tomorrow);


/* ==========================================
   7. SAVE THE DATE PLAN
========================================== */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[char];
  });
}

function saveDate() {
  const date = dateInput.value;
  const time = document.getElementById("timeInput").value;

  const vibe = document.getElementById("dateType").value;

  const place =
    document.getElementById("placeInput").value.trim()
    || "Somewhere we both love";

  const note =
    document.getElementById("noteInput").value.trim();

  if (!date || !time) {
    showToast("Please choose a date and time first. 💗");
    return;
  }

  if (date < dateString(today)) {
    showToast("Please choose today or a future date.");
    return;
  }

  const selectedDate = new Date(date + "T00:00:00");

  const formattedDate = selectedDate.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );

  const plan = {
    date,
    time,
    vibe,
    place,
    note
  };

  // Store locally on this browser/device.
  try {
    localStorage.setItem(
      "ourLittleDate",
      JSON.stringify(plan)
    );
  } catch (error) {
    console.warn("Local storage unavailable.", error);
  }

  const summary = document.getElementById("dateSummary");

  summary.innerHTML = `
    <div class="summary-card">
      <h3>Our Little Plan ✨</h3>
      <strong style="color:var(--pink)">
        ${escapeHTML(formattedDate)}
        · ${escapeHTML(time)}
      </strong>
      <p>${escapeHTML(vibe)}</p>
      <p>Place: ${escapeHTML(place)}</p>
      ${
        note
          ? `<p>My little wish: ${escapeHTML(note)}</p>`
          : ""
      }
    </div>
  `;

  showToast("Our date idea is saved on this device! ♥");

  setTimeout(() => {
    goTo("page4");
  }, 1100);
}


/* ==========================================
   8. HEART-COLLECTING GAME
========================================== */

const gameBoard = document.getElementById("gameBoard");
const gameMessage = document.getElementById("gameMessage");

function setupGame() {
  // Remove old game hearts.
  gameBoard.querySelectorAll(".game-heart")
    .forEach((heart) => heart.remove());

  if (score >= 5) {
    showGameComplete();
    return;
  }

  gameMessage.classList.remove("hidden");

  gameMessage.innerHTML = `
    <div>
      <strong>Ready, my love?</strong>
      Tap the hearts as they appear.
    </div>
  `;

  const heartsToShow = Math.min(3, 5 - score);

  for (let i = 0; i < heartsToShow; i++) {
    spawnGameHeart();
  }
}

function spawnGameHeart() {
  const heart = document.createElement("button");

  heart.type = "button";
  heart.className = "game-heart";
  heart.textContent = ["♥", "♡", "💗"][
    Math.floor(Math.random() * 3)
  ];

  heart.setAttribute(
    "aria-label",
    "Collect this heart"
  );

  const maxX = Math.max(
    12,
    gameBoard.clientWidth - 70
  );

  const maxY = Math.max(
    18,
    gameBoard.clientHeight - 76
  );

  heart.style.left =
    18 + Math.random() * Math.max(10, maxX - 18) + "px";

  heart.style.top =
    18 + Math.random() * Math.max(10, maxY - 18) + "px";

  heart.style.animationDelay =
    Math.random() * 0.6 + "s";

  heart.addEventListener("click", () => {
    if (score >= 5) return;

    heart.remove();

    score = Math.min(5, score + 1);

    document.getElementById("scoreText").textContent = score;

    gameMessage.classList.add("hidden");

    if (score >= 5) {
      showGameComplete();
      return;
    }

    // Keep multiple hearts available to collect.
    while (
      gameBoard.querySelectorAll(".game-heart").length < 3
    ) {
      spawnGameHeart();
    }
  });

  gameBoard.appendChild(heart);
}

function showGameComplete() {
  gameBoard.querySelectorAll(".game-heart")
    .forEach((heart) => heart.remove());

  gameMessage.classList.remove("hidden");

  gameMessage.innerHTML = `
    <div>
      <strong>All five, all yours! ♥</strong>
      You did it! Your next surprise is unlocked.
      <br>
      <button
        class="primary"
        style="margin-top:14px;pointer-events:auto"
        onclick="goTo('page5')"
      >
        Continue to the Heart ↗
      </button>
    </div>
  `;

  celebrate(14);
}

function resetGame() {
  score = 0;

  document.getElementById("scoreText").textContent = "0";

  setupGame();
}


/* ==========================================
   9. INTERACTIVE HEARTBEAT
========================================== */

function tapHeart() {
  heartTaps++;

  document.getElementById("heartCount").textContent =
    heartTaps;

  const heart = document.getElementById("bigHeart");

  heart.classList.remove("pulse");

  // Restart the pulse animation.
  void heart.offsetWidth;

  heart.classList.add("pulse");

  const hint = document.getElementById("heartHint");
  const letterBtn = document.getElementById("letterBtn");

  if (heartTaps >= 5) {
    letterBtn.disabled = false;

    hint.textContent =
      "Unlocked! Your letter is ready, my love. ♥";

    showToast(
      "A little letter, straight from the heart. 💌"
    );

    if (heartTaps === 5) {
      celebrate(12);
    }
  } else {
    hint.textContent =
      `Just ${5 - heartTaps} more heartbeats to go. ♥`;
  }
}


/* ==========================================
   10. COPY THE LOVE LETTER
========================================== */

async function copyLetter() {
  const text = document.getElementById("letterBody").innerText;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Your love letter has been copied! 💌");
  } catch (error) {
    // Fallback for browsers without Clipboard API access.
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();

    try {
      const copied = document.execCommand("copy");

      if (copied) {
        showToast("Your love letter has been copied! 💌");
      } else {
        showToast("Please select and copy the letter manually.");
      }
    } catch (copyError) {
      showToast("Please select and copy the letter manually.");
    }

    textarea.remove();
  }
}


/* ==========================================
   11. HEARTS AND CELEBRATION EFFECT
========================================== */

function celebrate(amount = 22) {
  const symbols = ["♥", "♡", "✦", "✧", "💗"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti";

    piece.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = (-10 - Math.random() * 25) + "px";

    piece.style.color = [
      "#ff8bb5",
      "#ffd5e2",
      "#f4d49a",
      "#fff4f7"
    ][Math.floor(Math.random() * 4)];

    piece.style.animationDuration =
      1.5 + Math.random() * 1.6 + "s";

    piece.style.fontSize =
      12 + Math.random() * 20 + "px";

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 3400);
  }
}


/* ==========================================
   12. INITIALIZE THE WEBSITE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("scoreText").textContent = score;
  document.getElementById("heartCount").textContent = heartTaps;

  // Date and time fields start with sensible defaults.
  document.getElementById("timeInput").value = "19:00";
});
