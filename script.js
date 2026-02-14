// Create floating hearts in the background
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const heartEmojis = ['💕', '💖', '💗', '💝', '💓', '💞', '❤️', '🧡', '💛', '💚', '💙', '💜'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 300);
}

// No button - runs away from cursor
const noBtn = document.getElementById('noBtn');
let isNoBtnMoving = false;

function moveAwayFromCursor(e) {
    if (isNoBtnMoving) return;
    
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
        const minDistance = 200;
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
        btn.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            isNoBtnMoving = false;
        }, 300);
    }
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
const yesBtn = document.getElementById('yesBtn');
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

// Add some fun console message
console.log('%c💕 Welcome to a special place! 💕', 'color: #ff1493; font-size: 20px; font-weight: bold;');
