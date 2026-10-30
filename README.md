# Nest: Roommate Matchmaker

## Purpose and overview

Nest helps university students find a roommate they can actually live with. Instead of matching on photos or majors, Nest matches on the habits that decide whether sharing a home works: sleep schedule, tidiness, noise and how often guests come over.

The project consists of three pages:

- **Login page (`index.html`)**: Allows users to sign in to a previously registered local account using an email ending in `.edu`. Login fields are validated on the client side, and passwords are verified using PBKDF2 password hashing. The "Keep me signed in" checkbox determines whether the login session is stored in `localStorage` or `sessionStorage`.

- **Registration page (`register.html`)**: Allows users to create a local account after validating their university email and password. Passwords are hashed using PBKDF2 before being stored in browser storage. After successful registration, users are redirected to the login page.

- **Landing page (`home.html`)**: Provides a personalized home page with an interactive match meter, a three-question compatibility quiz, filterable roommate profiles, habit badges, match bars, profile details modal, saved roommates, a stories carousel, and an FAQ accordion. The match meter starts at 10%. Each answer that matches Maya's preferences adds 30 percentage points to the score. After all three questions are answered, the score can reach 100%. The house windows light up as the compatibility score increases.

This is a front-end prototype, not a production authentication system. Account data and saved roommates are stored in the current browser and are not shared across devices.

All profiles are fictional sample data.

## Bootstrap components used

| # | Component | Where |
|---|-----------|-------|
| 1 | Navbar (with collapse on mobile) | Landing page header |
| 2 | Dropdown | User menu in the navbar |
| 3 | Buttons and button groups | Everywhere; match meter answers use button groups with `btn-check` |
| 4 | Forms (floating labels, checkboxes, and form controls) | Login and registration pages
| 5 | Form validation (`is-invalid`, `invalid-feedback`) | Login form and forgot-password form |
| 6 | Input group | Password field with Show/Hide button |
| 7 | Alerts | Login error summary, reset-link confirmation |
| 8 | Spinner | Sign in button loading state |
| 9 | Modal | Forgot password (login), profile details (landing) |
| 10 | List group | Password checklist, profile facts, saved roommates |
| 11 | Cards | Roommate profiles |
| 12 | Badges | Habit badges on profiles, saved count in navbar |
| 13 | Tooltips | Hover or focus a habit badge for details |
| 14 | Progress bars | Match percentage on cards and in the modal |
| 15 | Nav pills | Filter matches (Night owls, Early birds, Quiet, Social) |
| 16 | Pagination | Profile pages |
| 17 | Offcanvas | Saved roommates panel |
| 18 | Toasts | "Saved", "Removed" and "Hello sent" messages |
| 19 | Carousel | Roommate stories |
| 20 | Accordion | FAQ |
| 21 | Grid system and utilities | Responsive layout on both pages |
| 22 | Figure | Room photo and caption in the profile modal |

Bootstrap 5.3.2 is loaded through a CDN. The project combines Bootstrap components with custom CSS styling.

## Customization

The pages are built from scratch on Bootstrap 5.3, not copied from a template. Customization includes a playful "pop" visual style (thick black outlines, hard offset shadows, bright yellow, pink, mint and purple), custom fonts (Bricolage Grotesque and Figtree), buttons that lift on hover and press down on click, custom button variants (`btn-nest`, `btn-outline-nest`), a CSS-drawn house that reacts to the match meter, restyled pills, pagination, carousel, accordion and toasts, and a live password checklist built on the list group component.

## Running the project locally

1. Clone the repository:
   ```

   git clone https://github.com/kartikmaneneu/6150-group_Assignment.git
   cd 6150-group_Assignment
   ```
2. Open `index.html` in a browser, or use the VS Code **Live Server** extension (right-click `index.html` > Open with Live Server).
3. Register with any email ending in `.edu` and a password with at least 8 characters, one uppercase letter and one number (for example `nidhi@northeastern.edu’).

An internet connection is needed because Bootstrap and the fonts load from a CDN.

## Folder structure

```
6150-group_Assignment/
│
├── index.html
├── register.html
├── home.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── login.js
│   ├── register.js
│   └── home.js
│
├── images/
│   ├── room-1.jpg
│   ├── room-2.jpg
│   ├── room-3.jpg
│   ├── room-4.jpg
│   ├── room-5.jpg
│   ├── room-6.jpg
│   ├── room-7.jpg
│   ├── room-8.jpg
│   └── room-9.jpg
│
└── README.md

```

## Team and contributions

| Member    |       Branch                | Contribution |
|-----------|-----------------------------|--------------|
| Karthik   | `feature-kartik`            | Login, registration and authentication |
| Neelaveni | `feature-neelaveni-landing` | Navbar, hero, match meter (quiz, live score and house visual) |
| Yikai Zhu | `feature-Yikai`             | Roommate profile cards, filters, pagination, profile modal, saved roommates panel |
| Nidhi     | `feature/Nidhi`             | Stories carousel, FAQ, footer, README, integration and testing |

## Technical Implementation

### JavaScript
- `login.js` handles login form validation, password verification, and user sessions.
- `register.js` handles registration validation and account creation.
- `home.js` handles the match meter, roommate profiles, filters, pagination, profile modal, and saved roommates.

### Browser Storage
- `localStorage` stores registered accounts and saved roommate information.
- `localStorage` stores the signed-in user when "Keep me signed in" is selected.
- `sessionStorage` stores the signed-in user when "Keep me signed in" is not selected.

### Password Security
Passwords are hashed in the browser using PBKDF2 with SHA-256 before account information is stored. This is a demonstration implementation and is not a replacement for secure server-side authentication.

### Responsive Design
Bootstrap's grid system and responsive utility classes are used to adapt the layout to different screen sizes.

All work was merged into `main` through pull requests from each member's branch.


