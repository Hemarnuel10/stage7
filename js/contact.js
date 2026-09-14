function showFieldError(input, message){
    clearFieldError(input);
    input.classList.remove("ring-[#EAEAEA]");
    input.classList.add("ring-red-400", "ring-2");
    input.setAttribute("aria-invalid", "true");
    const error = document.createElement("p");
    error.className = "field-error text-[11px] text-red-500 mt-1";
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
}

function clearFieldError(input){
    input.classList.remove("ring-red-400", "ring-2");
    input.classList.add("ring-[#EAEAEA]");
    input.removeAttribute("aria-invalid");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("field-error")) next.remove();
}

function validateContactForm(form) {
  let isValid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    clearFieldError(field);
    if (!field.value.trim()) {
      showFieldError(field, "This field is required");
      isValid = false;
    } else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
      showFieldError(field, "Enter a valid email address.");
      isValid = false;
    }
  });
  return isValid;
}

const contactFormElement = document.querySelector("#contact-form");
const contactSuccess = document.querySelector("#contact-success");

if (contactFormElement) contactFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const contactForm = event.target;

  contactSuccess?.classList.add("hidden");

  if (!validateContactForm(contactForm)) {
    const firstError = document.querySelector(".field-error");
    if (firstError) firstError.closest("div")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  contactForm.reset();
  contactSuccess?.classList.remove("hidden");
});