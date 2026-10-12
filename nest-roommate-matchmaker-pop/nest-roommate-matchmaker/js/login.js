// ===== Nest: login and registration ====

const auth = window.NestAuth;

const loginCard = document.getElementById("loginCard");
const registerCard = document.getElementById("registerCard");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailFeedback = document.getElementById("emailFeedback");
const passwordFeedback = document.getElementById("passwordFeedback");
const loginNotice = document.getElementById("loginNotice");
const loginAlert = document.getElementById("loginAlert");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");
const rememberMe = document.getElementById("rememberMe");
const ruleItems = document.querySelectorAll("#passwordRules [data-rule]");

const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword = document.getElementById("registerConfirmPassword");
const registerAlert = document.getElementById("registerAlert");
const registerBtn = document.getElementById("registerBtn");
const toggleRegisterPassword = document.getElementById("toggleRegisterPassword");
const registerRuleItems = document.querySelectorAll("#registerPasswordRules [data-rule]");

const touched = { email: false, password: false, username: false, registerEmail: false, registerPassword: false, registerConfirm: false };

function passwordChecks(value) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /[0-9]/.test(value)
  };
}

function showFieldState(input, feedbackEl, message) {
  const invalid = message !== "";
  input.classList.toggle("is-invalid", invalid);
  input.classList.toggle("is-valid", !invalid);
  input.setAttribute("aria-invalid", invalid);
  feedbackEl.textContent = message;
  feedbackEl.classList.toggle("d-block", invalid);
}

function updateRuleList(input, items) {
  const checks = passwordChecks(input.value);
  items.forEach((item) => {
    const met = checks[item.dataset.rule];
    item.classList.toggle("met", met);
  });
}

function showAlert(alertEl, title, messages) {
  alertEl.innerHTML = `<strong>${title}</strong><ul class="mb-0 mt-1">${messages.map((message) => `<li>${message}</li>`).join("")}</ul>`;
  alertEl.classList.remove("alert-success", "d-none");
  alertEl.classList.add("alert-danger");
  alertEl.setAttribute("role", "alert");
  alertEl.setAttribute("aria-live", "assertive");
}

function hideAlert(alertEl) {
  alertEl.classList.add("d-none");
}

function goToHome() {
  window.location.href = "home.html";
}

function showSuccess(alertEl, message) {
  alertEl.textContent = message;
  alertEl.classList.remove("alert-danger", "d-none");
  alertEl.classList.add("alert-success");
  alertEl.setAttribute("role", "status");
  alertEl.setAttribute("aria-live", "polite");
}

function setAuthMode(mode) {
  const isLogin = mode === "login";
  loginCard.classList.toggle("d-none", !isLogin);
  registerCard.classList.toggle("d-none", isLogin);
}

function validateLoginEmail() {
  const message = auth.validateEmail(emailInput.value);
  if (touched.email) showFieldState(emailInput, emailFeedback, message);
  return message;
}

function validateLoginPassword() {
  const message = auth.validatePassword(passwordInput.value);
  if (touched.password) showFieldState(passwordInput, passwordFeedback, message);
  return message;
}

function validateRegisterUsername() {
  const message = auth.validateUsername(registerUsername.value);
  if (touched.username) showFieldState(registerUsername, document.getElementById("registerUsernameFeedback"), message);
  return message;
}

function validateRegisterEmail() {
  const message = auth.validateEmail(registerEmail.value);
  if (touched.registerEmail) showFieldState(registerEmail, document.getElementById("registerEmailFeedback"), message);
  return message;
}

function validateRegisterPassword() {
  const message = auth.validatePassword(registerPassword.value);
  if (touched.registerPassword) showFieldState(registerPassword, document.getElementById("registerPasswordFeedback"), message);
  return message;
}

function validateRegisterConfirmPassword() {
  const message = auth.validateConfirmPassword(registerPassword.value, registerConfirmPassword.value);
  if (touched.registerConfirm) showFieldState(registerConfirmPassword, document.getElementById("registerConfirmPasswordFeedback"), message);
  return message;
}

emailInput.addEventListener("blur", () => { touched.email = true; validateLoginEmail(); });
emailInput.addEventListener("input", () => { validateLoginEmail(); hideAlert(loginAlert); });

