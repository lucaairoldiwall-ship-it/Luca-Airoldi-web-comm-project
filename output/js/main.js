document.addEventListener("DOMContentLoaded", () => {
    initCardHoverEffects();
    initActiveNavLinks();
    initSmoothScroll();
    initCookiesProfile();
    initContactForm();
});

function initCardHoverEffects() {
    const cards = document.querySelectorAll(".member-card, .custom-card");

    if (!cards.length) {
        return;
    }

    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("is-hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("is-hovered");
        });

        card.addEventListener("focusin", () => {
            card.classList.add("is-hovered");
        });

        card.addEventListener("focusout", () => {
            card.classList.remove("is-hovered");
        });
    });
}

function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('a[href]');

    if (!navLinks.length) {
        return;
    }

    const currentPath = normalizePath(window.location.pathname);

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
            return;
        }

        const linkPath = normalizePath(href);

        if (linkPath === currentPath) {
            link.classList.add("active-link");
            link.setAttribute("aria-current", "page");
        }
    });
}

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    if (!anchorLinks.length) {
        return;
    }

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}

function normalizePath(path) {
    if (!path) {
        return "/";
    }

    let normalized = path.trim();

    if (!normalized.startsWith("/")) {
        normalized = `/${normalized}`;
    }

    normalized = normalized.replace(/\/+$/, "");

    return normalized === "" ? "/" : normalized;
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const target = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        if (cookie.startsWith(target)) {
            return decodeURIComponent(cookie.substring(target.length));
        }
    }

    return null;
}

function initCookiesProfile() {
    const welcomeBox = document.getElementById("welcome-box");
    const profileBox = document.getElementById("profile-box");
    const buttons = document.querySelectorAll(".preference-btn");

    if (!welcomeBox && !profileBox) {
        return;
    }

    let username = getCookie("username");
    let favoriteSection = getCookie("favoriteSection");

    if (username && favoriteSection) {
        showWelcomeMessage(welcomeBox, username, favoriteSection, true);

        if (profileBox) {
            profileBox.classList.add("d-none");
        }

        return;
    }

    if (!username) {
        const inputName = window.prompt("Welcome! Please enter your name:");

        if (inputName && inputName.trim() !== "") {
            username = inputName.trim();
            setCookie("username", username, 30);
        }
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedPreference = button.dataset.pref;

            setCookie("favoriteSection", selectedPreference, 30);

            if (profileBox) {
                profileBox.classList.add("d-none");
            }

            showWelcomeMessage(welcomeBox, username || "friend", selectedPreference, false);
        });
    });
}

function showWelcomeMessage(welcomeBox, username, favoriteSection, isReturning) {
    if (!welcomeBox) {
        return;
    }

    welcomeBox.classList.remove("d-none");

    if (isReturning) {
        welcomeBox.textContent = `Welcome back, ${username}! Your favorite section is ${favoriteSection}.`;
    } else {
        welcomeBox.textContent = `Nice to meet you, ${username}! We'll remember that your favorite section is ${favoriteSection}.`;
    }
}

function initContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = form.querySelector("input[type='text']").value;
        const email = form.querySelector("input[type='email']").value;
        const message = form.querySelector("textarea").value;

        const subject = encodeURIComponent("Message from website");
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:luca.airoldi3@studenti.unimi.it?subject=${subject}&body=${body}`;
    });
}