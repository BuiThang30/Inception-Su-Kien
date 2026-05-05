/* ══════════════════════════════
   SLIDER
══════════════════════════════ */
function createInfiniteSlider(sliderId, speed, direction) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const track = slider.querySelector(".track");
  let position = 0;

  function animate() {
    position += speed * direction;
    const width = track.scrollWidth / 2;
    if (direction === -1 && position <= -width) position += width;
    if (direction ===  1 && position >= 0)      position -= width;
    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

createInfiniteSlider("slider1", 0.4, -1);
createInfiniteSlider("slider2", 0.4,  1);


/* ══════════════════════════════
   HAMBURGER MENU + SCROLL + FORM
   (tất cả trong DOMContentLoaded)
══════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("navMenu");
  const navbar    = document.querySelector(".navbar");

  function navHeight() {
    return navbar ? navbar.offsetHeight : 80;
  }

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight();
    window.scrollTo({ top, behavior: "smooth" });
  }

  function openMenu() {
    navMenu.classList.add("open");
    hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navMenu.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- hamburger ---------- */
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    navMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  /* ---------- click ngoài để đóng ---------- */
  document.addEventListener("click", function (e) {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickHamburger  = hamburger.contains(e.target);

    if (!isClickInsideMenu && !isClickHamburger) {
      closeMenu();
    }
  });

  /* ---------- resize ---------- */
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeMenu();
  });

  /* ---------- nav links ---------- */
  navMenu.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").slice(1);
      closeMenu();
      scrollToId(targetId);
    });
  });

  /* ---------- nút đăng ký ---------- */
  const btnDangKy = document.getElementById("btnDangKy");
  if (btnDangKy) {
    btnDangKy.addEventListener("click", function () {
      scrollToId("dangky");
    });
  }

  /* ══════════════════════════════
     FORM SUBMIT
  ══════════════════════════════ */
  const form = document.getElementById("registerForm");
  const btn  = document.getElementById("submitBtn");

  if (form && btn) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      btn.disabled  = true;
      btn.innerText = "Đang gửi...";

      const data = {
        name:     document.getElementById("name").value,
        phone:    document.getElementById("phone").value,
        email:    document.getElementById("email").value,
        question: document.getElementById("question").value
      };

      try {

        await Promise.all([

          //1. Gửi Google Sheet
          fetch(
            "https://script.google.com/macros/s/AKfycbxikuPtLOnBJ_AedvX-l8f-z5OwOaILNTbm95lTIrXvVVw95LNFlNMRjwKNpNu71jB2jw/exec",
            {
              method: "POST",
              mode: "no-cors",
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" }
            }
          ),

          // 2. Gửi API mail của bạn
          fetch("/api/mail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          })

        ]);

        btn.innerText = "Gửi thành công!";
        alert("Đăng ký thành công! Check email nhé!");
        form.reset();

      } catch (err) {
        console.error(err);
        btn.innerText = "Gửi thất bại!";
      }

      setTimeout(function () {
        btn.disabled  = false;
        btn.innerText = "Nhận Link Zoom và Quà Tặng";
      }, 2000);
    });
  }

});