passwordInput.addEventListener("blur", () => { touched.password = true; validateLoginPassword(); });
passwordInput.addEventListener("input", () => { updateRuleList(passwordInput, ruleItems); validateLoginPassword(); hideAlert(loginAlert); });

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

  const errors = [validateLoginEmail(), validateLoginPassword()].filter((message) => message !== "");

  if (errors.length > 0) {
    showAlert(loginAlert, "Fix this to sign in:", errors);
    (emailInput.classList.contains("is-invalid") ? emailInput : passwordInput).focus();
    return;
  }

  hideAlert(loginAlert);
  loginBtn.disabled = true;
  loginBtn.querySelector(".spinner-border").classList.remove("d-none");
  loginBtn.querySelector(".btn-label").textContent = "Signing in";

  const authResult = auth.loginUser({
    email: emailInput.value,
    password: passwordInput.value,
    createIfMissing: true
  });

  if (!authResult.ok) {
    loginBtn.disabled = false;
    loginBtn.querySelector(".spinner-border").classList.add("d-none");
    loginBtn.querySelector(".btn-label").textContent = "Sign in";
    showAlert(loginAlert, "We couldn't sign you in:", [authResult.message]);
    return;
  }

  auth.saveCurrentUser(authResult.account, rememberMe.checked);
  showSuccess(loginNotice, `Signed in successfully. Welcome, ${authResult.account.username}! Redirecting...`);
  setTimeout(goToHome, 1200);
});

registerUsername.addEventListener("blur", () => { touched.username = true; validateRegisterUsername(); });
registerUsername.addEventListener("input", () => { validateRegisterUsername(); hideAlert(registerAlert); });

registerEmail.addEventListener("blur", () => { touched.registerEmail = true; validateRegisterEmail(); });
registerEmail.addEventListener("input", () => { validateRegisterEmail(); hideAlert(registerAlert); });

registerPassword.addEventListener("blur", () => { touched.registerPassword = true; validateRegisterPassword(); });
registerPassword.addEventListener("input", () => {
  updateRuleList(registerPassword, registerRuleItems);
  validateRegisterPassword();
  if (touched.registerConfirm) validateRegisterConfirmPassword();
  hideAlert(registerAlert);
});

registerConfirmPassword.addEventListener("blur", () => { touched.registerConfirm = true; validateRegisterConfirmPassword(); });
registerConfirmPassword.addEventListener("input", () => { validateRegisterConfirmPassword(); hideAlert(registerAlert); });

toggleRegisterPassword.addEventListener("click", () => {
  const showing = registerPassword.type === "text";
  registerPassword.type = showing ? "password" : "text";
  toggleRegisterPassword.textContent = showing ? "Show" : "Hide";
  toggleRegisterPassword.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  toggleRegisterPassword.setAttribute("aria-pressed", String(!showing));
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  touched.username = true;
  touched.registerEmail = true;
  touched.registerPassword = true;
  touched.registerConfirm = true;

  const errors = [
    validateRegisterUsername(),
    validateRegisterEmail(),
    validateRegisterPassword(),
    validateRegisterConfirmPassword()
  ].filter((message) => message !== "");

  if (errors.length > 0) {
    showAlert(registerAlert, "Fix these before creating your account:", errors);
    const firstInvalid = [registerUsername, registerEmail, registerPassword, registerConfirmPassword].find((input) => input.classList.contains("is-invalid"));
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  hideAlert(registerAlert);
  registerBtn.disabled = true;
  registerBtn.querySelector(".spinner-border").classList.remove("d-none");
  registerBtn.querySelector(".btn-label").textContent = "Creating account";

  const result = auth.registerUser({
    username: registerUsername.value,
    email: registerEmail.value,
    password: registerPassword.value
  });

  if (!result.ok) {
    registerBtn.disabled = false;
    registerBtn.querySelector(".spinner-border").classList.add("d-none");
    registerBtn.querySelector(".btn-label").textContent = "Create account";
    showAlert(registerAlert, "We couldn't create your account:", [result.message]);
    return;
  }

  auth.saveCurrentUser(result.account, true);
  showSuccess(registerAlert, `Account created successfully. Welcome, ${result.account.username}! Redirecting...`);
  setTimeout(goToHome, 1200);
});

document.getElementById("switchToRegister").addEventListener("click", () => setAuthMode("register"));
document.getElementById("switchToLogin").addEventListener("click", () => setAuthMode("login"));

const forgotForm = document.getElementById("forgotForm");
const forgotEmail = document.getElementById("forgotEmail");
const forgotFeedback = document.getElementById("forgotFeedback");
const forgotSuccess = document.getElementById("forgotSuccess");

forgotForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = auth.validateEmail(forgotEmail.value);
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

if (auth.readCurrentUser()) {
  goToHome();
}

setAuthMode("login");

if (new URLSearchParams(window.location.search).get("signedOut") === "1") {
  showSuccess(loginNotice, "You have been signed out successfully.");
  window.history.replaceState({}, document.title, window.location.pathname);
}
