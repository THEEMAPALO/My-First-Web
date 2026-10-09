document.addEventListener("DOMContentLoaded", () => {
    // Navigation menu
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const open = mainNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
        });
    }

    // Dark/light theme
    const themeToggle = document.getElementById("theme-toggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            document.body.classList.toggle("light-mode");

            const light = document.body.classList.contains("light-theme") ||
                document.body.classList.contains("light-mode");

            themeToggle.setAttribute("aria-pressed", String(light));
        });
    }

    // Photo gallery
    const gallery = document.getElementById("gallery");

    if (gallery) {
        const items = Array.from(gallery.querySelectorAll(".gallery-item"));
        const photos = items.map(item => item.querySelector("img")).filter(Boolean);

        if (photos.length) {
            let selected = 0;
            let angle = 0;
            let flipX = 1;
            let flipY = 1;
            let scale = 1;
            let slideshow = null;

            // Store each photo's individual editing settings
            const settings = photos.map(() => ({
                angle: 0,
                flipX: 1,
                flipY: 1,
                scale: 1
            }));

            const editor = document.createElement("section");
            editor.id = "photo-editor";
            editor.className = "photo-editor";
            editor.innerHTML = `
                <div class="editor-heading">
                    <span class="editor-eyebrow">INTERACTIVE STUDIO</span>
                    <h2>Photo Playground</h2>
                    <p>Select a photo. Transform it. Make it yours.</p>
                </div>

                <div class="editor-preview" id="editor-preview">
                    <div class="preview-label">LIVE PREVIEW</div>
                    <img id="editor-image" alt="Selected photo preview">
                    <div class="preview-counter" id="editor-counter"></div>
                </div>

                <div class="editor-status" id="editor-status"
                     aria-live="polite">Photo ready to edit.</div>

                <div class="editor-tools">
                    <h3>Choose a photo</h3>
                    <div class="photo-picker" id="photo-picker"></div>

                    <h3>Transform</h3>
                    <div class="editor-button-grid">
                        <button type="button" data-action="left">↶ Rotate left</button>
                        <button type="button" data-action="right">↷ Rotate right</button>
                        <button type="button" data-action="horizontal">⇋ Flip sideways</button>
                        <button type="button" data-action="vertical">⇅ Flip upside down</button>
                        <button type="button" data-action="smaller">− Make smaller</button>
                        <button type="button" data-action="larger">＋ Make bigger</button>
                        <button type="button" data-action="reset">⟲ Reset photo</button>
                        <button type="button" data-action="previous">← Previous</button>
                        <button type="button" data-action="next">Next →</button>
                        <button type="button" data-action="slideshow"
                                id="slideshow-button">▶ Start slideshow</button>
                    </div>
                </div>
            `;

            gallery.insertAdjacentElement("afterend", editor);

            const preview = document.getElementById("editor-image");
            const counter = document.getElementById("editor-counter");
            const status = document.getElementById("editor-status");
            const picker = document.getElementById("photo-picker");
            const slideshowButton = document.getElementById("slideshow-button");

            // Create photo selection buttons
            photos.forEach((photo, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "photo-choice";
                button.setAttribute("aria-label", `Select photo ${index + 1}`);

                const thumbnail = document.createElement("img");
                thumbnail.src = photo.currentSrc || photo.src;
                thumbnail.alt = "";

                const number = document.createElement("span");
                number.textContent = `PHOTO ${index + 1}`;

                button.append(thumbnail, number);
                button.addEventListener("click", () => selectPhoto(index));
                picker.appendChild(button);
            });

            function applyTransform() {
                const photo = photos[selected];
                const state = settings[selected];

                photo.style.transform =
                    `rotate(${state.angle}deg) scale(${state.scale * state.flipX}, ${state.scale * state.flipY})`;

                preview.src = photo.currentSrc || photo.src;
                preview.style.transform =
                    `rotate(${state.angle}deg) scale(${state.scale * state.flipX}, ${state.scale * state.flipY})`;

                counter.textContent = `PHOTO ${selected + 1} / ${photos.length}`;

                picker.querySelectorAll(".photo-choice").forEach((button, index) => {
                    button.classList.toggle("active", index === selected);
                    button.setAttribute("aria-pressed", String(index === selected));
                });

                items.forEach((item, index) => {
                    item.classList.toggle("editing-selected", index === selected);
                });
            }

            function selectPhoto(index) {
                selected = (index + photos.length) % photos.length;
                applyTransform();
                status.textContent = `Photo ${selected + 1} selected. Start editing!`;
            }

            function stopSlideshow() {
                if (slideshow !== null) {
                    clearInterval(slideshow);
                    slideshow = null;
                }

                slideshowButton.textContent = "▶ Start slideshow";
                slideshowButton.classList.remove("is-playing");
            }

            editor.querySelectorAll("[data-action]").forEach(button => {
                button.addEventListener("click", () => {
                    const action = button.dataset.action;
                    const state = settings[selected];

                    if (action === "slideshow") {
                        if (slideshow !== null) {
                            stopSlideshow();
                            status.textContent = "Slideshow paused.";
                        } else {
                            slideshow = setInterval(() => {
                                selectPhoto(selected + 1);
                            }, 2500);

                            slideshowButton.textContent = "Ⅱ Stop slideshow";
                            slideshowButton.classList.add("is-playing");
                            status.textContent = "Slideshow playing. Enjoy the gallery!";
                        }
                        return;
                    }

                    if (action === "previous" || action === "next") {
                        selectPhoto(selected + (action === "next" ? 1 : -1));
                        return;
                    }

                    if (action === "left") state.angle -= 90;
                    if (action === "right") state.angle += 90;
                    if (action === "horizontal") state.flipX *= -1;
                    if (action === "vertical") state.flipY *= -1;
                    if (action === "smaller") state.scale = Math.max(0.3, state.scale - 0.1);
                    if (action === "larger") state.scale = Math.min(2, state.scale + 0.1);

                    if (action === "reset") {
                        state.angle = 0;
                        state.flipX = 1;
                        state.flipY = 1;
                        state.scale = 1;
                    }

                    applyTransform();
                    status.textContent = "Photo updated successfully.";
                });
            });

            applyTransform();
        }
    }

    // Contact form validation
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");
            const summary = document.getElementById("form-summary");

            let valid = true;

            function showError(id, text) {
                const element = document.getElementById(id);
                if (element) element.textContent = text;
            }

            if (!name || !name.value.trim()) {
                showError("name-error", "Please enter your name.");
                valid = false;
            } else {
                showError("name-error", "");
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                showError("email-error", "Please enter a valid email.");
                valid = false;
            } else {
                showError("email-error", "");
            }

            if (!message || !message.value.trim()) {
                showError("message-error", "Please enter a message.");
                valid = false;
            } else {
                showError("message-error", "");
            }

            if (summary) {
                summary.textContent = valid
                    ? "Your form passed validation. A backend is needed to send your message."
                    : "Please correct the highlighted fields.";
            }
        });
    }
});