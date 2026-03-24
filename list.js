const budgetForm = document.getElementById("budgetForm");
const budgetList = document.getElementById("budgetList");
const totalAmount = document.getElementById("totalAmount");
const logoutBtn = document.getElementById("logoutBtn");
const welcome = document.getElementById("welcome");

// Check if user is logged in
let currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "index.html";
}

welcome.textContent = `Welcome, ${currentUser}!`;

// Load user’s budget list
let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
if (!budgets[currentUser]) {
    budgets[currentUser] = [];
}
renderList();

// Generate random color
function getRandomColor() {
    const colors = ["#00aaff", "#ff6600", "#28a745", "#6de5ebff", "#e83e8c", "#20c997,"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Adding items with Priority Logic(updated by Tendai)
budgetForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("itemName").value;
    const qty = parseInt(document.getElementById("itemQty").value);
    const price = parseFloat(document.getElementById("itemPrice").value);
    
    // 1. Get the priority value from new dropdown
    const priority = document.getElementById("itemPriority").value;

    // 2. Setting the color based on the priority requirement
    let color;
    if (priority === "high") {
        color = "#ff4444"; // Red
    } else if (priority === "medium") {
        color = "#ffae00"; // Orange
    } else {
        color = "#28a745"; // Green
    }

    const item = {
        name,
        qty,
        price,
        color: color, // Uses the priority-based color
        priority: priority,
        bought: false
    };

    budgets[currentUser].push(item);
    localStorage.setItem("budgets", JSON.stringify(budgets));

    renderList();
    budgetForm.reset();
});

// Render items
function renderList() {
    budgetList.innerHTML = "";
    let total = 0;

    budgets[currentUser].forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "list-item";
        li.style.backgroundColor = item.color;

        const cost = item.qty * item.price;
        if (!item.bought) total += cost; // Only add to total if not bought
        li.innerHTML = `
      <input type="checkbox" ${item.bought ? "checked" : ""} onchange="toggleBought(${index})">
      <span class="${item.bought ? "bought" : ""}">
        ${item.name} - Qty: ${item.qty} x ZMW ${item.price.toFixed(2)} = 
        <b>ZMW ${cost.toFixed(2)}</b>
      </span>
      <button onclick="deleteItem(${index})">Delete</button>
    `;
        budgetList.appendChild(li);
    });

    totalAmount.textContent = `ZMW ${total.toFixed(2)}`;
}

// Toggle bought status
function toggleBought(index) {
    budgets[currentUser][index].bought = !budgets[currentUser][index].bought;
    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderList();
}


function deleteItem(index) {
    budgets[currentUser].splice(index, 1);
    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderList();
}

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
});