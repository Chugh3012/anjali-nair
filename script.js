// Create floating hearts in the background
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const heartEmojis = ['💕', '💖', '💗', '💝', '💓', '💞', '❤️', '🧡', '💛', '💚', '💙', '💜'];
    const maxHearts = 30;
    
    setInterval(() => {
        // Limit the number of hearts to prevent unbounded DOM growth
        if (container.children.length >= maxHearts) {
            return;
        }
        
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        const duration = Math.random() * 3 + 5;
        heart.style.animationDuration = duration + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        container.appendChild(heart);
        
        // Remove heart after its animation completes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 300);
}

// No button - runs away from cursor
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
let isNoBtnMoving = false;
let noAttempts = 0;
let noButtonScale = 1;
let yesButtonScale = 1;
let moveDistance = 200;

// Constants for animations
const BASE_GLOW_INTENSITY = 0.4;
const GLOW_INCREMENT = 0.1;
const ACCELERATION_MULTIPLIER = 1.2;
const MAX_ACCELERATION_ATTEMPTS = 5;
const MIN_ANIMATION_SPEED = 0.15; // seconds

// Text arrays for progressive changes
const noButtonTexts = [
    "No",
    "Are you sure?",
    "Really?",
    "Think again! 🤔",
    "But why? 😢",
    "Please reconsider! 💔",
    "This is a mistake! 😭",
    "My heart... 💔"
];

const yesButtonTexts = [
    "Yes! 💕",
    "YES!! 💕💕",
    "YES!!! 💕💕💕",
    "YESSS!!!! 💕💕💕💕"
];

const tooltipMessages = [
    "Wrong button! ❌",
    "Nope, try again! 😊",
    "You sure about that? 🤔",
    "Come on now... 💕",
    "The other button is better! ✨"
];

const counterMessages = {
    3: "Still trying? 🤨",
    5: "You've tried 5 times... we both know the answer! 💕",
    7: "Come on now... just say yes! 😊",
    10: "This is getting silly! 😄"
};

function moveAwayFromCursor(e) {
    if (isNoBtnMoving) return;
    
    // Increment attempts counter
    noAttempts++;
    
    // Update attempt counter display
    updateAttemptCounter();
    
    // Show tooltip
    showTooltip(e.clientX, e.clientY);
    
    // Update "No" button scale (shrink by 10% each time, minimum 30%)
    noButtonScale = Math.max(0.3, 1 - (noAttempts * 0.1));
    noBtn.style.transform = `scale(${noButtonScale})`;
    
    // Update "Yes" button scale (grow by 5% each time)
    yesButtonScale = 1 + (noAttempts * 0.05);
    yesBtn.style.transform = `scale(${yesButtonScale})`;
    
    // Update "No" button text
    const textIndex = Math.min(noAttempts - 1, noButtonTexts.length - 1);
    if (textIndex >= 0) {
        noBtn.textContent = noButtonTexts[textIndex];
    }
    
    // Update "Yes" button text
    const yesTextIndex = Math.min(Math.floor(noAttempts / 3), yesButtonTexts.length - 1);
    if (yesTextIndex >= 0) {
        yesBtn.textContent = yesButtonTexts[yesTextIndex];
    }
    
    // Increase glow intensity for "Yes" button
    const glowIntensity = BASE_GLOW_INTENSITY + (noAttempts * GLOW_INCREMENT);
    yesBtn.style.boxShadow = `0 5px 15px rgba(255, 20, 147, ${Math.min(glowIntensity, 1)})`;
    
    // Check if "No" button should disappear (10-12 attempts)
    if (noAttempts >= 10) {
        noBtn.classList.add('fade-out');
        setTimeout(() => {
            noBtn.style.display = 'none';
            yesBtn.classList.add('center-yes');
            
            // Show special message
            const counterMessage = document.getElementById('counterMessage');
            counterMessage.textContent = "There was never really a choice! 💖";
            counterMessage.style.fontSize = '1.5em';
            counterMessage.style.color = '#ff1493';
            
            // Auto-celebrate after 2 seconds
            setTimeout(() => {
                yesBtn.click();
            }, 2000);
        }, 1000);
        return;
    }
    
    const btn = noBtn;
    const btnRect = btn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const distance = Math.sqrt(
        Math.pow(mouseX - btnCenterX, 2) + 
        Math.pow(mouseY - btnCenterY, 2)
    );
    
    // If cursor is too close, move the button
    if (distance < 150) {
        isNoBtnMoving = true;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Generate random position ensuring button stays in viewport
        const maxX = viewportWidth - btnRect.width - 20;
        const maxY = viewportHeight - btnRect.height - 20;
        
        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;
        
        // Make sure the new position is far from the cursor
        // Increase distance with each attempt (acceleration)
        const minDistance = moveDistance * Math.pow(ACCELERATION_MULTIPLIER, Math.min(noAttempts - 1, MAX_ACCELERATION_ATTEMPTS));
        let attempts = 0;
        while (attempts < 10) {
            const distanceFromCursor = Math.sqrt(
                Math.pow(mouseX - newX, 2) + 
                Math.pow(mouseY - newY, 2)
            );
            
            if (distanceFromCursor > minDistance) {
                break;
            }
            
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
            attempts++;
        }
        
        btn.style.position = 'fixed';
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
        
        // Speed increases with each attempt
        const speed = Math.max(MIN_ANIMATION_SPEED, 0.3 - (noAttempts * 0.02));
        btn.style.transition = `all ${speed}s ease`;
        
        setTimeout(() => {
            isNoBtnMoving = false;
        }, speed * 1000);
    }
}

// Update attempt counter display
function updateAttemptCounter() {
    const counter = document.getElementById('attemptCounter');
    const counterText = document.getElementById('counterText');
    const counterMessage = document.getElementById('counterMessage');
    
    counter.style.display = 'block';
    counterText.textContent = `Attempts: ${noAttempts}`;
    
    // Show special messages at certain attempt counts
    if (counterMessages[noAttempts]) {
        counterMessage.textContent = counterMessages[noAttempts];
    }
}

// Show tooltip near cursor
function showTooltip(x, y) {
    const tooltip = document.getElementById('noTooltip');
    const randomMessage = tooltipMessages[Math.floor(Math.random() * tooltipMessages.length)];
    
    tooltip.textContent = randomMessage;
    tooltip.style.left = (x + 20) + 'px';
    tooltip.style.top = (y - 40) + 'px';
    tooltip.classList.add('show');
    
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 1500);
}

