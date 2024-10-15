let items = [];
let editingItemId = null;

let totalNumberOfTask = 0;
const itemElement = document.getElementById("item");
const formElement = document.getElementById("form-info");
const itemsElement = document.getElementById("items");
const addButtonElement = document.getElementById("add-btn");
const priorityElement = document.getElementById("priority");

const totalElement = document.getElementById("NumberOfTask");

const searchElement = document.getElementById("search");
const formSearchElement = document.getElementById("form-search");
const searchButtonElement = document.getElementById("search-btn");

//reset task
const resetForm = () => {
  itemElement.value = "";
  priorityElement.value = "";
  addButtonElement.textContent = "Add";
  editingItemId = null;
};

//update storage
const setDataToLocalStorage = (data) => {
  localStorage.setItem("items", JSON.stringify(data));
};

//get data from storage
const getDataFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// create new task
formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  items = getDataFromLocalStorage("items") || [];

  if (editingItemId) {
    // Update the existing item
    const updatedItem = items.find((item) => item.id === editingItemId);
    updatedItem.itemElement = itemElement.value;
    priorityElement.value = priorityElement.priority;

    setDataToLocalStorage(items);
    resetForm();
  } else {
    const newItem = {
      id: Date.now() + Math.random(),
      itemElement: itemElement.value,
      priority: priorityElement.value,
      completed: false,
    };
    items.push(newItem);
    setDataToLocalStorage(items);
    resetForm();
  }
  renderItems(items); // for update the output
});

//  Edit task
const updateItemById = (item) => {
  itemElement.value = item.itemElement;
  priorityElement.value = item.priority;
  editingItemId = item.id;
  addButtonElement.textContent = "Update";
};

// delete item
const deleteItemById = (id) => {
  items = items.filter((item) => item.id !== id);
  // console.log("item is deleted");
  setDataToLocalStorage(items);
  renderItems(items);
};

// Search item
const searchItemByKeyword = (keyword) => {
  return items.filter((item) =>
    item.itemElement.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Toggle task completion
const toggleTaskCompletion = (id) => {
  items = items.map((item) => {
    if (item.id === id) {
      item.completed = !item.completed; // when reclick it will reset to false
    }
    return item;
  });
  setDataToLocalStorage(items);
  renderItems(items);
};

const renderItems = (filteredItems) => {
  itemsElement.innerHTML = "";
  totalElement.textContent = `Total Number Of Tasks: ${filteredItems.length}`;

  if (filteredItems.length === 0) {
    const noItemsMessage = document.createElement("p");
    noItemsMessage.textContent = "No items found";
    itemsElement.appendChild(noItemsMessage);
  } else {
    //for listing task
    filteredItems.map((item) => {
      const itemDivElement = document.createElement("div");
      itemDivElement.classList.add("item");
      itemsElement.appendChild(itemDivElement);

      // Create the checkbox for completed tasks
      const itemCheckbox = document.createElement("input");
      itemCheckbox.type = "checkbox";
      itemCheckbox.checked = item.completed;
      itemCheckbox.addEventListener("change", () =>
        toggleTaskCompletion(item.id)
      );
      itemDivElement.appendChild(itemCheckbox);

      // Create the task text
      const itemText = document.createElement("span");
      itemText.textContent = `${item.itemElement}`;
      itemText.style.textDecoration = item.completed ? "line-through" : "none";
      itemDivElement.appendChild(itemText);

      // Create the priority label
      const priorityLabel = document.createElement("span");
      priorityLabel.textContent = ` ${item.priority}`;
      priorityLabel.classList.add(item.priority);
      itemDivElement.appendChild(priorityLabel);

      // craete Delete button
      const itemDeleteButton = document.createElement("button");
      itemDeleteButton.textContent = `Delete`;
      itemDeleteButton.classList.add("Delete");

      itemDeleteButton.addEventListener("click", () => deleteItemById(item.id));
      itemDivElement.appendChild(itemDeleteButton);

      // create Edit button
      const itemEditButton = document.createElement("button");
      itemEditButton.textContent = `Edit`;
      itemEditButton.classList.add("Edit");
      itemEditButton.addEventListener("click", () => updateItemById(item));
      itemDivElement.appendChild(itemEditButton);
    });
  }
};

// search
formSearchElement.addEventListener("click", (event) => {
  event.preventDefault();
  const keyword = searchElement.value;
  const filteredItems = searchItemByKeyword(keyword);
  renderItems(filteredItems);
  resetForm();
});
document.addEventListener("DOMContentLoaded", () => {
  items = getDataFromLocalStorage("items") || [];

  renderItems(items);
});
