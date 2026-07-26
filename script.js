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
    if (form) {
        const fields = form.querySelectorAll("input, select, textarea");

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                field.classList.toggle("is-invalid", !field.checkValidity());
                if (alertBox) {
                    alertBox.classList.add("d-none");
                }
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add("was-validated");

            const invalidFields = Array.from(form.querySelectorAll("input[required], select[required], textarea[required]"))
                .filter((field) => !field.checkValidity());

            invalidFields.forEach((field) => field.classList.add("is-invalid"));

            if (invalidFields.length > 0) {
                if (alertBox) {
                    const labels = invalidFields.map((field) => field.labels?.[0]?.textContent || field.id);
                    alertBox.textContent = `Please complete the required field${invalidFields.length > 1 ? "s" : ""}: ${labels.join(", ")}.`;
                    alertBox.classList.remove("d-none");
                }
                note.textContent = "Please fill in the highlighted fields.";
                note.classList.remove("text-success", "fw-semibold");
                note.classList.add("text-danger");
                invalidFields[0].focus();
                return;
            }

            if (alertBox) {
                alertBox.classList.add("d-none");
                alertBox.textContent = "";
            }
            note.textContent = "Thanks! Your request is ready. We will confirm the order shortly.";
            note.classList.add("text-success", "fw-semibold");
            note.classList.remove("text-danger");
            form.reset();
            form.classList.remove("was-validated");
            fields.forEach((field) => field.classList.remove("is-invalid"));
        });
    }
});
