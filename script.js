// 1. DOM ELEMENTS


// View Mode Elements
const viewMode = document.querySelector(".view-mode");
const card = document.querySelector('[data-testid="test-todo-card"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const description = document.querySelector(
  '[data-testid="test-todo-description"]',
);
const priorityBadge = document.querySelector(
  '[data-testid="test-todo-priority"]',
);
const priorityIndicator = document.querySelector(
  '[data-testid="test-todo-priority-indicator"]',
);
const dueDateElement = document.querySelector(
  '[data-testid="test-todo-due-date"]',
);
const timeElement = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const overdueIndicator = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]',
);
const todoStatus = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.querySelector(
  '[data-testid="test-todo-status-control"]',
);
const checkbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const expandToggle = document.querySelector(
  '[data-testid="test-todo-expand-toggle"]',
);
const collapsible = document.querySelector(
  '[data-testid="test-todo-collapsible-section"]',
);

// Edit Mode Elements
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = document.querySelector(
  '[data-testid="test-todo-edit-title-input"]',
);
const editDescInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]',
);
const editPrioritySelect = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]',
);
const editDueDateInput = document.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]',
);
const saveButton = document.querySelector(
  '[data-testid="test-todo-save-button"]',
);
const cancelButton = document.querySelector(
  '[data-testid="test-todo-cancel-button"]',
);

// Buttons
const editButton = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
);
const deleteButton = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);


// 2. STATE MANAGEMENT


let currentState = {
  title: "Todo Card Component",
  description:
    "Build a todo card component that displays a title and description. The component should be reusable and styled appropriately.",
  priority: "High",
  dueDate: "2026-04-16",
  status: "Pending",
};

let timeUpdateInterval = null;


// 3. PRIORITY INDICATOR UPDATE


function updatePriorityIndicator(priority) {
  // Remove existing priority classes
  card.classList.remove("priority-high", "priority-medium", "priority-low");

  // Add new priority class
  const priorityClass = `priority-${priority.toLowerCase()}`;
  card.classList.add(priorityClass);

  // Update data attribute
  card.setAttribute("data-priority", priority);

  // Update badge text with icon
  const icons = { High: "🔴", Medium: "🟡", Low: "🟢" };
  priorityBadge.textContent = `${icons[priority]} ${priority}`;
  priorityBadge.setAttribute(
    "aria-label",
    `priority-${priority.toLowerCase()}`,
  );
}


// 4. STATUS SYNC


function updateStatus(status) {
  currentState.status = status;

  // Update status badge
  const statusIcons = { Pending: "🔄", "In Progress": "⏳", Done: "✅" };
  todoStatus.textContent = `${statusIcons[status]} ${status}`;
  todoStatus.setAttribute(
    "aria-label",
    `status-${status.toLowerCase().replace(" ", "-")}`,
  );

  // Update dropdown
  statusControl.value = status;

  // Update checkbox
  checkbox.checked = status === "Done";

  // Update title style
  if (status === "Done") {
    title.style.textDecoration = "line-through";
    card.classList.add("status-done");
  } else {
    title.style.textDecoration = "none";
    card.classList.remove("status-done");
  }

  // Update time display (stops if Done)
  updateTimeDisplay();
}

// Status control change handler
statusControl.addEventListener("change", (e) => {
  updateStatus(e.target.value);
});

// Checkbox change handler
checkbox.addEventListener("change", () => {
  const newStatus = checkbox.checked ? "Done" : "Pending";
  updateStatus(newStatus);
});


// 5. TIME MANAGEMENT


function formatTimeRemaining(dueDate) {
  const now = new Date();
  const diffMs = dueDate - now;
  const absDiff = Math.abs(diffMs);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (diffMs < 0) {
    // Overdue
    if (days > 0) return `Overdue by ${days} day${days !== 1 ? "s" : ""}`;
    if (hours > 0) return `Overdue by ${hours} hour${hours !== 1 ? "s" : ""}`;
    return `Overdue by ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  // Due in future
  if (days > 1) return `Due in ${days} days`;
  if (days === 1) return "Due tomorrow";
  if (hours >= 2) return `Due in ${hours} hours`;
  if (hours === 1) return "Due in 1 hour";
  if (minutes > 1) return `Due in ${minutes} minutes`;
  return "Due now!";
}

function updateTimeDisplay() {
  // If status is Done, show Completed and stop
  if (currentState.status === "Done") {
    timeElement.textContent = "✅ Completed";
    overdueIndicator.hidden = true;
    card.classList.remove("overdue");
    return;
  }

  const dueDate = new Date(currentState.dueDate + "T23:59:59");
  const now = new Date();
  const isOverdue = now > dueDate;

  // Update time text
  timeElement.textContent = `⏰ ${formatTimeRemaining(dueDate)}`;

  // Show/hide overdue indicator
  overdueIndicator.hidden = !isOverdue;

  // Add/remove overdue class
  card.classList.toggle("overdue", isOverdue);
}

function startTimeUpdates() {
  if (timeUpdateInterval) clearInterval(timeUpdateInterval);

  updateTimeDisplay();
  timeUpdateInterval = setInterval(() => {
    if (currentState.status !== "Done") {
      updateTimeDisplay();
    }
  }, 60000);
}


// 6. EXPAND / COLLAPSE


expandToggle.addEventListener("click", () => {
  const isExpanded = expandToggle.getAttribute("aria-expanded") === "true";

  expandToggle.setAttribute("aria-expanded", !isExpanded);
  collapsible.hidden = isExpanded;
  expandToggle.textContent = isExpanded ? "Show more ▼" : "Show less ▲";
});


// 7. EDIT MODE


function openEditMode() {
  // Populate form with current values
  editTitleInput.value = currentState.title;
  editDescInput.value = currentState.description;
  editPrioritySelect.value = currentState.priority;
  editDueDateInput.value = currentState.dueDate;

  // Show edit form, hide view mode
  viewMode.hidden = true;
  editForm.hidden = false;

  // Focus on title input
  editTitleInput.focus();
}

function closeEditMode() {
  viewMode.hidden = false;
  editForm.hidden = true;
}

function saveChanges() {
  // Update state
  currentState.title = editTitleInput.value;
  currentState.description = editDescInput.value;
  currentState.priority = editPrioritySelect.value;
  currentState.dueDate = editDueDateInput.value;

  // Update view mode
  title.textContent = currentState.title;
  description.textContent = currentState.description;
  dueDateElement.textContent = `📅 Due ${new Date(currentState.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  dueDateElement.setAttribute("datetime", currentState.dueDate);

  // Update priority
  updatePriorityIndicator(currentState.priority);

  // Update time display
  updateTimeDisplay();

  closeEditMode();
}

editButton.addEventListener("click", openEditMode);

cancelButton.addEventListener("click", () => {
  closeEditMode();
});

saveButton.addEventListener("click", saveChanges);

// Close edit form on Escape key
editForm.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeEditMode();
    editButton.focus();
  }
});


// 8. DELETE BUTTON


deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this task?")) {
    console.log("Task deleted");
    // Optional: card.remove();
  }
});


// 9. INITIALIZE


function init() {
  // Set initial priority indicator
  updatePriorityIndicator(currentState.priority);

  // Set initial status
  updateStatus(currentState.status);

  // Start time updates
  startTimeUpdates();

  // Set initial due date display
  dueDateElement.textContent = `📅 Due ${new Date(currentState.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  console.log("Stage 1a Todo Card initialized!");
}

init();
