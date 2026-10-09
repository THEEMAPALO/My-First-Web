document.addEventListener("DOMContentLoaded", function () {

    // FEATURE 1: Validate the contact form and display a preview.
    const form = document.getElementById("contact-form");

    if (form) {
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const summary = document.getElementById("form-summary");

        function showError(id, message) {
            const error = document.getElementById(id);
            if (error) error.textContent = message;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            let valid = true;

            // Check that the name is not blank.
            if (!name) {
                showError("name-error", "Please enter your name.");
                valid = false;
            } else {
                showError("name-error", "");
            }

            // Check the email format.
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showError("email-error", "Please enter a valid email address.");
                valid = false;
            } else {
                showError("email-error", "");
            }

            // Check that the message is not blank.
            if (!message) {
                showError("message-error", "Please enter a message.");
                valid = false;
            } else {
                showError("message-error", "");
            }

            if (!summary) return;

            // Show the result without reloading or sending anything.
            if (valid) {
                summary.replaceChildren();

                const heading = document.createElement("h3");
                heading.textContent = "Contact Form Preview";

                const notice = document.createElement("p");
                notice.textContent =
                    "Your data was validated successfully. This is a browser demonstration only — no message is sent.";

                const namePreview = document.createElement("p");
                namePreview.textContent = "Name: " + name;

                const emailPreview = document.createElement("p");
                emailPreview.textContent = "Email: " + email;

                const messagePreview = document.createElement("p");
                messagePreview.textContent = "Message: " + message;

                summary.append(
                    heading,
                    notice,
                    namePreview,
                    emailPreview,
                    messagePreview
                );
            } else {
                summary.textContent =
                    "Please correct the errors above before viewing your preview.";
            }
        });
    }


    // FEATURE 2: Let visitors view gallery photos one at a time.
    const gallery = document.getElementById("gallery");

    if (gallery) {
        const items = Array.from(
            gallery.querySelectorAll(".gallery-item")
        );

        const controls = document.getElementById("gallery-controls");
        const previousButton = document.getElementById("gallery-prev");
        const nextButton = document.getElementById("gallery-next");
        const status = document.getElementById("gallery-status");

        let currentPhoto = 0;

        function showPhoto(index) {
            if (items.length === 0) return;

            // Wrap around at the beginning and end of the gallery.
            currentPhoto = (index + items.length) % items.length;

            items.forEach(function (item, i) {
                item.style.display = i === currentPhoto ? "" : "none";
            });

            const caption = items[currentPhoto].querySelector("figcaption");
            const captionText = caption
                ? caption.textContent.trim()
                : "Photo " + (currentPhoto + 1);

            if (status) {
                status.textContent =
                    "Photo " + (currentPhoto + 1) + " of " +
                    items.length + " — " + captionText;
            }

            if (controls) controls.hidden = false;
        }

        if (items.length > 0) {
            showPhoto(0);

            if (previousButton) {
                previousButton.addEventListener("click", function () {
                    showPhoto(currentPhoto - 1);
                });
            }

            if (nextButton) {
                nextButton.addEventListener("click", function () {
                    showPhoto(currentPhoto + 1);
                });
            }
        }
    }


    // FEATURE 3: Switch between light and dark themes.
    const themeButton = document.getElementById("theme-toggle");

    if (themeButton) {
        function updateThemeButton() {
            const lightMode = document.body.classList.contains("light-theme");

            themeButton.textContent = lightMode
                ? "Switch to Dark Theme"
                : "Switch to Light Theme";

            themeButton.setAttribute("aria-pressed", String(lightMode));
        }

        themeButton.addEventListener("click", function () {
            document.body.classList.toggle("light-theme");
            updateThemeButton();
        });

        updateThemeButton();
    }


    // FEATURE 4: Open and close the mobile navigation menu.
    const navButton = document.getElementById("nav-toggle");
    const navigation = document.getElementById("main-nav");

    if (navButton && navigation) {
        navButton.setAttribute("aria-expanded", "false");

        navButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            navButton.setAttribute("aria-expanded", String(isOpen));
            navButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            navButton.textContent = isOpen ? "Close Menu ✕" : "Menu ☰";
        });

        // Close the menu after a visitor chooses a navigation link.
        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");
                navButton.setAttribute("aria-expanded", "false");
                navButton.setAttribute("aria-label", "Open navigation menu");
                navButton.textContent = "Menu ☰";
            });
        });
    }

});