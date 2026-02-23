'use strict';

// ============================================================
// modal.js - openModal() and closeModal() functions, ESC key handler
// ============================================================

// Modal functions for territory cities - must be global (called from HTML onclick)
window.openModal = function(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.getElementById(modalId + '-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById(modalId + '-overlay').classList.remove('active');
    document.body.style.overflow = '';
};

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal('available-modal');
        closeModal('claimed-modal');
    }
});
