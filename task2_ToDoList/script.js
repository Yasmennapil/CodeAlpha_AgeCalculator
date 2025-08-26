const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// تحميل المهام من localStorage
document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTask);

// ✅ إضافة مهمة بالـ Enter من الـ input
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${taskText}</span>
    <div>
      <button class="done">✔</button>
      <button class="edit">✏️</button>
      <button class="delete">✖</button>
    </div>
  `;

  addTaskEvents(li);
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasks();
}

function addTaskEvents(li) {
  // زرار Done
  li.querySelector(".done").addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  // زرار Delete
  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  // زرار Edit (Inline Editing)
  li.querySelector(".edit").addEventListener("click", () => {
    const span = li.querySelector("span");
    span.contentEditable = true;   // يخلي النص قابل للتعديل
    span.focus();

    // لما تدوسي Enter أثناء التعديل
    span.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault(); // يمنع نزول سطر جديد
        span.contentEditable = false;
        saveTasks();
      }
    });

    // أو لو خرجتي برة
    span.addEventListener("blur", () => {
      span.contentEditable = false;
      saveTasks();
    });
  });
}

// حفظ المهام في localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// تحميل المهام
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="done">✔</button>
        <button class="edit">✏️</button>
        <button class="delete">✖</button>
      </div>
    `;
    if (task.completed) li.classList.add("completed");
    addTaskEvents(li);
    taskList.appendChild(li);
  });
}
