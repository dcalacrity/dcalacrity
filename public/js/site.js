(function () {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    const status = document.querySelector("#contact-status");
    const submitBtn = document.querySelector("#contact-submit");

    const setStatus = (kind, text) => {
      if (!status) return;
      status.hidden = false;
      status.className = "form-status" + (kind ? " is-" + kind : "");
      status.textContent = text;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

      const data = new FormData(form);
      const payload = {
        name: (data.get("name") || "").toString().trim(),
        email: (data.get("email") || "").toString().trim(),
        phone: (data.get("phone") || "").toString().trim(),
        organization: (data.get("organization") || "").toString().trim(),
        topic: (data.get("topic") || "").toString().trim(),
        projectType: (data.get("projectType") || "").toString().trim(),
        budget: (data.get("budget") || "").toString().trim(),
        timeline: (data.get("timeline") || "").toString().trim(),
        source: (data.get("source") || "").toString().trim(),
        message: (data.get("message") || "").toString().trim(),
        website: (data.get("website") || "").toString().trim(),
      };

      let valid = true;
      ["name", "email", "topic", "message"].forEach((key) => {
        const field = form.elements.namedItem(key);
        if (!payload[key] && field) {
          field.classList.add("is-invalid");
          valid = false;
        }
      });
      if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        const field = form.elements.namedItem("email");
        if (field) field.classList.add("is-invalid");
        valid = false;
      }
      if (!valid) {
        setStatus("error", "Please fill in the required fields.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      setStatus("", "Sending your message…");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok || !result.ok) {
          throw new Error(result.error || "Send failed");
        }
        form.reset();
        setStatus(
          "success",
          result.message ||
            "Message sent. Check your inbox if FormSubmit asks you to confirm — then we’ll reply from dcalacrity@gmail.com."
        );
      } catch (err) {
        // Fallback: open a draft so the user is never stuck
        const subject = encodeURIComponent(`[dcalacrity.com] ${payload.topic || "Inquiry"} — ${payload.name}`);
        const body = encodeURIComponent(
          [
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            `Phone: ${payload.phone || "—"}`,
            `Organization: ${payload.organization || "—"}`,
            `Topic: ${payload.topic}`,
            `Project type: ${payload.projectType || "—"}`,
            `Budget: ${payload.budget || "—"}`,
            `Timeline: ${payload.timeline || "—"}`,
            `Found us via: ${payload.source || "—"}`,
            "",
            payload.message,
          ].join("\n")
        );
        setStatus(
          "error",
          "Couldn’t send from the site just now. Opening an email draft instead — or write dcalacrity@gmail.com directly."
        );
        window.location.href = `mailto:dcalacrity@gmail.com?subject=${subject}&body=${body}`;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      }
    });
  }

  // Year in footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
