# Nest: Roommate Matchmaker

## Purpose and overview

Nest helps university students find a roommate they can actually live with. Instead of matching on photos or majors, Nest matches on the habits that decide whether sharing a home works: sleep schedule, tidiness, noise and how often guests come over.

The project has two pages:

- **Login page (`index.html`)**: sign in with a university `.edu` email. Every field is validated on the client side with specific error messages, a live password checklist, a show/hide password toggle, an error summary alert, a loading spinner, and a "Forgot password" modal with its own validation.
- **Landing page (`home.html`)**: a personalized home page with a live "match meter" (answer three questions and the house windows light up as your match score rises), filterable roommate profiles with habit badges and match bars, a profile modal, saved roommates in an offcanvas panel, a "How it works" section, a stories carousel and an FAQ accordion.

All profiles are fictional sample data.

## Bootstrap components used

| # | Component | Where |
|---|-----------|-------|
| 1 | Navbar (with collapse on mobile) | Landing page header |
| 2 | Dropdown | User menu in the navbar |
| 3 | Buttons and button groups | Everywhere; match meter answers use button groups with `btn-check` |
| 4 | Forms (floating labels, checkbox) | Login form |
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

## Customization

The pages are built from scratch on Bootstrap 5.3, not copied from a template. Customization includes a playful "pop" visual style (thick black outlines, hard offset shadows, bright yellow, pink, mint and purple), custom fonts (Bricolage Grotesque and Figtree), buttons that lift on hover and press down on click, custom button variants (`btn-nest`, `btn-outline-nest`), a CSS-drawn house that reacts to the match meter, restyled pills, pagination, carousel, accordion and toasts, and a live password checklist built on the list group component.

## Running the project locally

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd nest-roommate-matchmaker
   ```
2. Open `index.html` in a browser, or use the VS Code **Live Server** extension (right-click `index.html` > Open with Live Server).
3. Sign in with any email ending in `.edu` and a password with at least 8 characters, one uppercase letter and one number (for example `nidhi@northeastern.edu` / `Roommate1`).

An internet connection is needed because Bootstrap and the fonts load from a CDN.

## Folder structure

```
nest-roommate-matchmaker/
  index.html      Login page
  home.html       Landing page
  css/style.css   Custom styles for both pages
  js/login.js     Login validation
  js/home.js      Landing page interactions
  README.md
```

## Team and contributions

| Member | Branch | Contribution |
|--------|--------|--------------|
| Name 1 | `name1` | Login page and validation |
| Name 2 | `name2` | Navbar, hero and match meter |
| Name 3 | `name3` | Profile cards, filters, modal, saved offcanvas |
| Name 4 | `name4` | Stories, FAQ, footer, responsive testing, README |

All work was merged into `main` through pull requests from each member's branch.
