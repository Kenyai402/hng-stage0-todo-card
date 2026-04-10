// Checkbox

const checkbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const todoStatus = document.querySelector('[data-testid="test-todo-status"]');
const title = document.querySelector('[data-testid="test-todo-title"]');

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    todoStatus.textContent = "Done";
    title.style.textDecoration = "line-through";
  } else {
    todoStatus.textContent = "Pending";
    title.style.textDecoration = "none";
  }
});

//Buttons
const editButton = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
);
const deleteButton = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);

editButton.addEventListener("click", () => {
   alert("Edit button clicked");
});

deleteButton.addEventListener("click", () => {
  alert("Delete button clicked");
});

// Time remaining

function updateTimeRemaining() {
  const dueDate = new Date("2026-04-16T23:59:59");
  const now = new Date();
  const timeRemaining = dueDate - now;
  const absTime = Math.abs(timeRemaining);

  // Date Manipulation: Adding this value(1000*60*60*24) to a "Time" object shifts the date exactly forward by 24 hours.

  const days = Math.floor(absTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (absTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((absTime % (1000 * 60 * 60)) / (1000 * 60));

  let text = "";

  if (timeRemaining < 0) {
    // Overdue
    if (days > 0) {
      text = `Overdue by ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      text = `Overdue by ${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      text = `Overdue by ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      text = "Due now!";
    }
  } else if (timeRemaining === 0) {
    text = "Due now!";
  } else {
    // Due in future
    if (days === 0 && hours === 0) {
      text = `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (days === 0) {
      text = `Due in ${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (days === 1) {
      text = "Due tomorrow";
    } else {
      text = `Due in ${days} days`;
    }
  }

  // Update the DOM
  const timeElement = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
  );
  if (timeElement) {
    timeElement.textContent = text;
  }
}

// Run immediately
updateTimeRemaining();

// Refresh every 60 seconds (per task spec: 30-60 seconds)
setInterval(updateTimeRemaining, 60000);

// Debug: Confirm script loaded
console.log("Todo Card script loaded successfully!");