// Add event listeners for no button
noBtn.addEventListener('mouseenter', moveAwayFromCursor);
noBtn.addEventListener('mousemove', moveAwayFromCursor);
document.addEventListener('mousemove', (e) => {
    if (!isNoBtnMoving) {
        moveAwayFromCursor(e);
    }
});

// Prevent clicking the No button (just in case)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveAwayFromCursor(e);
});

// Yes button - show celebration
const modal = document.getElementById('successModal');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Confetti class
class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    getRandomColor() {
        const colors = [
            '#ff1493', '#ff69b4', '#ff6b9d', '#ffc0cb', 
            '#ffb6c1', '#ff1744', '#f50057', '#c51162',
            '#ff4081', '#ff80ab'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

// Heart confetti class
class HeartConfetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 20 + 15;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.emoji = ['💕', '💖', '💗', '💝', '❤️'][Math.floor(Math.random() * 5)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }
    
    draw() {
        ctx.font = this.size + 'px Arial';
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

let confettiArray = [];
let heartConfettiArray = [];
let animationId;

function createConfetti() {
    confettiArray = [];
    heartConfettiArray = [];
    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiArray.push(new Confetti());
    }
    
    // Create heart confetti
    for (let i = 0; i < 30; i++) {
        heartConfettiArray.push(new HeartConfetti());
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiArray.forEach(confetti => {
        confetti.update();
        confetti.draw();
    });
    
    heartConfettiArray.forEach(heart => {
        heart.update();
        heart.draw();
    });
    
    animationId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Yes button click handler
yesBtn.addEventListener('click', () => {
    modal.classList.add('show');
    createConfetti();
    animateConfetti();
    
    // Play a celebratory sound effect (optional - commented out)
    // You can add an audio element if desired
    
    // Stop confetti after 10 seconds
    setTimeout(() => {
        stopConfetti();
    }, 10000);
});

// Close modal when clicking outside (optional)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        stopConfetti();
    }
});

// Initialize floating hearts
createFloatingHearts();
