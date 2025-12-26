const USER_KEY = "slotifyUser";
const BOOKING_KEY = "slotifyBookings";

/* SCREENS */
const welcome = document.getElementById("welcome");
const email = document.getElementById("email");
const schedule = document.getElementById("schedule");
const calendar = document.getElementById("calendar");

function show(screen) {
  [welcome, email, schedule, calendar].forEach(s =>
    s.classList.remove("active")
  );
  screen.classList.add("active");
}

