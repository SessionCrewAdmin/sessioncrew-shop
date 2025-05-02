document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCartOverlay(cart);
});

function renderCartOverlay(cart) {
  const overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0; right: 0;
    width: 400px; max-width: 100%;
    height: 100vh;
    background: #111;
    color: white;
    box-shadow: -4px 0 20px rgba(0,0,0,0.5);
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  `;
  overlay.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0;">🛒 Warenkorb</h2>
      <button onclick="toggleCart()" style="font-size:1.5rem; background:none; color:white; border:none;">×</button>
    </div>
    <p id="versandhinweis" style="margin: 1rem 0; color: #ccc;"></p>
    <div id="cart-items" style="flex:1; overflow-y:auto;"></div>
    <div style="margin-top:1rem;">
      <p style="text-align:right; font-size: 1.2rem;">Gesamt: <strong id="cart-total">0,00 €</strong></p>
      <button class="button" style="width:100%; background:#f00; color:white; font-weight:bold; padding:1rem; border:none; border-radius:8px; cursor:pointer;">ZUR KASSE</button>
    </div>
  `;

  document.body.appendChild(overlay);
  updateCartOverlay();
}

function toggleCart() {
  const cartEl = document.getElementById("cart-overlay");
  if (cartEl) {
    const visible = cartEl.style.transform === "translateX(0%)";
    cartEl.style.transform = visible ? "translateX(100%)" : "translateX(0%)";
  }
}

function updateCartOverlay() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  const versandHinweis = document.getElementById("versandhinweis");

  list.innerHTML = "";
  let sum = 0;

  cart.forEach((item, index) => {
    const container = document.createElement("div");
    container.style.cssText = "display:flex; gap:1rem; margin-bottom:1.5rem; align-items:center;";

    container.innerHTML = `
      <img src="${item.image || 'platzhalter.jpg'}" style="width:70px; height:70px; object-fit:cover; border-radius:4px;">
      <div style="flex:1;">
        <strong>${item.name}</strong><br>
        <small>${item.size} / ${item.color || 'Farbe'}</small><br>
        <small>${item.price.toFixed(2)} €</small>
      </div>
      <div>
        <button onclick="removeItem(${index})" style="background:none; color:#f55; border:none; cursor:pointer;">Entfernen</button>
      </div>
    `;

    list.appendChild(container);
    sum += item.price;
  });

  total.textContent = sum.toFixed(2) + " €";

  const rest = 100 - sum;
  versandHinweis.textContent = rest > 0
    ? `Füge deiner Bestellung Artikel im Wert von ${rest.toFixed(2)} € hinzu und erhalte kostenlosen Versand!`
    : `🎉 Du hast kostenlosen Versand erreicht!`;
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartOverlay();
}

function addToCart(name, size = "M", price = 29.99, image = "", color = "") {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, size, price, image, color });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartOverlay();
  toggleCart();
}

function addToCartAuto() {
  const name = document.getElementById("produktname")?.innerText || "Unbenannt";
  const size = document.getElementById("groesse")?.value || "M";
  const priceText = document.getElementById("preis")?.innerText || "0,00 €";
  const price = parseFloat(priceText.replace(",", ".").replace("€", "").trim()) || 0;
  const image = document.getElementById("produktbild")?.getAttribute("src") || "";
  const color = document.getElementById("farbe")?.innerText || "unbekannt";

  addToCart(name, size, price, image, color);
}
