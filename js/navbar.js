'use strict';

// ============================================================
// navbar.js - Navbar scroll behavior and mobile toggle handler
// ============================================================

(function() {

    // Navbar scroll - add/remove 'scrolled' class on scroll
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu toggle
    var mobileToggle = document.querySelector('.mobile-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('mobile-open');
        });
    });

})();
