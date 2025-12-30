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

/* NAV */

const topbar = document.getElementById("topbar");

document.getElementById("startBtn").onclick = () => {
  show(email);
};

document.getElementById("emailBtn").onclick = () => {
  const emailValue = document.getElementById("emailInput").value.trim();
  if (!emailValue.includes("@")) return;

  localStorage.setItem(USER_KEY, emailValue);
  topbar.classList.remove("hidden");
  show(schedule);
};

document.getElementById("navSchedule").onclick = () => show(schedule);

document.getElementById("navCalendar").onclick = () => {
  show(calendar);
  renderCalendar();
};

document.getElementById("logout").onclick = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(BOOKING_KEY);
  topbar.classList.add("hidden");
  show(welcome);
};

/* BOOKINGS */

function getBookings() {
  const raw = localStorage.getItem(BOOKING_KEY);
  if (!raw) return [];
  return raw.split("\n").map(r => {
    const [date, time] = r.split(",");
    return { date, time };
  });
}

function saveBookings(list) {
  const data = list.map(b => `${b.date},${b.time}`).join("\n");
  localStorage.setItem(BOOKING_KEY, data);
}

function isBooked(date, time) {
  return getBookings().some(b => b.date === date && b.time === time);
}

/* SCHEDULE */

const dateInput = document.getElementById("dateInput");
const slotsDiv = document.getElementById("slots");

dateInput.addEventListener("change", renderSlots);

function renderSlots() {
  slotsDiv.innerHTML = "";
  const date = dateInput.value;
  if (!date) return;

  for (let h = 9; h < 17; h++) {
    ["00", "30"].forEach(m => {
      const time = `${h}:${m}`;
      const div = document.createElement("div");
      div.className = "slot";
      div.textContent = time;

      if (isBooked(date, time)) {
        div.classList.add("booked");
      } else {
        div.onclick = () => book(date, time);
      }

      slotsDiv.appendChild(div);
    });
  }
}

function book(date, time) {
  const bookings = getBookings();
  bookings.push({ date, time });
  saveBookings(bookings);
  show(calendar);
  renderCalendar();
}

/* CALENDAR */

function renderCalendar() {
  const container = document.getElementById("calendarGrid");
  container.innerHTML = "";

  const bookings = getBookings();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerHTML = `<strong>${d}</strong>`;

    bookings
      .filter(b => b.date === dateStr)
      .forEach(b => {
        const appt = document.createElement("div");
        appt.className = "appointment";
        appt.textContent = b.time;

        appt.onclick = () => {
          if (!confirm("Delete this appointment?")) return;
          const updated = getBookings().filter(
            x => !(x.date === b.date && x.time === b.time)
          );
          saveBookings(updated);
          renderCalendar();
        };

        dayDiv.appendChild(appt);
      });

    container.appendChild(dayDiv);
  }
}

/* INITIAL STATE */

topbar.classList.add("hidden");
show(welcome);