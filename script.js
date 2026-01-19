// Animation de la carte au clic
const card = document.querySelector('.card');
const cardInner = document.querySelector('.card-inner');

card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    
    // Lancer les confettis quand on retourne la carte
    if (card.classList.contains('flipped')) {
        createConfetti();
        createParticles();
        createHeartBurst();
    } else {
        createConfetti();
    }
});

// Système de confettis
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiParticles = [];

class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }
    
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        // Ajouter un peu de gravité
        this.speedY += 0.1;
        
        // Réinitialiser si la particule sort de l'écran
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

function createConfetti() {
    // Créer 200 particules de confettis
    for (let i = 0; i < 200; i++) {
        confettiParticles.push(new Confetti());
    }
    
    // Animer pendant 8 secondes
    animateConfetti();
    
    // Nettoyer après 8 secondes
    setTimeout(() => {
        confettiParticles = confettiParticles.filter(p => p.y < canvas.height);
    }, 8000);
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Redimensionner le canvas quand la fenêtre change de taille
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Système de particules de fond
const particlesCanvas = document.getElementById('particles-canvas');
const particlesCtx = particlesCanvas.getContext('2d');

particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

let backgroundParticles = [];

class BackgroundParticle {
    constructor() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = ['rgba(255, 255, 255, 0.8)', 'rgba(255, 200, 200, 0.6)', 'rgba(200, 255, 200, 0.6)', 
                       'rgba(200, 200, 255, 0.6)', 'rgba(255, 255, 200, 0.6)'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
        
        this.opacity += (Math.random() - 0.5) * 0.02;
        this.opacity = Math.max(0.1, Math.min(0.8, this.opacity));
    }
    
    draw() {
        particlesCtx.save();
        particlesCtx.globalAlpha = this.opacity;
        particlesCtx.fillStyle = this.color;
        particlesCtx.beginPath();
        particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particlesCtx.fill();
        particlesCtx.restore();
    }
}

function initBackgroundParticles() {
    for (let i = 0; i < 50; i++) {
        backgroundParticles.push(new BackgroundParticle());
    }
    animateBackgroundParticles();
}

function animateBackgroundParticles() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    
    backgroundParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateBackgroundParticles);
}

// Système de particules pour les interactions
function createParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'interaction-particle';
            particle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${getRandomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${card.offsetLeft + card.offsetWidth / 2}px;
                top: ${card.offsetTop + card.offsetHeight / 2}px;
                animation: particleExplode 1s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 20);
    }
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Ajouter l'animation CSS pour les particules d'interaction
const style = document.createElement('style');
style.textContent = `
    @keyframes particleExplode {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Créer une explosion de cœurs
function createHeartBurst() {
    const heartEmojis = ['❤️', '💖', '💝', '💗', '💕', '💓'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.cssText = `
                position: fixed;
                font-size: 2rem;
                pointer-events: none;
                z-index: 9999;
                left: ${card.offsetLeft + card.offsetWidth / 2}px;
                top: ${card.offsetTop + card.offsetHeight / 2}px;
                animation: heartBurst 2s ease-out forwards;
            `;
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
}

// Ajouter l'animation CSS pour l'explosion de cœurs
const heartStyle = document.createElement('style');
heartStyle.textContent = `
    @keyframes heartBurst {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 - 150}px) scale(1.5) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartStyle);

// Effet de confettis au chargement de la page
window.addEventListener('load', () => {
    setTimeout(() => {
        createConfetti();
        initBackgroundParticles();
    }, 500);
});

// Ajouter des effets de particules au survol de la carte
card.addEventListener('mouseenter', () => {
    card.style.transform = 'scale(1.05) rotate(2deg)';
    card.style.transition = 'transform 0.3s ease';
    createParticles();
});

card.addEventListener('mouseleave', () => {
    card.style.transform = 'scale(1) rotate(0deg)';
});

// Animation supplémentaire pour les ballons au clic
document.querySelectorAll('.balloon').forEach(balloon => {
    balloon.addEventListener('click', function() {
        this.style.animation = 'none';
        this.style.transform = 'scale(1.5) rotate(360deg)';
        setTimeout(() => {
            this.style.animation = 'float 6s ease-in-out infinite, balloonGlow 3s ease-in-out infinite';
            this.style.transform = '';
        }, 500);
        createConfetti();
    });
});

// Animation au mouvement de la souris
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: fixed;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 9998;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        animation: mouseSparkle 1s ease-out forwards;
    `;
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
});

// Ajouter l'animation CSS pour les étincelles de souris
const mouseStyle = document.createElement('style');
mouseStyle.textContent = `
    @keyframes mouseSparkle {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(mouseStyle);

// Animation des lettres du titre au survol
document.querySelectorAll('.title .letter').forEach((letter, index) => {
    letter.addEventListener('mouseenter', function() {
        this.style.animation = 'letterBounce 0.5s ease-in-out, gradientText 1s ease';
        setTimeout(() => {
            this.style.animation = 'gradientText 3s ease infinite, letterBounce 2s ease-in-out infinite';
        }, 500);
    });
});

// Redimensionner les canvas quand la fenêtre change de taille
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
});
