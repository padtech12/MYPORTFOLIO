


// =========================
// Enhanced Smooth Scroll with Offset
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});




// =========================
// Enhanced Skills Progress Animation
// =========================
class SkillAnimator {
  constructor() {
    this.bars = document.querySelectorAll('#sub-skills .skill-progress');
    this.init();
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  animateBar(bar) {
    const target = parseInt(bar.dataset.skill || 0, 10);
    const label = bar.querySelector('.skill-label');
    const duration = 600;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = this.easeOutCubic(t);
      const current = Math.round(eased * target);

      bar.style.width = current + '%';
      if (label) label.textContent = current + '%';

      if (t < 1) {
        bar.style.boxShadow = `0 0 ${8 + current/8}px rgba(96, 165, 250, 0.6)`;
        requestAnimationFrame(tick);
      } else {
        bar.style.boxShadow = '0 0 12px rgba(96, 165, 250, 0.4)';
      }
    };
    requestAnimationFrame(tick);
  }

  init() {
    if (!this.bars.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(this.bars).indexOf(entry.target);
            // Faster on mobile, slower on desktop
            const delay = window.innerWidth <= 768 ? index * 50 : index * 80;
            setTimeout(() => {
              this.animateBar(entry.target);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      this.bars.forEach(bar => observer.observe(bar));
    }
  }
}

// Initialize skill animator
document.addEventListener('DOMContentLoaded', () => {
  new SkillAnimator();
});



// =========================
// Enhanced Project Modals with Animation
// =========================
class ModalManager {
  constructor() {
    this.init();
  }

  init() {
    // Open modal buttons
    document.querySelectorAll('.open-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.dataset.modal;
        this.openModal(modalId);
      });
    });

    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        this.closeModal(modal);
      });
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target);
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) this.closeModal(openModal);
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = 'block';
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';
    
    // Animate in
    requestAnimationFrame(() => {
      modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    if (!modal) return;

    modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';

    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

// Initialize modal manager
new ModalManager();



// =========================
// Enhanced Back to Top Button
// =========================
class BackToTopButton {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    if (!this.button) return;

    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 500;
      this.button.style.opacity = scrolled ? '1' : '0';
      this.button.style.visibility = scrolled ? 'visible' : 'hidden';
      this.button.style.transform = scrolled ? 'translateY(0)' : 'translateY(20px)';
    });

    // Smooth scroll to top
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Add click animation
      this.button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.button.style.transform = 'scale(1)';
      }, 150);
    });
  }
}

// Initialize back to top button
new BackToTopButton();



// =========================
// Advanced Scroll Animations
// =========================
class ScrollAnimator {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger delay
          setTimeout(() => {
            entry.target.classList.add('visible', entry.target.dataset.animate);
          }, index * 100);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// Initialize scroll animator
new ScrollAnimator();

// =========================
// Particle Background Effect
// =========================
class ParticleBackground {
  constructor() {
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.init();
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.6';
    document.body.appendChild(canvas);
    return canvas;
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        particle.x -= dx * 0.01;
        particle.y -= dy * 0.01;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(96, 165, 250, ${particle.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle background (only on desktop for performance)
if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new ParticleBackground();
}

// =========================
// Performance Optimizations
// =========================

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', 'none');
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.removeAttribute('data-aos');
    el.removeAttribute('data-aos-delay');
  });
}

console.log('🚀 Portfolio loaded successfully! Welcome to Emmanuel\'s advanced portfolio.');



// =========================
// Enhanced Typing Animation
// =========================
class TypeWriter {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.speed = options.speed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.pauseTime = options.pauseTime || 2000;
    this.currentWordIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    
    this.init();
  }

  init() {
    if (!this.element) return;
    this.type();
  }

  type() {
    const currentWord = this.words[this.currentWordIndex];
    
    if (this.isPaused) {
      setTimeout(() => {
        this.isPaused = false;
        this.isDeleting = true;
        this.type();
      }, this.pauseTime);
      return;
    }

    if (!this.isDeleting) {
      // Typing
      this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
      
      if (this.currentCharIndex === currentWord.length) {
        this.isPaused = true;
      }
      
      setTimeout(() => this.type(), this.speed + Math.random() * 50);
    } else {
      // Deleting
      this.element.textContent = currentWord.substring(0, this.currentCharIndex);
      this.currentCharIndex--;
      
      if (this.currentCharIndex < 0) {
        this.isDeleting = false;
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        setTimeout(() => this.type(), 200);
      } else {
        setTimeout(() => this.type(), this.deleteSpeed);
      }
    }
  }
}

// Initialize typing animation
const typingElement = document.getElementById("typing");
if (typingElement) {
  const roles = [
    "Cybersecurity Expert",
    "Web Developer", 
    "Prompt Engineer",
    "Graphic Designer",
    "Tech Innovator"
  ];
  
  new TypeWriter(typingElement, roles, {
    speed: 100,
    deleteSpeed: 50,
    pauseTime: 2000
  });
}




