'use strict';

// ============================================================
// nova.js - NOVA Chatbot Widget
// Chat bubble, message handling, proposal form, API calls
// ============================================================

(function(){
    var API_BASE = 'https://imobi-api.vercel.app/api';
    var isOpen = false;
    var messages = [];
    var isLoading = false;
    var bannerDismissed = false;

    setTimeout(function(){ document.getElementById('nova-btn').classList.add('visible'); }, 3000);
    setTimeout(function(){ if(!bannerDismissed && !isOpen){ document.getElementById('nova-banner').classList.add('visible'); } }, 5000);
    setTimeout(function(){ if(!isOpen) hideNovaBanner(); }, 15000);

    window.hideNovaBanner = function(){ bannerDismissed = true; document.getElementById('nova-banner').classList.remove('visible'); };

    window.novaToggle = function(){
        isOpen = !isOpen;
        document.getElementById('nova-chat').classList.toggle('open', isOpen);
        document.getElementById('nova-btn').classList.toggle('hidden', isOpen);
        hideNovaBanner();
        if(isOpen && messages.length === 0){
            setTimeout(showTyping, 300);
            setTimeout(function(){
                hideTyping();
                addBot("Hello! I'm NOVA, the AI assistant for IMOBI Holdings.\n\nI can help you learn about our engineering services, discuss potential projects, or generate a custom proposal for you.\n\nHow can I help you today?", ['Our Services', 'Get a Proposal', 'Pricing Info']);
            }, 1000);
        }
    };

    function escapeHtml(text){ var div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

    function formatMessage(text){
        return escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<div style="height:8px;"></div>')
            .replace(/\n/g, '<br>');
    }

    function addBot(txt, qr){
        var c = document.getElementById('nova-body');
        var old = c.querySelector('.nova-quick');
        if(old) old.remove();
        var m = document.createElement('div');
        m.className = 'nova-msg bot';
        m.innerHTML = formatMessage(txt);
        c.appendChild(m);
        messages.push({role: 'assistant', content: txt});
        if(qr && qr.length){
            var q = document.createElement('div');
            q.className = 'nova-quick';
            qr.forEach(function(r){
                var b = document.createElement('button');
                b.className = 'nova-qbtn';
                b.textContent = r;
                b.onclick = function(){ novaSend(r); };
                q.appendChild(b);
            });
            c.appendChild(q);
        }
        c.scrollTop = c.scrollHeight;
    }

    function addUser(txt){
        var c = document.getElementById('nova-body');
        var old = c.querySelector('.nova-quick');
        if(old) old.remove();
        var m = document.createElement('div');
        m.className = 'nova-msg user';
        m.textContent = txt;
        c.appendChild(m);
        c.scrollTop = c.scrollHeight;
        messages.push({role: 'user', content: txt});
    }

    function showTyping(){
        document.getElementById('nova-status').textContent = 'Typing...';
        var c = document.getElementById('nova-body');
        var t = document.createElement('div');
        t.id = 'nova-typing';
        t.className = 'nova-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        c.appendChild(t);
        c.scrollTop = c.scrollHeight;
    }

    function hideTyping(){
        var t = document.getElementById('nova-typing');
        if(t) t.remove();
        document.getElementById('nova-status').textContent = 'Online';
    }

    function showProposalForm(){
        var c = document.getElementById('nova-body');
        var f = document.createElement('div');
        f.id = 'nova-proposal-form';
        f.className = 'nova-proposal';
        f.innerHTML =
            '<h4>Generate Your Proposal</h4>' +
            '<input type="text" id="pf-name" placeholder="Your name *">' +
            '<input type="text" id="pf-company" placeholder="Company name *">' +
            '<input type="email" id="pf-email" placeholder="Email address *">' +
            '<select id="pf-type">' +
                '<option value="">Select project type *</option>' +
                '<option value="AI/ML Solutions">AI/ML Solutions</option>' +
                '<option value="Custom Software">Custom Software Development</option>' +
                '<option value="IoT Solutions">IoT & Embedded Systems</option>' +
                '<option value="R&D & Innovation">R&D & Innovation</option>' +
                '<option value="Team Extension">Team Extension</option>' +
                '<option value="MVP & Prototypes">MVP & Prototypes</option>' +
                '<option value="Other">Other</option>' +
            '</select>' +
            '<textarea id="pf-desc" placeholder="Briefly describe your project..."></textarea>' +
            '<select id="pf-budget">' +
                '<option value="">Estimated budget (optional)</option>' +
                '<option value="$25K - $50K">$25,000 - $50,000</option>' +
                '<option value="$50K - $100K">$50,000 - $100,000</option>' +
                '<option value="$100K - $200K">$100,000 - $200,000</option>' +
                '<option value="$200K+">$200,000+</option>' +
                '<option value="Not sure">Not sure yet</option>' +
            '</select>' +
            '<select id="pf-referral">' +
                '<option value="">Were you referred by someone?</option>' +
                '<option value="No">No / Direct contact</option>' +
                '<option value="Sales Partner">Yes, by a Sales Partner</option>' +
                '<option value="Employee">Yes, by an IMOBI employee</option>' +
                '<option value="Other">Yes, other referral</option>' +
            '</select>' +
            '<input type="text" id="pf-referrer" placeholder="Referrer\'s name (if applicable)">' +
            '<div class="nova-proposal-btns">' +
                '<button class="nova-proposal-submit" id="pf-submit" onclick="novaSubmitProposal()">Generate & Send</button>' +
                '<button class="nova-proposal-cancel" onclick="novaCancelProposal()">Cancel</button>' +
            '</div>';
        c.appendChild(f);
        c.scrollTop = c.scrollHeight;
    }

    window.novaSubmitProposal = function(){
        var name = document.getElementById('pf-name').value.trim();
        var company = document.getElementById('pf-company').value.trim();
        var email = document.getElementById('pf-email').value.trim();
        var type = document.getElementById('pf-type').value;
        var desc = document.getElementById('pf-desc').value.trim();
        var budget = document.getElementById('pf-budget').value;
        var referral = document.getElementById('pf-referral').value;
        var referrer = document.getElementById('pf-referrer').value.trim();
        if(!name || !company || !email || !type){ alert('Please fill in all required fields'); return; }
        var btn = document.getElementById('pf-submit');
        btn.disabled = true;
        btn.textContent = 'Generating...';
        fetch(API_BASE + '/proposal', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contact_name: name, company: company, email: email, project_type: type, project_description: desc, budget_range: budget, referral_source: referral, referrer_name: referrer })
        })
        .then(function(res){ return res.json(); })
        .then(function(data){
            var form = document.getElementById('nova-proposal-form');
            if(form) form.remove();
            if(data.success){
                addBot("\u2705 Great news, " + name + "! I've generated a customized proposal and sent it to " + email + ".\n\nPlease check your inbox (and spam folder). Our team will follow up within 24 hours.", ['Learn More', 'Contact Team']);
            } else {
                addBot("I apologize, but there was an issue: " + (data.error || 'Unknown error') + "\n\nPlease contact us directly at contact@imobiallholdings.com", ['Try Again', 'Contact Team']);
            }
        })
        .catch(function(err){
            var form = document.getElementById('nova-proposal-form');
            if(form) form.remove();
            addBot("I couldn't connect to our system. Please contact us at contact@imobiallholdings.com", ['Contact Team']);
        });
    };

    window.novaCancelProposal = function(){
        var form = document.getElementById('nova-proposal-form');
        if(form) form.remove();
        isLoading = false;
        addBot("No problem! Let me know if you have any other questions.", ['Our Services', 'Pricing Info']);
    };

    function callAPI(userMessage){
        var msgLower = userMessage.toLowerCase();
        // Check if user wants a proposal
        if(msgLower.includes('proposal') || msgLower.includes('quote') || msgLower.includes('get a proposal')){
            hideTyping();
            isLoading = false;
            addBot("I'd be happy to generate a customized proposal for you! Let me collect a few details.", null);
            setTimeout(showProposalForm, 500);
            return;
        }
        fetch(API_BASE + '/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({messages: messages})
        })
        .then(function(res){ return res.json(); })
        .then(function(data){
            hideTyping();
            isLoading = false;
            if(data.error){
                addBot("I'm having trouble connecting. You can reach us at contact@imobiallholdings.com", ['Contact Info']);
            } else {
                addBot(data.response, ['More Questions']);
            }
        })
        .catch(function(err){
            hideTyping();
            isLoading = false;
            addBot("Connection issue. Please try again or email contact@imobiallholdings.com", ['Try Again']);
        });
    }

    window.novaSend = function(txt){
        if(isLoading) return;
        var input = document.getElementById('nova-text');
        var msg = txt || input.value.trim();
        if(!msg) return;
        addUser(msg);
        input.value = '';
        document.getElementById('nova-send').disabled = true;
        isLoading = true;
        showTyping();
        setTimeout(function(){ callAPI(msg); }, 300);
    };

    document.getElementById('nova-text').addEventListener('input', function(){
        document.getElementById('nova-send').disabled = !this.value.trim() || isLoading;
    });
})();
