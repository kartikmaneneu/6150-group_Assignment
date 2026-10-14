const ACCOUNT_STORAGE_KEY = "nestAccounts";
const USER_STORAGE_KEY = "nestUser";
const PASSWORD_ITERATIONS = 120000;

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginAlert = document.getElementById("loginAlert");
const loginButton = document.getElementById("loginBtn");
const loginSpinner = loginButton.querySelector(".spinner-border");
const loginLabel = loginButton.querySelector(".btn-label");

function isUniversityEmail(email) {
  return /^[^\s@]+@[^\s@]+\.edu$/i.test(email);
}

function passwordRules(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password)
  };
}

function updatePasswordRules() {
  const rules = passwordRules(passwordInput.value);
  document.querySelectorAll("#passwordRules [data-rule]").forEach((item) => {
    const valid = rules[item.dataset.rule];
    item.classList.toggle("text-success", valid);
    item.classList.toggle("text-body-secondary", !valid);
    item.setAttribute("aria-checked", String(valid));
  });
}

function setFieldError(input, feedback, message) {
  input.classList.toggle("is-invalid", Boolean(message));
  feedback.textContent = message;
}

function showLoginError(message) {
  loginAlert.classList.remove("alert-success");
  loginAlert.classList.add("alert-danger");
  loginAlert.textContent = message;
  loginAlert.classList.remove("d-none");
}

function showLoginSuccess(message) {
  loginAlert.classList.remove("alert-danger");
  loginAlert.classList.add("alert-success");
  loginAlert.textContent = message;
  loginAlert.classList.remove("d-none");
}

function clearLoginError() {
  loginAlert.textContent = "";
  loginAlert.classList.add("d-none");
  loginAlert.classList.remove("alert-success");
  loginAlert.classList.add("alert-danger");
}

function validateLoginForm() {
  clearLoginError();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const emailError = !email
    ? "Enter your university email."
    : !isUniversityEmail(email)
      ? "Enter a valid university email ending in .edu."
      : "";
  const rules = passwordRules(password);
  const passwordError = !password
    ? "Enter a password."
    : Object.values(rules).every(Boolean)
      ? ""
      : "Use at least 8 characters, one uppercase letter, and one number.";

  setFieldError(emailInput, document.getElementById("emailFeedback"), emailError);
  setFieldError(passwordInput, document.getElementById("passwordFeedback"), passwordError);
  return { valid: !emailError && !passwordError, email, password };
}

function readAccounts() {
  const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (stored === null) return {};

  const accounts = JSON.parse(stored);
  if (!accounts || typeof accounts !== "object" || Array.isArray(accounts)) {
    throw new Error("Stored account data is invalid.");
  }
  return accounts;
}

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure password hashing is unavailable in this browser context.");
  }

  const material = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await window.crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt,
    iterations: PASSWORD_ITERATIONS,
    hash: "SHA-256"
  }, material, 256);
  return bytesToHex(bits);
}

async function authenticate(email, password) {
  const accounts = readAccounts();
  const account = accounts[email];
  if (!account) return undefined;
  if (typeof account.salt !== "string" || !/^[\da-f]{32}$/i.test(account.salt) ||
      typeof account.passwordHash !== "string" || !/^[\da-f]{64}$/i.test(account.passwordHash)) {
    throw new Error("Stored account credentials are invalid.");
  }

  const salt = new Uint8Array(account.salt.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)));
  const passwordHash = await hashPassword(password, salt);
  if (passwordHash !== account.passwordHash) return null;

  return account;
}

function setSignedInUser(name) {
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
  if (document.getElementById("rememberMe").checked) {
    localStorage.setItem(USER_STORAGE_KEY, name);
  } else {
    sessionStorage.setItem(USER_STORAGE_KEY, name);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const result = validateLoginForm();
  if (!result.valid) return;

  loginButton.disabled = true;
  loginSpinner.classList.remove("d-none");
  loginLabel.textContent = "Signing in...";
  try {
    const account = await authenticate(result.email, result.password);
    if (account === undefined) {
      showLoginError("No account found for that email. Please sign up first.");
      return;
    }
    if (!account) {
      showLoginError("That password doesn't match this account.");
      return;
    }
    setSignedInUser(account.name);
    window.location.href = "home.html";
  } catch (error) {
    console.error("Unable to sign in.", error);
    showLoginError(error instanceof DOMException && error.name === "QuotaExceededError"
      ? "There isn't enough browser storage to save your account."
      : "Sign-in couldn't be completed. Check browser storage settings and try again.");
  } finally {
    loginButton.disabled = false;
    loginSpinner.classList.add("d-none");
    loginLabel.textContent = "Sign in";
  }
});

emailInput.addEventListener("input", () => {
  setFieldError(emailInput, document.getElementById("emailFeedback"), "");
  clearLoginError();
});

passwordInput.addEventListener("input", () => {
  setFieldError(passwordInput, document.getElementById("passwordFeedback"), "");
  updatePasswordRules();
  clearLoginError();
});

document.getElementById("togglePassword").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  button.textContent = show ? "Hide" : "Show";
  button.setAttribute("aria-label", show ? "Hide password" : "Show password");
  button.setAttribute("aria-pressed", String(show));
});

const forgotForm = document.getElementById("forgotForm");
forgotForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("forgotEmail");
  const feedback = document.getElementById("forgotFeedback");
  const success = document.getElementById("forgotSuccess");
  const value = email.value.trim();
  const error = !value
    ? "Enter your university email."
    : !isUniversityEmail(value)
      ? "Enter a valid university email ending in .edu."
      : "";

  setFieldError(email, feedback, error);
  success.classList.add("d-none");
  if (error) return;

  success.textContent = "Password reset isn't available in this local demo. Please sign in with your account password.";
  success.classList.remove("alert-success");
  success.classList.add("alert-info");
  success.classList.remove("d-none");
});

document.getElementById("forgotEmail").addEventListener("input", () => {
  setFieldError(document.getElementById("forgotEmail"), document.getElementById("forgotFeedback"), "");
});

if (new URLSearchParams(window.location.search).has("registered")) {
  showLoginSuccess("Registration successful. Sign in with your new account.");
}

updatePasswordRules();
