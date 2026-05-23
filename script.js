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
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add("was-validated");

            if (form.checkValidity()) {
                note.textContent = "Thanks! Your request is ready. We will confirm the order shortly.";
                note.classList.add("text-success", "fw-semibold");
                form.reset();
                form.classList.remove("was-validated");
            }
        });
    }
});
