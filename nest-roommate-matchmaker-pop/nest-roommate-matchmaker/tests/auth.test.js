const test = require('node:test');
const assert = require('node:assert/strict');

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

globalThis.localStorage = createMemoryStorage();
globalThis.sessionStorage = createMemoryStorage();

const auth = require('../js/auth.js');

test.beforeEach(() => {
  globalThis.localStorage.clear();
  globalThis.sessionStorage.clear();
});

test('validateEmail rejects invalid or non-edu emails', () => {
  assert.equal(auth.validateEmail('student@gmail.com'), 'Use your university email ending in .edu.');
  assert.equal(auth.validateEmail('student@school'), 'That doesn\'t look like an email address. Check for a missing @ or dot.');
  assert.equal(auth.validateEmail('student@northeastern.edu'), '');
});

test('registerUser validates username and password requirements', () => {
  const invalidUsername = auth.registerUser({
    username: 'ab',
    email: 'student@northeastern.edu',
    password: 'Strong12'
  });
  assert.equal(invalidUsername.ok, false);
  assert.equal(invalidUsername.code, 'USERNAME_INVALID');

  const weakPassword = auth.registerUser({
    username: 'student',
    email: 'student2@northeastern.edu',
    password: 'weak1234'
  });
  assert.equal(weakPassword.ok, false);
  assert.equal(weakPassword.code, 'PASSWORD_INVALID');
});

test('registerUser creates a new account and rejects duplicates', () => {
  const account = auth.registerUser({
    username: 'student',
    email: 'student@northeastern.edu',
    password: 'Strong12'
  });

  assert.equal(account.ok, true);
  assert.equal(account.account.email, 'student@northeastern.edu');

  const duplicate = auth.registerUser({
    username: 'student2',
    email: 'student@northeastern.edu',
    password: 'Strong23'
  });

  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.code, 'EMAIL_EXISTS');
});

test('loginUser creates an account when auto-creating and logs in correctly', () => {
  const created = auth.loginUser({
    email: 'newstudent@northeastern.edu',
    password: 'Strong12',
    createIfMissing: true
  });

  assert.equal(created.ok, true);
  assert.equal(created.created, true);

  const validLogin = auth.loginUser({
    email: 'newstudent@northeastern.edu',
    password: 'Strong12'
  });

  assert.equal(validLogin.ok, true);
  assert.equal(validLogin.account.username, 'newstudent');

  const invalidPassword = auth.loginUser({
    email: 'newstudent@northeastern.edu',
    password: 'WrongPass12'
  });

  assert.equal(invalidPassword.ok, false);
  assert.equal(invalidPassword.code, 'INVALID_PASSWORD');
});

test('session state is saved and cleared for a logged-in user', () => {
  const created = auth.registerUser({
    username: 'user123',
    email: 'user123@northeastern.edu',
    password: 'Strong12'
  });

  assert.equal(created.ok, true);

  auth.saveCurrentUser(created.account, true);

  const current = auth.readCurrentUser();
  assert.equal(current.username, 'user123');

  auth.clearCurrentUser();
  assert.equal(auth.readCurrentUser(), null);
});
