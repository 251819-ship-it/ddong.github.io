(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 시간대별 인사말 */
  function setGreeting() {
    const el = document.getElementById("greeting");
    if (!el) return;

    const hour = new Date().getHours();
    let message = "안녕하세요";

    if (hour >= 5 && hour < 12) {
      message = "좋은 아침입니다";
    } else if (hour >= 12 && hour < 18) {
      message = "좋은 오후입니다";
    } else if (hour >= 18 && hour < 22) {
      message = "좋은 저녁입니다";
    } else {
      message = "안녕하세요";
    }

    el.textContent = message;
  }

  /* 한 줄 소개 타이핑 효과 */
  function typeTagline() {
    const el = document.getElementById("tagline");
    if (!el) return;

    const text = el.dataset.text || "";

    if (prefersReducedMotion) {
      el.textContent = text;
      return;
    }

    let index = 0;
    el.innerHTML = '<span class="typed"></span><span class="cursor" aria-hidden="true"></span>';
    const typed = el.querySelector(".typed");
    const cursor = el.querySelector(".cursor");

    const timer = setInterval(function () {
      typed.textContent = text.slice(0, index + 1);
      index += 1;

      if (index >= text.length) {
        clearInterval(timer);
        setTimeout(function () {
          if (cursor) cursor.remove();
        }, 1200);
      }
    }, 55);
  }

  /* 스크롤 시 섹션 등장 */
  function revealSections() {
    const sections = document.querySelectorAll(".section");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach(function (section) {
        section.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* 현재 보고 있는 섹션 메뉴 강조 */
  function setupScrollSpy() {
    const links = document.querySelectorAll("#navLinks a");
    const ids = Array.from(links)
      .map(function (link) {
        return link.getAttribute("href");
      })
      .filter(Boolean)
      .map(function (href) {
        return href.slice(1);
      });

    const sections = ids
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    function updateActive() {
      const scrollY = window.scrollY + 120;
      let currentId = sections[0].id;

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollY) {
          currentId = section.id;
        }
      });

      links.forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + currentId;
        link.classList.toggle("is-active", isActive);
      });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  /* 맨 위로 버튼 */
  function setupBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;

    window.addEventListener(
      "scroll",
      function () {
        button.classList.toggle("is-shown", window.scrollY > 400);
      },
      { passive: true }
    );

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* 다크 / 라이트 테마 */
  function setupThemeToggle() {
    const button = document.getElementById("themeToggle");
    if (!button) return;

    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("theme-dark");
      button.textContent = "라이트";
    }

    button.addEventListener("click", function () {
      const isDark = document.body.classList.toggle("theme-dark");
      button.textContent = isDark ? "라이트" : "다크";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  setGreeting();
  typeTagline();
  revealSections();
  setupScrollSpy();
  setupBackToTop();
  setupThemeToggle();
})();
