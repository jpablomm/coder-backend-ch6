const socket = io();

socket.on("products", (products) => {
  const productsEl = document.getElementById("products");
  for (const item of products) {
    const newItemEl = document.createElement("tr");
    newItemEl.innerHTML = `
        <td>${item.title}</td>
        <td class="price">$${item.price}</td>
        <td>${item.thumbnail}</td>
        `;
    productsEl.appendChild(newItemEl);
  }
});

socket.on("new-item", (item) => {
  const productsEl = document.getElementById("products");
  const newItemEl = document.createElement("tr");
  newItemEl.innerHTML = `
        <td>${item.title}</td>
        <td class="price">$${item.price}</td>
        <td>${item.thumbnail}</td>
        `;
  productsEl.appendChild(newItemEl);
});

socket.on("messages", (messages) => {
  const messagesEl = document.getElementById("messages");
  for (const msg of messages) {
    const newMsg = document.createElement("p");
    newMsg.innerHTML = `<span class="msgUser">${msg.user}</span> <span class="msgTime">[${msg.timestamp}]</span>: <span class="msgBody">${msg.body}</span>`;
    messagesEl.appendChild(newMsg);
  }
});

socket.on("new-msg", (msg) => {
  const messagesEl = document.getElementById("messages");
  const newMsg = document.createElement("p");
  newMsg.innerHTML = `<span class="msgUser">${msg.user}</span> <span class="msgTime">[${msg.timestamp}]</span>: <span class="msgBody">${msg.body}</span>`;
  messagesEl.appendChild(newMsg);
});

document.getElementById("submitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = document.forms[0];
  socket.emit("new-product", {
    title: form.title.value,
    price: form.price.value,
    thumbnail: form.thumbnail.value,
  });
});

document.getElementById("submitMessage").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageForm = document.forms[1];
  console.log(messageForm);
  socket.emit("new-message", {
    user: document.getElementById("email").value,
    body: messageForm.message.value,
    timestamp: new Date(),
  });
});

document.getElementById("email").addEventListener("change", () => {
  const submitMsgBtn = document.getElementById("submitMsgBtn");
  const emailInput = document.getElementById("email").value;
  if (emailInput != "") {
    submitMsgBtn.removeAttribute("disabled");
  }
});

window.addEventListener("load", () => {
  fetch("http://localhost:8080/api/productos")
    .then((data) => data.json())
    .then((jsonData) => {
      const productsEl = document.getElementById("products");
      for (const item of jsonData) {
        const itemEl = document.createElement("tr");
        itemEl.innerHTML = `
        <td>${item.title}</td>
        <td  class="price">$${item.price}</td>
        <td>${item.thumbnail}</td>
        `;
        productsEl.appendChild(itemEl);
      }
    });
});
