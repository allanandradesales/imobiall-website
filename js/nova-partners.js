'use strict';

// ============================================================
// nova-partners.js - NOVA Chatbot Widget (Partner Page variant)
// Different greeting and emoji-to-SVG icon formatting
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
                addBot("Hello! I'm NOVA, the AI assistant for IMOBI Holdings.\n\nInterested in becoming a sales partner? I can answer your questions about our commission structure, ideal partner profile, or help you get started.\n\nHow can I help?", ['Commission Details', 'Partner Requirements', 'How to Apply']);
            }, 1000);
        }
    };

    function escapeHtml(text){
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatMessage(text){
        var icons = {
            '\u2705': '<svg class="nova-icon nova-icon-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
            '\uD83D\uDCB0': '<svg class="nova-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
            '\uD83D\uDC65': '<svg class="nova-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>'
        };
        var result = escapeHtml(text);
        for (var emoji in icons) { result = result.split(emoji).join(icons[emoji]); }
        return result
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

    function callAPI(userMessage){
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
                addBot("I'm having trouble connecting. You can reach us at contact@imobiallholdings.com or call +1 407 205 9042.", ['Contact Info']);
            } else {
                addBot(data.response, ['More Questions', 'Apply Now']);
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
