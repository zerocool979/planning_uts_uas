/*
 * File: main.js
 * Deskripsi: Skrip JavaScript untuk simulasi interaksi frontend-only.
 * Termasuk simulasi login, overplay warning, dan battle/chat interaksi.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Check: Redirect if not logged in (dummy check)
    const currentPage = window.location.pathname.split('/').pop();
    const isLoggedIn = localStorage.getItem('player_username');

    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'register.html') {
        if (currentPage !== 'overplay_warning.html') { // Biarkan modal terpisah ini bisa diakses, walau idealnya modal
            // window.location.href = 'login.html'; // Mengganggu jika di-debug lokal
            console.log("Simulasi: Pengguna tidak login, seharusnya redirect ke login.html.");
        }
    }

    // 2. Login/Register Simulation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            if (username) {
                localStorage.setItem('player_username', username);
                alert(`Login Berhasil! Selamat datang, ${username}!`);
                window.location.href = 'index.html';
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Dummy registration
            alert('Registrasi Berhasil! Silakan Login.');
            window.location.href = 'login.html';
        });
    }

    // 3. Overplay Warning Modal Logic
    const showOverplayWarning = (duration) => {
        const modal = document.getElementById('overplayWarningModal');
        if (modal) {
            document.getElementById('overplayDuration').textContent = duration;
            modal.classList.add('active');
        }
    };

    const closeOverplayWarning = () => {
        const modal = document.getElementById('overplayWarningModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Global function access (for use on any page for testing)
    window.showOverplayWarning = showOverplayWarning;
    window.closeOverplayWarning = closeOverplayWarning;

    // Simulate warning trigger on dashboard for testing (e.g., after 5s)
    if (currentPage === 'index.html') {
        setTimeout(() => {
            console.log("Simulasi: Overplay Warning dipicu (lebih dari 2 jam).");
            // showOverplayWarning('2 Jam 15 Menit'); // Uncomment to test the modal
        }, 5000);
    }
    
    // 4. Battle Screen Simulation (battle.html)
    const attackButton = document.getElementById('attackBtn');
    if (attackButton) {
        let playerHP = 100;
        let enemyHP = 100;
        const playerHPBar = document.getElementById('playerHP');
        const enemyHPBar = document.getElementById('enemyHP');
        const battleLog = document.getElementById('battleLog');
        
        const logMessage = (msg) => {
            const p = document.createElement('p');
            p.textContent = msg;
            p.style.fontSize = '1em';
            battleLog.prepend(p); // Add to top
        };

        attackButton.addEventListener('click', () => {
            if (playerHP <= 0 || enemyHP <= 0) return;

            // Player Attack
            const playerDamage = Math.floor(Math.random() * 20) + 10;
            enemyHP = Math.max(0, enemyHP - playerDamage);
            enemyHPBar.style.width = `${enemyHP}%`;
            logMessage(`[PLAYER] menyerang! Damage: ${playerDamage}`);

            if (enemyHP === 0) {
                logMessage('MUSUH KALAH! Pertarungan Selesai!');
                setTimeout(() => window.location.href = 'result.html?status=win', 1500);
                return;
            }

            // Enemy Counter-Attack (delayed)
            setTimeout(() => {
                const enemyDamage = Math.floor(Math.random() * 15) + 5;
                playerHP = Math.max(0, playerHP - enemyDamage);
                playerHPBar.style.width = `${playerHP}%`;
                logMessage(`[ENEMY] menyerang balik! Damage: ${enemyDamage}`);

                if (playerHP === 0) {
                    logMessage('ANDA KALAH! Pertarungan Selesai!');
                    setTimeout(() => window.location.href = 'result.html?status=lose', 1500);
                }
            }, 1000);
        });
    }

    // 5. Chat Simulation (chat.html)
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        const chatWindow = document.getElementById('chatWindow');
        const username = localStorage.getItem('player_username') || 'PLAYER_GUEST';
        
        // Dummy Chat History
        const dummyMessages = [
            `<strong>SYSTEM:</strong> Welcome to the Global Chat!`,
            `<strong>DevLog:</strong> Mode Rank S2 telah dimulai.`,
            `<strong>RETRO_GAMER:</strong> Ada yang mau PvP sekarang?`
        ];
        
        dummyMessages.forEach(msg => {
            const p = document.createElement('p');
            p.classList.add('chat-message');
            p.innerHTML = msg;
            chatWindow.appendChild(p);
        });
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageInput = document.getElementById('messageInput');
            const messageText = messageInput.value.trim();

            if (messageText) {
                const p = document.createElement('p');
                p.classList.add('chat-message');
                p.innerHTML = `<strong>${username}:</strong> ${messageText}`;
                chatWindow.appendChild(p);
                messageInput.value = ''; // Clear input
                chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
            }
        });
    }

    // 6. PvP Matchmaking Simulation (pvp_match.html)
    const findMatchBtn = document.getElementById('findMatchBtn');
    if (findMatchBtn) {
        findMatchBtn.addEventListener('click', () => {
            const statusElement = document.getElementById('matchmakingStatus');
            statusElement.innerHTML = 'Status: <span style="color: var(--color-accent);">SEARCHING...</span>';
            findMatchBtn.disabled = true;

            // Simulate matchmaking delay
            setTimeout(() => {
                const isMatchFound = Math.random() > 0.2; // 80% chance to find match
                if (isMatchFound) {
                    statusElement.innerHTML = 'Status: <span style="color: var(--color-border);">MATCH FOUND! Starting Battle...</span>';
                    setTimeout(() => window.location.href = 'battle.html', 1500);
                } else {
                    statusElement.innerHTML = 'Status: <span style="color: #f00;">TIMEOUT. No opponent found.</span>';
                    findMatchBtn.disabled = false;
                }
            }, 3000);
        });
    }
    
    // 7. Result Screen Logic (result.html)
    if (currentPage === 'result.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status') || 'draw'; // 'win', 'lose', 'draw'
        
        const resultTitle = document.getElementById('resultTitle');
        const xpGained = Math.floor(Math.random() * 500) + 100;
        
        if (status === 'win') {
            resultTitle.textContent = 'VICTORY!';
            resultTitle.style.color = 'var(--color-border)';
            document.getElementById('rewardXP').textContent = xpGained;
            document.getElementById('rewardRank').textContent = '+25 (Simulated)';
        } else if (status === 'lose') {
            resultTitle.textContent = 'DEFEAT...';
            resultTitle.style.color = '#ff0000';
            document.getElementById('rewardXP').textContent = Math.floor(xpGained / 4);
            document.getElementById('rewardRank').textContent = '-15 (Simulated)';
        } else {
            resultTitle.textContent = 'DRAW';
            resultTitle.style.color = 'var(--color-accent)';
            document.getElementById('rewardXP').textContent = Math.floor(xpGained / 2);
            document.getElementById('rewardRank').textContent = '+0 (Simulated)';
        }
    }
});