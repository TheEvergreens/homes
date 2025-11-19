// --- The Evergreens Main Script ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Logic ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        if (sessionStorage.getItem('visitedBefore')) {
            preloader.style.display = 'none';
        } else {
            const preloaderVideo = document.getElementById('preloader-video');
            if(preloaderVideo) {
                preloaderVideo.playbackRate = 2.0;
                preloaderVideo.addEventListener('ended', () => {
                    preloader.classList.add('hidden');
                    sessionStorage.setItem('visitedBefore', 'true');
                });
            } else {
                preloader.style.display = 'none';
                sessionStorage.setItem('visitedBefore', 'true');
            }
        }
    }
    
    // --- High-Performance Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (cursor && follower) {
        let lastX = 0, lastY = 0, followerX = 0, followerY = 0, isMoving = false;
        document.addEventListener('mousemove', e => {
            lastX = e.clientX;
            lastY = e.clientY;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(animateCursor);
            }
        });
        function animateCursor() {
            if (!isMoving) return;
            cursor.style.transform = `translate(calc(${lastX}px - 50%), calc(${lastY}px - 50%))`;
            followerX += (lastX - followerX) * 0.15;
            followerY += (lastY - followerY) * 0.15;
            follower.style.transform = `translate(calc(${followerX}px - 50%), calc(${followerY}px - 50%))`;
            if (Math.abs(lastX - followerX) < 0.1 && Math.abs(lastY - followerY) < 0.1) {
                isMoving = false;
            } else {
                requestAnimationFrame(animateCursor);
            }
        }
        document.querySelectorAll('a, button, input, textarea, .nav-link, .modal-close').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });
    }

    // --- Global Header Scroll Effect ---
    const header = document.querySelector('.main-header');
    if(header) {
        const scrollEl = document.querySelector('.scroll-container') || window;
        scrollEl.addEventListener('scroll', () => {
            const scrollTop = scrollEl.scrollTop || window.scrollY;
            header.classList.toggle('scrolled', scrollTop > 50);
        }, { passive: true });
    }

    // --- Homepage: Snap-Scrolling Panel Visibility ---
    const homepageBody = document.querySelector('.homepage-body');
    if (homepageBody) {
        const scrollContainer = document.querySelector('.scroll-container');
        const sections = document.querySelectorAll('.scroll-section');
        if (scrollContainer && sections.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        sections.forEach(sec => sec.classList.remove('is-visible'));
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { root: scrollContainer, threshold: 0.6 });
            sections.forEach(section => observer.observe(section));
            setTimeout(() => {
                if (scrollContainer.scrollTop === 0) sections[0].classList.add('is-visible');
            }, 300);
        }
    }
    
    // --- Google Form Submission Logic (for contact.html) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            try {
                await fetch(contactForm.action, { 
                    method: 'POST', 
                    body: formData, 
                    mode: 'no-cors'
                });
            } catch (error) {
                console.error('Form submission failed:', error);
            } finally {
                window.location.href = 'thanks.html';
            }
        });
    }

    // --- Interest List Modal Logic (for homes.html) ---
    const modal = document.getElementById('interest-list-modal');
    const openButtons = document.querySelectorAll('.open-interest-modal');
    const closeButton = document.getElementById('modal-close-button');
    if (modal && openButtons.length > 0 && closeButton) {
        const openModal = () => document.body.classList.add('modal-open');
        const closeModal = () => document.body.classList.remove('modal-open');
        openButtons.forEach(button => button.addEventListener('click', openModal));
        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
});