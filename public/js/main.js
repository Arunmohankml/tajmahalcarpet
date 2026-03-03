/* =========================================================================
   TAJMAHAL PRODUCTS — ROYAL HERITAGE JavaScript
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===================== MOBILE MENU =====================
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu    = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        // Close on nav link click (mobile)
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ===================== NAVBAR SCROLL EFFECT =====================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ===================== SCROLL REVEAL OBSERVER =====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });

    // Legacy fade-up support
    const legacyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                legacyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach(el => legacyObserver.observe(el));

    // ===================== STAGGERED CARD ANIMATIONS =====================
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.carpet-card, .feature-box, .philosophy-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 100);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Set initial state for stagger items
    document.querySelectorAll('.carpet-card, .feature-box, .philosophy-card').forEach(card => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(30px)';
        card.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    document.querySelectorAll('.collection-grid, .features-grid, .philosophy-grid').forEach(grid => {
        cardObserver.observe(grid);
    });

    // ===================== PARALLAX HERO =====================
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroSection.style.backgroundPositionY = `calc(50% + ${scrollY * 0.35}px)`;
            }
        }, { passive: true });
    }

    // ===================== PRODUCT FILTER =====================
    const categoryBtns = document.querySelectorAll('.filter-btn');
    const productItems  = document.querySelectorAll('.product-item');

    if (categoryBtns.length > 0 && productItems.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                productItems.forEach((item, i) => {
                    const match = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                    if (match) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            item.style.opacity    = '1';
                            item.style.transform  = 'translateY(0)';
                        }, i * 60);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(-10px)';
                        setTimeout(() => { item.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // ===================== TIMELINE REVEAL =====================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'translateY(0)';
                tlObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    timelineItems.forEach((item, i) => {
        item.style.opacity    = '0';
        item.style.transform  = 'translateY(25px)';
        item.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
        tlObserver.observe(item);
    });

    // ===================== GOLD CURSOR GLOW (desktop only) =====================
    if (window.innerWidth > 1024) {
        const glow = document.createElement('div');
        glow.id = 'cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            background: radial-gradient(circle, rgba(196,151,59,0.06) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            will-change: left, top;
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top  = e.clientY + 'px';
        }, { passive: true });
    }

    // ===================== NUMBER COUNT-UP ANIMATION =====================
    const countEls = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el    = entry.target;
                const end   = parseInt(el.getAttribute('data-count'));
                const dur   = 1800;
                const step  = 16;
                const delta = end / (dur / step);
                let current = 0;

                const timer = setInterval(() => {
                    current += delta;
                    if (current >= end) {
                        current = end;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
                }, step);

                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    countEls.forEach(el => countObserver.observe(el));

    // ===================== DYNAMIC STYLES =====================
    const dynamicStyles = document.createElement('style');
    dynamicStyles.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        #cursor-glow {
            mix-blend-mode: normal;
        }

        .navbar.scrolled .menu-toggle .bar {
            background: var(--color-champagne, #f5ede0);
        }

        /* Ripple on buttons */
        .btn .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.35);
            transform: scale(0);
            animation: ripple-anim 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-anim {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(dynamicStyles);

    // ===================== BUTTON RIPPLE =====================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect   = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size   = Math.max(rect.width, rect.height);
            ripple.className = 'ripple';
            ripple.style.width  = ripple.style.height = size + 'px';
            ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // ===================== PAGE LOAD CURTAIN =====================
    const curtain = document.querySelector('.page-curtain');
    if (curtain) {
        setTimeout(() => {
            curtain.style.transform   = 'scaleY(0)';
            curtain.style.transformOrigin = 'top';
        }, 100);
    }

});
