// === Global Variables ===
let cartItems = [];
let isLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
  // === Sidebar Toggle ===
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const closeSidebarBtn = document.getElementById("close-sidebar");

  if (hamburger && sidebar && overlay && closeSidebarBtn) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("open");
      overlay.classList.add("active");
    });
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
  }

  // === Back to Top Button ===
  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (backToTopBtn) {
      backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    }
  });
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === Close Banners ===
  const announcement = document.getElementById("announcement");
  const closeAnnouncement = document.getElementById("close-announcement");
  if (closeAnnouncement && announcement) {
    closeAnnouncement.addEventListener("click", () => {
      announcement.style.display = "none";
    });
  }

  const orderAnnouncement = document.querySelector("#order-announcement");
  const closeOrderBanner = document.querySelector(".close-order-banner");
  if (closeOrderBanner && orderAnnouncement) {
    closeOrderBanner.addEventListener("click", () => {
      orderAnnouncement.style.display = "none";
    });
  }

  // === Menu Availability ===
  const hour = new Date().getHours();
  const breakfastMenu = document.getElementById("breakfast-menu");
  const regularMenu = document.getElementById("regular-menu");
  const breakfastNote = document.getElementById("breakfast-note");
  const regularNote = document.getElementById("regular-note");

  if (breakfastMenu && regularMenu && breakfastNote && regularNote) {
    if (hour >= 5 && hour < 10) {
      breakfastNote.textContent = "Breakfast menu available now (5:00 AM – 10:00 AM)";
      regularNote.textContent = "Regular menu unavailable until 10:00 AM";
      regularMenu.classList.add("unavailable");
      regularMenu.style.opacity = "0.5";
      regularMenu.style.pointerEvents = "none";
    } else {
      breakfastNote.textContent = "Breakfast menu available only from 5:00 AM to 10:00 AM";
      regularNote.textContent = "Regular menu available now (10:00 AM – 4:00 AM)";
      breakfastMenu.classList.add("unavailable");
      breakfastMenu.style.opacity = "0.5";
      breakfastMenu.style.pointerEvents = "none";
    }
  }

  // === Add to Cart ===
  const cartList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const qty = parseInt(btn.previousElementSibling.value);
      cartItems.push({ name, price, qty });
      renderCart();
    });
  });

  function renderCart() {
    if (!cartList || !cartTotal || !checkoutBtn) return;
    cartList.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.qty} × ${item.name} = RM${(item.qty * item.price).toFixed(2)}
        <button class="remove-btn" onclick="removeItem(${i})">Remove</button>`;
      cartList.appendChild(li);
      total += item.qty * item.price;
    });

    cartTotal.textContent = total.toFixed(2);
    checkoutBtn.style.display = cartItems.length ? "inline-block" : "none";
  }

  window.removeItem = function (index) {
    cartItems.splice(index, 1);
    renderCart();
  };

  // === Login & Checkout ===
  const loginModal = document.getElementById("login-modal");
  const checkoutModal = document.getElementById("checkout-modal");
  const loginForm = document.getElementById("login-form");

  if (checkoutBtn && loginModal && checkoutModal) {
    checkoutBtn.addEventListener("click", () => {
      if (!isLoggedIn) {
        loginModal.style.display = "flex";
      } else {
        updateCheckoutCartFromMainCart();
        checkoutModal.style.display = "flex";
      }
    });
  }

  if (loginForm && checkoutModal) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      isLoggedIn = true;
      loginModal.style.display = "none";
      updateCheckoutCartFromMainCart();
      checkoutModal.style.display = "flex";
    });
  }

  document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Order placed! Thank you for your purchase.");
    cartItems = [];
    renderCart();
    checkoutModal.style.display = "none";
  });

  [loginModal, checkoutModal].forEach(modal => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  });

  // === Auth Modal Switch ===
  document.getElementById("open-signup")?.addEventListener("click", function () {
    loginModal.style.display = "none";
    document.getElementById("signup-modal").style.display = "flex";
  });

  document.getElementById("open-login")?.addEventListener("click", function () {
    document.getElementById("signup-modal").style.display = "none";
    loginModal.style.display = "flex";
  });

  document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("signup-modal").style.display = "none";
    loginModal.style.display = "flex";
    alert("Account created successfully! Please log in.");
  });

  // === Promo Code Logic ===
  const applyBtn = document.getElementById("apply-promo");
  const promoInput = document.getElementById("promo");
  const message = document.getElementById("promo-message");
  const checkoutTotalEl = document.getElementById("checkout-cart-total");

  let promoApplied = false;

  applyBtn?.addEventListener("click", () => {
    const enteredCode = promoInput.value.trim().toUpperCase();

    if (promoApplied) {
      message.textContent = "Promo already applied.";
      message.style.color = "green";
      return;
    }

    const totalText = checkoutTotalEl.textContent.replace("RM", "").trim();
    const currentTotal = parseFloat(totalText);

    if (isNaN(currentTotal)) {
      message.textContent = "Error reading cart total.";
      message.style.color = "red";
      return;
    }

    let discountedTotal;
    if (enteredCode === "ROYAL60") {
      discountedTotal = (currentTotal * 0.4).toFixed(2); // 60% off
      message.textContent = "ROYAL60 applied – 60% off!";
    } else if (enteredCode === "HAZIQHENSEM") {
      discountedTotal = (0).toFixed(2); // 100% off
      message.textContent = "HAZIQHENSEM applied – Everything is FREE!";
    } else {
      message.textContent = "Invalid promo code.";
      message.style.color = "red";
      return;
    }

    checkoutTotalEl.textContent = `RM${discountedTotal}`;
    message.style.color = "green";
    promoApplied = true;
  });
});

// === Sync Cart to Checkout Modal ===
function updateCheckoutCartFromMainCart() {
  const targetCartContainer = document.getElementById("checkout-cart-items");
  const targetTotal = document.getElementById("checkout-cart-total");
  const targetCount = document.getElementById("checkout-cart-count");

  if (!targetCartContainer || !targetTotal || !targetCount) return;

  targetCartContainer.innerHTML = "";
  let total = 0;

  cartItems.forEach(item => {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${item.qty} × ${item.name}`;

    const span = document.createElement("span");
    span.className = "price";
    span.textContent = `RM${(item.qty * item.price).toFixed(2)}`;

    p.appendChild(a);
    p.appendChild(span);
    targetCartContainer.appendChild(p);

    total += item.qty * item.price;
  });

  targetTotal.textContent = `RM${total.toFixed(2)}`;
  targetCount.textContent = cartItems.length;
}
