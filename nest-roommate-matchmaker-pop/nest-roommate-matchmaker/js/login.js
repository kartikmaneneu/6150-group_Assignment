// ===== Nest: login page validation =====

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailFeedback = document.getElementById("emailFeedback");
const passwordFeedback = document.getElementById("passwordFeedback");
const loginAlert = document.getElementById("loginAlert");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");
const ruleItems = document.querySelectorAll("#passwordRules [data-rule]");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fields are only marked red after the user has left them once or tried to submit
const touched = { email: false, password: false };

// ----- Validation rules -----

function validateEmail(value) {
  const email = value.trim();
  if (email === "") return "Enter your university email.";
  if (!EMAIL_PATTERN.test(email)) return "That doesn't look like an email address. Check for a missing @ or dot.";
  if (!email.toLowerCase().endsWith(".edu")) return "Use your university email ending in .edu.";
  return "";
}

function passwordChecks(value) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /[0-9]/.test(value)
  };
}

function validatePassword(value) {
  if (value === "") return "Enter your password.";
  const checks = passwordChecks(value);
  if (!checks.length) return "Password needs at least 8 characters.";
  if (!checks.upper) return "Add at least one uppercase letter.";
  if (!checks.number) return "Add at least one number.";
  return "";
}

// ----- Showing results -----

function showFieldState(input, feedbackEl, message) {
  const invalid = message !== "";
  input.classList.toggle("is-invalid", invalid);
  input.classList.toggle("is-valid", !invalid);
  input.setAttribute("aria-invalid", invalid);
  feedbackEl.textContent = message;
  // Password feedback sits outside .form-floating, so Bootstrap can't show it automatically
  feedbackEl.classList.toggle("d-block", invalid);
}

function updateRuleList() {
  const checks = passwordChecks(passwordInput.value);
  ruleItems.forEach((item) => {
    const met = checks[item.dataset.rule];
    item.classList.toggle("met", met);
  });
}

function checkEmail() {
  const message = validateEmail(emailInput.value);
  if (touched.email) showFieldState(emailInput, emailFeedback, message);
  return message;
}

function checkPassword() {
  const message = validatePassword(passwordInput.value);
  if (touched.password) showFieldState(passwordInput, passwordFeedback, message);
  return message;
}

function showAlert(messages) {
  loginAlert.innerHTML = `<strong>Fix ${messages.length} ${messages.length === 1 ? "thing" : "things"} to sign in:</strong>
    <ul class="mb-0 mt-1">${messages.map((m) => `<li>${m}</li>`).join("")}</ul>`;
  loginAlert.classList.remove("d-none");
}

function hideAlert() {
  loginAlert.classList.add("d-none");
}

// ----- Navigation (kept in one function so it's easy to change) -----

function goToHome() {
  window.location.href = "home.html";
}

function nameFromEmail(email) {
  const first = email.split("@")[0].split(/[._-]/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

// ----- Events -----

emailInput.addEventListener("blur", () => { touched.email = true; checkEmail(); });
emailInput.addEventListener("input", () => { checkEmail(); hideAlert(); });

passwordInput.addEventListener("blur", () => { touched.password = true; checkPassword(); });
passwordInput.addEventListener("input", () => { updateRuleList(); checkPassword(); hideAlert(); });

togglePassword.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "Show" : "Hide";
  togglePassword.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  togglePassword.setAttribute("aria-pressed", String(!showing));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  touched.email = true;
  touched.password = true;

  const errors = [checkEmail(), checkPassword()].filter((m) => m !== "");

  if (errors.length > 0) {
    showAlert(errors);
    (emailInput.classList.contains("is-invalid") ? emailInput : passwordInput).focus();
    return;
  }

  hideAlert();

  // Loading state with Bootstrap spinner
  loginBtn.disabled = true;
  loginBtn.querySelector(".spinner-border").classList.remove("d-none");
  loginBtn.querySelector(".btn-label").textContent = "Signing in";

  try {
    sessionStorage.setItem("nestUser", nameFromEmail(emailInput.value.trim()));
  } catch (e) {
    // Storage can be unavailable (private mode); the home page falls back to a generic greeting
  }

  setTimeout(goToHome, 1200);
});

// ----- Forgot password modal -----

const forgotForm = document.getElementById("forgotForm");
const forgotEmail = document.getElementById("forgotEmail");
const forgotFeedback = document.getElementById("forgotFeedback");
const forgotSuccess = document.getElementById("forgotSuccess");

forgotForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = validateEmail(forgotEmail.value);
  forgotEmail.classList.toggle("is-invalid", message !== "");
  forgotFeedback.textContent = message;

  if (message === "") {
    forgotSuccess.textContent = `Reset link sent to ${forgotEmail.value.trim()}. Check your inbox.`;
    forgotSuccess.classList.remove("d-none");
  } else {
    forgotSuccess.classList.add("d-none");
  }
});

document.getElementById("forgotModal").addEventListener("hidden.bs.modal", () => {
  forgotForm.reset();
  forgotEmail.classList.remove("is-invalid");
  forgotSuccess.classList.add("d-none");
});
