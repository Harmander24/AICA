// ================================================
// AICA 3D Premium Website - Main JavaScript
// ================================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. PRELOADER =====
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('loaded');
        }, 800);
    });

    // ===== 2. THREE.JS BACKGROUND =====
    const canvas = document.querySelector('#bg-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 800;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.12,
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Subtle geometric shape
        const torusGeometry = new THREE.TorusKnotGeometry(8, 2.5, 100, 16);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            wireframe: true,
            transparent: true,
            opacity: 0.06
        });
        const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
        scene.add(torusKnot);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation
        const clock = new THREE.Clock();
        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; });

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsed * 0.03;
            particlesMesh.rotation.x = elapsed * 0.015;

            torusKnot.rotation.y += 0.003;
            torusKnot.rotation.x += 0.001;

            const targetY = -scrollY * 0.005;
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 3 + targetY - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ===== 3. NAVIGATION =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const topBar = document.querySelector('.top-bar');

    // Scroll effects
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }
        // Hide top bar on scroll
        if (topBar) {
            topBar.style.transform = scrolled ? 'translateY(-100%)' : 'translateY(0)';
            topBar.style.transition = 'transform 0.3s ease';
            if (navbar) {
                navbar.style.top = scrolled ? '0' : '32px';
            }
        }

        // Back to top
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }

        // Active nav link
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (window.scrollY >= top && window.scrollY < bottom) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Hamburger toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ===== 4. HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }

    // ===== 5. GSAP ANIMATIONS =====
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero content
        gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' });
        gsap.from('.hero-content h1', { y: 50, opacity: 0, duration: 1, delay: 1.1, ease: 'power3.out' });
        gsap.from('.hero-tagline', { y: 30, opacity: 0, duration: 0.8, delay: 1.3, ease: 'power3.out' });
        gsap.from('.hero-btns', { y: 30, opacity: 0, duration: 0.8, delay: 1.5, ease: 'power3.out' });
        gsap.from('.hero-stats .stat-item', { y: 30, opacity: 0, duration: 0.6, delay: 1.7, stagger: 0.15, ease: 'power3.out' });

        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: { trigger: header, start: 'top 85%' },
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
            });
        });

        // Glass cards
        gsap.utils.toArray('.glass-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 88%' },
                y: 60, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        });

        // Facility cards stagger
        const facilityCards = document.querySelectorAll('.facility-card');
        if (facilityCards.length) {
            gsap.from(facilityCards, {
                scrollTrigger: { trigger: '.facilities-grid', start: 'top 80%' },
                y: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
            });
        }

        // Club cards
        gsap.utils.toArray('.clubs-grid').forEach(grid => {
            gsap.from(grid.querySelectorAll('.club-card'), {
                scrollTrigger: { trigger: grid, start: 'top 85%' },
                scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)'
            });
        });

        // Gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length) {
            gsap.from(galleryItems, {
                scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' },
                y: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
            });
        }

        // Contact cards
        const contactCards = document.querySelectorAll('.contact-card');
        if (contactCards.length) {
            gsap.from(contactCards, {
                scrollTrigger: { trigger: '.contact-info-cards', start: 'top 85%' },
                x: -30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out'
            });
        }
    }

    // ===== 6. IMAGE FAILSAFE =====
    const fallbackImages = [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ];

    let fallbackIndex = 0;

    function getNextFallback() {
        const url = fallbackImages[fallbackIndex % fallbackImages.length];
        fallbackIndex++;
        return url;
    }

    // Fix broken <img> tags
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (!this.dataset.retried) {
                this.dataset.retried = 'true';
                this.src = getNextFallback();
            }
        });
    });

    // Fix broken background images
    document.querySelectorAll('.club-card, .hero-slide').forEach(el => {
        const bgMatch = el.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (bgMatch && bgMatch[1]) {
            const testImg = new Image();
            testImg.onerror = () => {
                el.style.backgroundImage = `url('${getNextFallback()}')`;
            };
            testImg.src = bgMatch[1];
        }
    });

    // ===== 7. GALLERY LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===== 8. 3D TILT EFFECT =====
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ===== 9. SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== 10. NOTICE TICKER DUPLICATION =====
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        // Clone content for seamless loop
        tickerTrack.innerHTML += tickerTrack.innerHTML;
    }

});
