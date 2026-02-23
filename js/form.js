'use strict';

// ============================================================
// form.js - Contact form submission, validation, referral toggle
// ============================================================

(function() {

    // Referral field toggle
    var referralSelect = document.getElementById('referral-select');
    var referralNameGroup = document.getElementById('referral-name-group');
    if (referralSelect && referralNameGroup) {
        referralSelect.addEventListener('change', function() {
            if (this.value && this.value !== '') {
                referralNameGroup.style.display = 'block';
            } else {
                referralNameGroup.style.display = 'none';
                document.getElementById('referrer-name').value = '';
            }
        });
    }

})();

// Contact Form Submit - Sends proposal to client + notification to IMOBI
// Must be global (called from HTML onsubmit)
window.submitContactForm = function(event) {
    event.preventDefault();

    var form = document.getElementById('contact-form');
    var submitBtn = form.querySelector('.form-submit');
    var originalText = submitBtn.textContent;

    // Get form values
    var name = document.getElementById('cf-name').value.trim();
    var company = document.getElementById('cf-company').value.trim() || 'Not specified';
    var email = document.getElementById('cf-email').value.trim();
    var interest = form.querySelector('select[name="interest"]').value || 'Custom Software';
    var message = form.querySelector('textarea[name="message"]').value.trim();
    var referralSource = document.getElementById('referral-select').value || '';
    var referrerName = document.getElementById('referrer-name').value.trim() || '';

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending proposal...';

    // Send to /api/proposal (generates and sends proposal to client)
    fetch('https://imobi-api.vercel.app/api/proposal', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contact_name: name,
            company: company,
            email: email,
            project_type: interest,
            project_description: message,
            budget_range: '',
            referral_source: referralSource,
            referrer_name: referrerName
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            // Redirect to thank you page
            window.location.href = 'thank-you.html';
        } else {
            // If proposal fails, still redirect but log error
            console.error('Proposal error:', data.error);
            window.location.href = 'thank-you.html';
        }
    })
    .catch(function(err) {
        console.error('Form submission error:', err);
        // Redirect anyway - at least user sees confirmation
        window.location.href = 'thank-you.html';
    });
};
