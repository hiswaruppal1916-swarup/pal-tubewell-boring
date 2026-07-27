/* ==========================================================================
   Pal Tubewell Boring Services - Interactive App Engine
   ========================================================================== */

// 1. CENTRAL OWNER & CONTACT VARIABLES (Edit in one place)
const CONFIG = {
    OWNER_NAME: "BUDDHADEB PAL",
    PHONE_NUMBER: "+91 97335 59820",
    WHATSAPP_NUMBER: "919046062191", // Raw digits format for WhatsApp API (wa.me)
    WHATSAPP_DISPLAY: "+91 90460 62191",
    ADDRESS: "Mugberia, Purba Medinipur, West Bengal, India - 721425"
};

// Replace variables dynamically across the DOM
function renderTemplateVariables() {
    // Replace text nodes
    const walkText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let val = node.nodeValue;
            if (val.includes('{{')) {
                val = val.replace(/{{OWNER_NAME}}/g, CONFIG.OWNER_NAME)
                         .replace(/{{PHONE_NUMBER}}/g, CONFIG.PHONE_NUMBER)
                         .replace(/{{WHATSAPP_NUMBER}}/g, CONFIG.WHATSAPP_NUMBER)
                         .replace(/{{WHATSAPP_DISPLAY}}/g, CONFIG.WHATSAPP_DISPLAY)
                         .replace(/{{ADDRESS}}/g, CONFIG.ADDRESS);
                node.nodeValue = val;
            }
        } else {
            for (let child of node.childNodes) {
                walkText(child);
            }
        }
    };
    walkText(document.body);

    // Replace attributes (tel link spaces removed for protocol compliance)
    const telTriggers = document.querySelectorAll('.btn-call-trigger');
    telTriggers.forEach(el => {
        el.setAttribute('href', `tel:${CONFIG.PHONE_NUMBER.replace(/\s+/g, '')}`);
    });

    const waTriggers = document.querySelectorAll('.btn-whatsapp-trigger');
    waTriggers.forEach(el => {
        el.setAttribute('href', `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`);
    });

    // Specific config text nodes replacements
    const configOwner = document.querySelector('.config-owner-name');
    if (configOwner) configOwner.innerText = CONFIG.OWNER_NAME;

    const configPhone = document.querySelector('.config-phone-number a');
    if (configPhone) {
        configPhone.innerText = CONFIG.PHONE_NUMBER;
        configPhone.setAttribute('href', `tel:${CONFIG.PHONE_NUMBER.replace(/\s+/g, '')}`);
    }

    const configWA = document.querySelector('.config-whatsapp-number a');
    if (configWA) {
        configWA.innerText = CONFIG.WHATSAPP_DISPLAY; // Display WhatsApp phone
        configWA.setAttribute('href', `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`);
    }

    const configAddresses = document.querySelectorAll('.config-address');
    configAddresses.forEach(el => {
        el.innerText = CONFIG.ADDRESS;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Run template replacement
    renderTemplateVariables();

    // ==========================================================================
    // 1. Initialize Lenis Smooth Scroll
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical'
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ==========================================================================
    // 2. Header Scroll Background Toggle
    // ==========================================================================
    const header = document.querySelector('.main-header');
    if (header) {
        const toggleHeaderBackground = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', toggleHeaderBackground);
        toggleHeaderBackground();
    }

    // ==========================================================================
    // 3. Hero Section Canvas Particles (Anti-Gravity Floating Particles)
    // ==========================================================================
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 50;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 1.2;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = -(Math.random() * 0.7 + 0.3); // Constant upward drift (anti-gravity)
                this.alpha = Math.random() * 0.6 + 0.15;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset to bottom when going off top
                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                    this.speedY = -(Math.random() * 0.7 + 0.3);
                }
                if (this.x < -10 || this.x > canvas.width + 10) {
                    this.speedX *= -1;
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#06b6d4'; // Aqua blue water color
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#06b6d4';
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Mouse hover interaction to repel/lift particles
        let mouseX = null;
        let mouseY = null;
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => {
            mouseX = null;
            mouseY = null;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                // Mouse interaction repulsion
                if (mouseX !== null && mouseY !== null) {
                    const dx = p.x - mouseX;
                    const dy = p.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        p.x += (dx / dist) * force * 3;
                        p.y += (dy / dist) * force * 3 - 0.5; // lift slightly
                    }
                }

                p.update();
                p.draw();
            });

            // Clean thin connection lines
            ctx.save();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================================================
    // 4. Hero Section 3D Card Hover Tilt
    // ==========================================================================
    const card = document.getElementById('hero-3d-card');
    if (card) {
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const rotateX = (yc - y) / 15;
            const rotateY = (x - xc) / 15;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
        };

        card.parentElement.addEventListener('mousemove', handleMouseMove);
        card.parentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // ==========================================================================
    // 5. Interactive Pricing Calculator Controller
    // ==========================================================================
    const wellTypeSelect = document.getElementById('well-type');
    const wellDepthInput = document.getElementById('well-depth');
    const depthDisplay = document.getElementById('depth-display');
    const estimatedCostDiv = document.getElementById('estimated-cost');

    function calculateEstimatedBoringCost() {
        if (!wellTypeSelect || !wellDepthInput || !depthDisplay || !estimatedCostDiv) return;

        const wellType = wellTypeSelect.value;
        const depth = parseInt(wellDepthInput.value, 10);

        // Define rate cards based on well types
        let ratePerFoot = 55;
        if (wellType === 'domestic') {
            ratePerFoot = 55;
        } else if (wellType === 'agricultural') {
            ratePerFoot = 70;
        } else if (wellType === 'commercial') {
            ratePerFoot = 85;
        } else if (wellType === 'deep_calyx') {
            ratePerFoot = 100;
        }

        // Update Slider UI display text
        depthDisplay.innerHTML = `<strong class="calc-highlight">${depth}</strong> feet`;

        // Calculate total cost
        const totalCost = depth * ratePerFoot;
        estimatedCostDiv.innerText = `₹${totalCost.toLocaleString('en-IN')}`;

        // Update breakdowns
        const breakdownRate = document.getElementById('breakdown-rate');
        const breakdownBase = document.getElementById('breakdown-base');
        if (breakdownRate) breakdownRate.innerText = `₹${ratePerFoot} / ft`;
        if (breakdownBase) breakdownBase.innerText = `₹${totalCost.toLocaleString('en-IN')}`;

        // Update Strata Visualizer
        const strataIndicator = document.getElementById('strata-indicator');
        const indicatorDepth = document.getElementById('indicator-depth');
        const strataLayers = document.querySelectorAll('.strata-layer');

        if (strataIndicator && indicatorDepth) {
            // Slider min is 10, max is 1000
            const pct = (depth - 10) / (1000 - 10);
            // Limit to 95% top to keep the indicator handle fully within the column
            strataIndicator.style.top = (pct * 95) + '%';
            indicatorDepth.innerText = depth;

            // Highlight current layer based on depth ranges:
            // Clay: 0-150, Gravel: 150-450, Rock: 450-1000
            strataLayers.forEach(layer => layer.classList.remove('active'));
            if (depth <= 150) {
                const clayLayer = document.querySelector('.layer-clay');
                if (clayLayer) clayLayer.classList.add('active');
            } else if (depth <= 450) {
                const gravelLayer = document.querySelector('.layer-gravel');
                if (gravelLayer) gravelLayer.classList.add('active');
            } else {
                const rockLayer = document.querySelector('.layer-rock');
                if (rockLayer) rockLayer.classList.add('active');
            }
        }
    }

    // Bind event listeners for inputs
    if (wellTypeSelect && wellDepthInput) {
        wellTypeSelect.addEventListener('change', calculateEstimatedBoringCost);
        wellDepthInput.addEventListener('input', calculateEstimatedBoringCost);
        
        // Initial load calculation
        calculateEstimatedBoringCost();
    }


    // ==========================================================================
    // Gallery Lightbox Modal Logic
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                const img = item.querySelector('img');
                const caption = img ? img.getAttribute('alt') : '';
                
                lightboxImg.src = src;
                lightboxCaption.innerText = caption;
                lightbox.classList.add('show');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('show');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
            }
        });
    }

    // ==========================================================================
    // FAQ Accordion Logic
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Collapse all open FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                });
                
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // ==========================================================================
    // Floating Buttons & Scroll to Top Logic
    // ==========================================================================
    const btnScrollTop = document.getElementById('btn-scroll-top');
    
    if (btnScrollTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btnScrollTop.style.display = 'flex';
            } else {
                btnScrollTop.style.display = 'none';
            }
        });
        
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // Floating Calculate Cost Modal Controller
    // ==========================================================================
    const btnOpenCalcModal = document.getElementById('btn-open-calc-modal');
    const calcModal = document.getElementById('calc-modal');
    const calcModalClose = document.getElementById('calc-modal-close');

    const modalWellTypeSelect = document.getElementById('modal-well-type');
    const modalRateTag = document.getElementById('modal-rate-tag');
    const modalDepthInput = document.getElementById('modal-depth-input');
    const modalDepthSlider = document.getElementById('modal-depth-slider');
    const modalTotalCost = document.getElementById('modal-total-cost');
    const modalRateBreakdown = document.getElementById('modal-rate-breakdown');
    const modalWhatsappBtn = document.getElementById('modal-whatsapp-booking-btn');

    const WHATSAPP_PHONE = "919046062191";

    function updateModalCalculator() {
        if (!modalDepthInput || !modalTotalCost) return;

        let modalRate = 55;
        let wellTypeName = "Domestic Household";

        if (modalWellTypeSelect) {
            const val = modalWellTypeSelect.value;
            if (val === 'domestic') {
                modalRate = 55;
                wellTypeName = "Domestic Household";
            } else if (val === 'agricultural') {
                modalRate = 70;
                wellTypeName = "Agricultural Irrigation";
            } else if (val === 'commercial') {
                modalRate = 85;
                wellTypeName = "Commercial & Industrial";
            } else if (val === 'deep_calyx') {
                modalRate = 100;
                wellTypeName = "Deep Rock Calyx Core";
            }
        }

        if (modalRateTag) {
            modalRateTag.innerText = `Rate: ₹${modalRate}/ft`;
        }

        let depthVal = parseInt(modalDepthInput.value, 10);

        if (isNaN(depthVal) || depthVal <= 0) {
            modalTotalCost.innerText = "₹0";
            if (modalRateBreakdown) modalRateBreakdown.innerText = `0 feet × ₹${modalRate} / ft (${wellTypeName})`;
            if (modalWhatsappBtn) {
                modalWhatsappBtn.classList.add('disabled');
                modalWhatsappBtn.setAttribute('href', '#');
            }
            return;
        }

        // Enforce max depth limit of 1000 feet
        if (depthVal > 1000) {
            depthVal = 1000;
            modalDepthInput.value = 1000;
        }

        // Sync slider with input
        if (modalDepthSlider && parseInt(modalDepthSlider.value, 10) !== depthVal) {
            modalDepthSlider.value = depthVal;
        }

        const totalCost = depthVal * modalRate;
        const formattedCost = totalCost.toLocaleString('en-IN');

        modalTotalCost.innerText = `₹${formattedCost}`;
        if (modalRateBreakdown) {
            modalRateBreakdown.innerText = `${depthVal} feet × ₹${modalRate} / ft (${wellTypeName})`;
        }

        // Update WhatsApp pre-filled booking link
        if (modalWhatsappBtn) {
            modalWhatsappBtn.classList.remove('disabled');
            const messageText = `Hello Pal Borewells, I would like to book a ${wellTypeName} tubewell boring for ${depthVal} feet. Estimated cost: ₹${formattedCost} (at ₹${modalRate}/ft). Please contact me for site survey and details.`;
            const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageText)}`;
            modalWhatsappBtn.setAttribute('href', waUrl);
        }
    }

    if (btnOpenCalcModal && calcModal) {
        btnOpenCalcModal.addEventListener('click', () => {
            calcModal.classList.add('show');
            updateModalCalculator();
        });

        if (calcModalClose) {
            calcModalClose.addEventListener('click', () => {
                calcModal.classList.remove('show');
            });
        }

        calcModal.addEventListener('click', (e) => {
            if (e.target === calcModal) {
                calcModal.classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && calcModal.classList.contains('show')) {
                calcModal.classList.remove('show');
            }
        });
    }

    if (modalWellTypeSelect) {
        modalWellTypeSelect.addEventListener('change', updateModalCalculator);
    }

    if (modalDepthInput) {
        modalDepthInput.addEventListener('input', updateModalCalculator);
    }

    if (modalDepthSlider) {
        modalDepthSlider.addEventListener('input', (e) => {
            if (modalDepthInput) {
                modalDepthInput.value = e.target.value;
            }
            updateModalCalculator();
        });
    }

    // ==========================================================================
    // Mobile Navigation Drawer Toggle & Interactivity
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavCloseBtn = document.getElementById('mobile-nav-close');
    const mainNav = document.getElementById('main-nav');
    const navBackdrop = document.getElementById('nav-backdrop');
    const drawerBtnCalc = document.getElementById('drawer-btn-calc');

    function toggleMobileMenu(open) {
        if (!mainNav) return;
        const isOpen = open !== undefined ? open : !mainNav.classList.contains('active');
        if (isOpen) {
            mainNav.classList.add('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
            if (navBackdrop) navBackdrop.classList.add('active');
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        } else {
            mainNav.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            if (navBackdrop) navBackdrop.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    if (mobileNavCloseBtn) {
        mobileNavCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu(false);
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Open calculator modal from drawer footer button
    if (drawerBtnCalc) {
        drawerBtnCalc.addEventListener('click', () => {
            toggleMobileMenu(false);
            if (calcModal) {
                calcModal.classList.add('show');
                updateModalCalculator();
            }
        });
    }

    // Close drawer when clicking any nav link
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(false);
            });
        });
    }

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            toggleMobileMenu(false);
        }
    });

    // Active Section Scroll Highlight in Mobile Drawer & Header
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id && mainNav) {
                    const navItems = mainNav.querySelectorAll('.nav-item');
                    navItems.forEach(item => {
                        const href = item.getAttribute('href');
                        if (href === `#${id}`) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll('section[id]').forEach(sec => {
        sectionObserver.observe(sec);
    });
});

