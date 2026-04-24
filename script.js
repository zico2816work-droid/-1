const countBtn = document.getElementById("countBtn");
const countText = document.getElementById("countText");
const yearNode = document.getElementById("year");

let count = 0;

countBtn.addEventListener("click", () => {
  count += 1;
  countText.textContent = `你点击了 ${count} 次`;
});

yearNode.textContent = String(new Date().getFullYear());
