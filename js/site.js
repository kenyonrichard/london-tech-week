(function () {
    "use strict";

    /* ---------- Nav dropdown ---------- */
    function setOpen(dropdown, open) {
        dropdown.classList.toggle("open", open);
        var toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function initDropdowns() {
        var dropdowns = document.querySelectorAll(".nav-dropdown");
        dropdowns.forEach(function (dropdown) {
            var toggle = dropdown.querySelector(".nav-dropdown-toggle");
            if (!toggle) return;
            toggle.addEventListener("click", function (e) {
                e.preventDefault();
                var wasOpen = dropdown.classList.contains("open");
                dropdowns.forEach(function (d) { setOpen(d, false); });
                setOpen(dropdown, !wasOpen);
            });
        });
        document.addEventListener("click", function (e) {
            dropdowns.forEach(function (d) {
                if (!d.contains(e.target)) setOpen(d, false);
            });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key !== "Escape") return;
            dropdowns.forEach(function (d) {
                if (d.classList.contains("open")) {
                    setOpen(d, false);
                    var t = d.querySelector(".nav-dropdown-toggle");
                    if (t) t.focus();
                }
            });
        });
    }

    /* ---------- Carousels ---------- */
    window.slideTo = function (id, dir) {
        var el = document.getElementById(id);
        var slides = el.querySelectorAll(".carousel-slide");
        var dots = el.querySelector(".carousel-dots");
        var idx = Array.prototype.findIndex.call(slides, function (s) {
            return s.classList.contains("active");
        });
        slides[idx].classList.remove("active");
        if (dots && dots.children[idx]) dots.children[idx].classList.remove("active");
        idx = (idx + dir + slides.length) % slides.length;
        slides[idx].classList.add("active");
        if (dots && dots.children[idx]) dots.children[idx].classList.add("active");
    };

    function initCarousels() {
        document.querySelectorAll(".img-placeholder.carousel").forEach(function (el) {
            var slides = el.querySelectorAll(".carousel-slide");
            var dots = el.querySelector(".carousel-dots");
            el.querySelectorAll(".carousel-btn").forEach(function (b) {
                b.setAttribute("type", "button");
                b.setAttribute("aria-label", b.classList.contains("prev") ? "Previous image" : "Next image");
            });
            if (!dots || slides.length < 2) return;
            slides.forEach(function (_, i) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.className = "carousel-dot" + (i === 0 ? " active" : "");
                dot.setAttribute("aria-label", "Show image " + (i + 1) + " of " + slides.length);
                dot.addEventListener("click", function () {
                    var active = dots.querySelector(".active");
                    if (active) active.classList.remove("active");
                    slides.forEach(function (s) { s.classList.remove("active"); });
                    slides[i].classList.add("active");
                    dot.classList.add("active");
                });
                dots.appendChild(dot);
            });
        });
    }

    /* ---------- Lightbox (gallery tiles and carousel slides) ---------- */
    var lb, lbImg, lbClose, lbPrev, lbNext, items = [], index = 0, opener = null;

    function fullSrc(img) {
        // Pages show resized copies; the lightbox loads the original photo.
        return img.src.replace(/\/images\/(thumbs|web)\//, "/images/");
    }

    function buildLightbox() {
        lb = document.createElement("div");
        lb.className = "lightbox";
        lb.setAttribute("role", "dialog");
        lb.setAttribute("aria-modal", "true");
        lb.setAttribute("aria-label", "Image viewer");
        lb.innerHTML =
            '<button type="button" class="lightbox-close" aria-label="Close image viewer">&times;</button>' +
            '<button type="button" class="lightbox-nav prev" aria-label="Previous image">&#9664;</button>' +
            '<button type="button" class="lightbox-nav next" aria-label="Next image">&#9654;</button>' +
            '<img id="lightbox-img" src="" alt="" />';
        document.body.appendChild(lb);
        lbImg = lb.querySelector("img");
        lbClose = lb.querySelector(".lightbox-close");
        lbPrev = lb.querySelector(".prev");
        lbNext = lb.querySelector(".next");
        lb.addEventListener("click", function (e) {
            if (e.target === lb || e.target === lbImg) close();
        });
        lbClose.addEventListener("click", close);
        lbPrev.addEventListener("click", function () { step(-1); });
        lbNext.addEventListener("click", function () { step(1); });
    }

    function show() {
        var img = items[index].querySelector("img");
        lbImg.src = fullSrc(img);
        lbImg.alt = img.alt;
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
        var single = items.length < 2;
        lbPrev.hidden = lbNext.hidden = single;
        [1, -1].forEach(function (d) {
            if (single) return;
            new Image().src = fullSrc(items[(index + d + items.length) % items.length].querySelector("img"));
        });
    }

    function open(tile) {
        var group = tile.closest(".img-placeholder.carousel") || tile.closest(".gallery-shell") || document;
        items = Array.prototype.slice.call(group.querySelectorAll(".gallery-item, .carousel-slide"));
        index = items.indexOf(tile);
        opener = tile;
        show();
        lbClose.focus();
    }

    function step(dir) {
        index = (index + dir + items.length) % items.length;
        show();
    }

    function close() {
        lb.classList.remove("open");
        document.body.style.overflow = "";
        if (opener) opener.focus();
    }

    function initLightbox() {
        if (!document.querySelector(".gallery-item, .carousel-slide")) return;
        buildLightbox();
        document.addEventListener("click", function (e) {
            var tile = e.target.closest && e.target.closest(".gallery-item, .carousel-slide");
            if (tile) open(tile);
        });
        document.addEventListener("keydown", function (e) {
            var tile = e.target.closest && e.target.closest(".gallery-item, .carousel-slide");
            if (!lb.classList.contains("open")) {
                if (tile && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    open(tile);
                }
                return;
            }
            if (e.key === "Escape") close();
            else if (items.length > 1 && e.key === "ArrowLeft") step(-1);
            else if (items.length > 1 && e.key === "ArrowRight") step(1);
            else if (e.key === "Tab") {
                var focusable = Array.prototype.filter.call(
                    lb.querySelectorAll("button"),
                    function (b) { return !b.hidden; }
                );
                var first = focusable[0], last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
    }

    /* ---------- Background video: respect reduced motion ---------- */
    function initVideo() {
        var video = document.querySelector(".video-bg");
        if (video && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            video.removeAttribute("autoplay");
            video.pause();
        }
    }

    function init() {
        initDropdowns();
        initCarousels();
        initLightbox();
        initVideo();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
