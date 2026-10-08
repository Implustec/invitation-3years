// Cuenta regresiva para la fecha del evento (18 de Julio, 2026)
const eventDate = new Date("July 18, 2026 12:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Notificaciones Toast
function showToast(iconClass, message) {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");
    const toastIcon = document.getElementById("toastIcon");

    toastIcon.className = `fa-solid ${iconClass} text-pink-600`;
    toastText.innerText = message;

    toast.classList.add("show");
    setTimeout(function(){ 
        toast.classList.remove("show");
    }, 3000);
}

// Control de música ambiental simulada
let isPlaying = false;
function toggleMusic() {
    isPlaying = !isPlaying;
    const icon = document.getElementById("musicIcon");
    if (isPlaying) {
        icon.className = "fa-solid fa-volume-high text-xl";
        showToast("fa-volume-high", "Música de cajita mágica activada.");
    } else {
        icon.className = "fa-solid fa-music text-xl";
        showToast("fa-music", "Música ambiental en pausa.");
    }
}

// Manejo del formulario RSVP
function handleRSVP(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const asistentes = document.getElementById("asistentes").value;

    const textElement = document.getElementById("successMessageText");
    textElement.innerHTML = `¡Qué emoción <strong>${nombre}</strong>! Tus <strong>${asistentes} lugares</strong> están confirmados. ¡Sofía y su familia están felices de celebrar este día contigo!`;

    document.getElementById("rsvpForm").style.display = "none";
    document.getElementById("successCard").style.display = "block";
    
    showToast("fa-circle-check", "¡Asistencia confirmada con éxito!");
}

function resetForm() {
    document.getElementById("rsvpForm").reset();
    document.getElementById("successCard").style.display = "none";
    document.getElementById("rsvpForm").style.display = "block";
    showToast("fa-rotate-right", "Puedes actualizar tus datos.");
}

// ==========================================
// DINAMISMO DE FONDO (CANVAS MÁGICO)
// ==========================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.color = Math.random() > 0.4 ? '#f472b6' : '#d4af37'; // Tonos rosas y dorados
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Conexiones estéticas entre partículas doradas/rosas cercanas
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                ctx.strokeStyle = `rgba(244, 114, 182, ${0.08 * (1 - distance/110)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateBackground);
}
animateBackground();