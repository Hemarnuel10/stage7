document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const contactForm = event.target;

  if (!validateContactForm(contactForm)) {
    const firstError = document.querySelector(".field-error");
    if (firstError) firstError.closest("div")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  contactForm.reset();
  document.querySelector("#contact-success").classList.remove("hidden");
});