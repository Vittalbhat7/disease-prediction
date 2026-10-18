"use strict";
/* Home page: highlight the nav link of the section currently in view. */
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('#navLinks a[href^="#"]');
  if (!("IntersectionObserver" in window) || !links.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["modules", "how", "about"].forEach((id) => {
    const s = document.getElementById(id);
    if (s) observer.observe(s);
  });
});
