const ACCOUNT_STORAGE_KEY = "nestAccounts";
const PASSWORD_ITERATIONS = 120000;

const registerForm = document.getElementById("registerForm");
const emailInput = document.getElementById("registerEmail");
const passwordInput = document.getElementById("registerPassword");
const confirmInput = document.getElementById("confirmPassword");
const registerAlert = document.getElementById("registerAlert");
const registerButton = document.getElementById("registerBtn");
const registerSpinner = registerButton.querySelector(".spinner-border");
const registerLabel = registerButton.querySelector(".btn-label");

// These requirements must match the checks used on the login page.
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
  document.querySelectorAll("#registerPasswordRules [data-rule]").forEach((item) => {
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

function clearRegisterAlert() {
  registerAlert.textContent = "";
  registerAlert.classList.add("d-none");
}

function readAccounts() {
  const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (stored === null) return {};

  // Accounts are stored in one email-keyed object shared with login.js.
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

function makeDisplayName(email) {
  const localPart = email.split("@")[0].replace(/[._+-]+/g, " ").trim();
  return localPart.replace(/\b\w/g, (letter) => letter.toUpperCase()) || "there";
}

function validateRegistration() {
  clearRegisterAlert();
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
  const confirmError = !confirmInput.value
    ? "Confirm your password."
    : confirmInput.value !== password
      ? "Passwords do not match."
      : "";

  setFieldError(emailInput, document.getElementById("registerEmailFeedback"), emailError);
  setFieldError(passwordInput, document.getElementById("registerPasswordFeedback"), passwordError);
  setFieldError(confirmInput, document.getElementById("confirmPasswordFeedback"), confirmError);
  return { valid: !emailError && !passwordError && !confirmError, email, password };
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const result = validateRegistration();
  if (!result.valid) return;

  registerButton.disabled = true;
  registerSpinner.classList.remove("d-none");
  registerLabel.textContent = "Creating account...";

  try {
    const accounts = readAccounts();
    // Do not replace an existing account's password when the same email signs up again.
    if (accounts[result.email]) {
      registerAlert.textContent = "An account with this email already exists. Sign in instead.";
      registerAlert.classList.remove("d-none");
      return;
    }

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    accounts[result.email] = {
      name: makeDisplayName(result.email),
      salt: bytesToHex(salt),
      passwordHash: await hashPassword(result.password, salt)
    };
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
    // Return to login so the user authenticates with the account just created.
    window.location.href = "index.html?registered=1";
  } catch (error) {
    console.error("Unable to register account.", error);
    registerAlert.textContent = error instanceof DOMException && error.name === "QuotaExceededError"
      ? "There isn't enough browser storage to save your account."
      : "Registration couldn't be completed. Check browser storage settings and try again.";
    registerAlert.classList.remove("d-none");
  } finally {
    registerButton.disabled = false;
    registerSpinner.classList.add("d-none");
    registerLabel.textContent = "Sign up";
  }
});

emailInput.addEventListener("input", () => {
  setFieldError(emailInput, document.getElementById("registerEmailFeedback"), "");
  clearRegisterAlert();
});

passwordInput.addEventListener("input", () => {
  setFieldError(passwordInput, document.getElementById("registerPasswordFeedback"), "");
  updatePasswordRules();
  if (confirmInput.value) {
    setFieldError(confirmInput, document.getElementById("confirmPasswordFeedback"),
      confirmInput.value === passwordInput.value ? "" : "Passwords do not match.");
  }
  clearRegisterAlert();
});

confirmInput.addEventListener("input", () => {
  setFieldError(confirmInput, document.getElementById("confirmPasswordFeedback"),
    confirmInput.value === passwordInput.value ? "" : "Passwords do not match.");
  clearRegisterAlert();
});

updatePasswordRules();
