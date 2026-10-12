(function (global) {
  const STORAGE_KEYS = {
    accounts: "nestAccounts",
    user: "nestUser"
  };

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function makeStorage() {
    const map = new Map();
    return {
      getItem(key) {
        return map.has(key) ? map.get(key) : null;
      },
      setItem(key, value) {
        map.set(key, String(value));
      },
      removeItem(key) {
        map.delete(key);
      },
      clear() {
        map.clear();
      }
    };
  }

  function getStorage(type) {
    const target = type === "session" ? (global.sessionStorage || global.localStorage) : (global.localStorage || global.sessionStorage);
    if (target && typeof target.getItem === "function") return target;
    return makeStorage();
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeUsername(value) {
    return String(value || "").trim();
  }

  function accountKeyFor(email) {
    return normalizeEmail(email);
  }

  function buildGeneratedUsername(email) {
    const local = normalizeEmail(email).split("@")[0] || "nestmate";
    const cleaned = local.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 20) || "nestmate";
    return cleaned || "nestmate";
  }

  function readAccounts() {
    try {
      const storage = getStorage("local");
      const raw = storage.getItem(STORAGE_KEYS.accounts);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function writeAccounts(accounts) {
    try {
      const storage = getStorage("local");
      storage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
      return true;
    } catch (error) {
      return false;
    }
  }

  function validateEmail(value) {
    const email = normalizeEmail(value);
    if (!email) return "Enter your university email.";
    if (!EMAIL_PATTERN.test(email)) return "That doesn't look like an email address. Check for a missing @ or dot.";
    if (!email.endsWith(".edu")) return "Use your university email ending in .edu.";
    return "";
  }

  function validateUsername(value) {
    const username = normalizeUsername(value);
    if (!username) return "Choose a username.";
    if (username.length < 3) return "Username must be at least 3 characters long.";
    if (username.length > 20) return "Username must be under 20 characters.";
    if (!/^[A-Za-z0-9._-]+$/.test(username)) return "Use letters, numbers, dots, dashes or underscores only.";
    return "";
  }

  function validatePassword(value) {
    if (!value) return "Enter your password.";
    if (value.length < 8) return "Password needs at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter.";
    if (!/[0-9]/.test(value)) return "Add at least one number.";
    return "";
  }

  function validateConfirmPassword(password, confirmation) {
    if (!confirmation) return "Confirm your password.";
    if (password !== confirmation) return "Passwords do not match.";
    return "";
  }

  function getAccountByEmail(email) {
    const target = accountKeyFor(email);
    return readAccounts().find((account) => accountKeyFor(account.email) === target) || null;
  }

  function getAccountByUsername(username) {
    const target = normalizeUsername(username).toLowerCase();
    return readAccounts().find((account) => normalizeUsername(account.username).toLowerCase() === target) || null;
  }

  function registerUser({ email, username, password }) {
    const emailMessage = validateEmail(email);
    if (emailMessage) {
      return { ok: false, code: "EMAIL_INVALID", message: emailMessage };
    }

    const normalizedEmail = normalizeEmail(email);
    if (getAccountByEmail(normalizedEmail)) {
      return { ok: false, code: "EMAIL_EXISTS", message: "An account already exists for that email. Please sign in." };
    }

    const chosenUsername = normalizeUsername(username || buildGeneratedUsername(normalizedEmail));
    const usernameMessage = validateUsername(chosenUsername);
    if (usernameMessage) {
      return { ok: false, code: "USERNAME_INVALID", message: usernameMessage };
    }

    if (getAccountByUsername(chosenUsername)) {
      return { ok: false, code: "USERNAME_EXISTS", message: "That username is already taken. Try another." };
    }

    const passwordMessage = validatePassword(password);
    if (passwordMessage) {
      return { ok: false, code: "PASSWORD_INVALID", message: passwordMessage };
    }

    const account = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      email: normalizedEmail,
      username: chosenUsername,
      password,
      createdAt: new Date().toISOString()
    };

    const accounts = readAccounts();
    accounts.push(account);
    writeAccounts(accounts);

    return { ok: true, account };
  }

  function loginUser({ email, password, createIfMissing = false }) {
    const emailMessage = validateEmail(email);
    if (emailMessage) {
      return { ok: false, code: "EMAIL_INVALID", message: emailMessage };
    }

    const normalizedEmail = normalizeEmail(email);
    const account = getAccountByEmail(normalizedEmail);

    if (!account) {
      if (!createIfMissing) {
        return { ok: false, code: "ACCOUNT_NOT_FOUND", message: "No account was found for that email. Create one to continue." };
      }

      const creation = registerUser({
        email: normalizedEmail,
        username: buildGeneratedUsername(normalizedEmail),
        password
      });

      if (!creation.ok) {
        return { ok: false, code: creation.code, message: creation.message };
      }

      return { ok: true, account: creation.account, created: true };
    }

    const passwordMessage = validatePassword(password);
    if (passwordMessage) {
      return { ok: false, code: "PASSWORD_INVALID", message: passwordMessage };
    }

    if (account.password !== password) {
      return { ok: false, code: "INVALID_PASSWORD", message: "Incorrect password. Try again or reset it." };
    }

    return { ok: true, account, created: false };
  }

  function readCurrentUser() {
    const session = getStorage("session");
    const persistent = getStorage("local");
    const sources = [session, persistent];

    for (const storage of sources) {
      try {
        const raw = storage.getItem(STORAGE_KEYS.user);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email && parsed.username) {
          return parsed;
        }
      } catch (error) {
        // Ignore invalid saved session data.
      }
    }

    return null;
  }

  function saveCurrentUser(account, rememberMe) {
    const sessionUser = {
      id: account.id,
      email: account.email,
      username: account.username,
      rememberMe: !!rememberMe
    };

    try {
      getStorage("session").setItem(STORAGE_KEYS.user, JSON.stringify(sessionUser));
    } catch (error) {
      // Ignore when storage is unavailable.
    }

    if (rememberMe) {
      try {
        getStorage("local").setItem(STORAGE_KEYS.user, JSON.stringify(sessionUser));
      } catch (error) {
        // Ignore when storage is unavailable.
      }
    } else {
      try {
        getStorage("local").removeItem(STORAGE_KEYS.user);
      } catch (error) {
        // Ignore when storage is unavailable.
      }
    }

    return sessionUser;
  }

  function clearCurrentUser() {
    try {
      getStorage("session").removeItem(STORAGE_KEYS.user);
    } catch (error) {
      // Ignore when storage is unavailable.
    }

    try {
      getStorage("local").removeItem(STORAGE_KEYS.user);
    } catch (error) {
      // Ignore when storage is unavailable.
    }
  }

  const api = {
    STORAGE_KEYS,
    EMAIL_PATTERN,
    validateEmail,
    validateUsername,
    validatePassword,
    validateConfirmPassword,
    registerUser,
    loginUser,
    saveCurrentUser,
    readCurrentUser,
    clearCurrentUser,
    getAccountByEmail,
    getAccountByUsername,
    buildGeneratedUsername,
    readAccounts,
    writeAccounts,
    normalizeEmail,
    normalizeUsername
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  global.NestAuth = api;
})(typeof window !== "undefined" ? window : globalThis);
