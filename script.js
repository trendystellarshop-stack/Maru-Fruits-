document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));

    const filterButtons = document.querySelectorAll("[data-filter]");
    const fruitItems = document.querySelectorAll(".fruit-item");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            fruitItems.forEach((item) => {
                const shouldShow = filter === "all" || item.dataset.category === filter;
                item.classList.toggle("d-none", !shouldShow);
            });
        });
    });

    const toastElement = document.getElementById("cartToast");
    if (toastElement && window.bootstrap) {
        const toast = new bootstrap.Toast(toastElement, { delay: 1800 });
        document.querySelectorAll(".add-cart").forEach((button) => {
            button.addEventListener("click", () => {
                toast.show();
            });
        });
    }

    const counters = document.querySelectorAll("[data-count]");
    counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 45));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = `${current}${target === 100 ? "%" : "+"}`;
        }, 28);
    });

    const form = document.getElementById("orderForm");
    const note = document.getElementById("formNote");
    const alertBox = document.getElementById("formAlert");
    const messageField = document.getElementById("message");
    const charCount = document.getElementById("charCount");

    if (form) {
        const fields = form.querySelectorAll("input, select, textarea");

        const validateField = (field) => {
            let isValid = field.checkValidity();

            if (field.id === "email" && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(field.value);
            }

            if (field.id === "phone" && field.value) {
                const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
                isValid = phoneRegex.test(field.value);
            }

            if (field.id === "subject" && field.value.length > 100) {
                isValid = false;
            }

            if (field.id === "message" && field.value.length > 1000) {
                isValid = false;
            }

            field.classList.toggle("is-invalid", !isValid);
            return isValid;
        };

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                validateField(field);
                if (alertBox) {
                    alertBox.classList.add("d-none");
                }
                if (messageField && charCount && field.id === "message") {
                    charCount.textContent = field.value.length;
                }
            });
        });

        if (messageField && charCount) {
            charCount.textContent = messageField.value.length;
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add("was-validated");

            const invalidFields = Array.from(form.querySelectorAll("input[required], select[required], textarea[required]"))
                .filter((field) => !validateField(field));

            if (invalidFields.length > 0) {
                if (alertBox) {
                    const errorMessages = invalidFields.map((field) => {
                        let error = field.labels?.[0]?.textContent || field.id;
                        if (field.id === "email") error += " - invalid format";
                        if (field.id === "phone") error += " - must be 10-15 digits";
                        if (field.id === "subject") error += " - max 100 characters";
                        if (field.id === "message") error += " - max 1000 characters";
                        return error;
                    });
                    alertBox.textContent = `${errorMessages.length > 1 ? "Errors" : "Error"}: ${errorMessages.join("; ")}.`;
                    alertBox.classList.remove("d-none");
                }
                note.textContent = "Please fix the highlighted errors and try again.";
                note.classList.remove("text-success", "fw-semibold");
                note.classList.add("text-danger");
                invalidFields[0].focus();
                return;
            }

            if (alertBox) {
                alertBox.classList.add("d-none");
                alertBox.textContent = "";
            }
            note.textContent = "Thank you! Your message has been sent successfully. We will get back to you soon.";
            note.classList.add("text-success", "fw-semibold");
            note.classList.remove("text-danger");
            form.reset();
            form.classList.remove("was-validated");
            if (charCount) charCount.textContent = "0";
            fields.forEach((field) => field.classList.remove("is-invalid"));
        });
    }
});
