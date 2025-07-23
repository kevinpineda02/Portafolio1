// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menú móvil
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Cambiar estilo de navbar al hacer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(1, 3, 38, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(163, 5, 166, 0.4)';
    } else {
        navbar.style.background = 'rgba(1, 3, 38, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(163, 5, 166, 0.3)';
    }
});

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de aparición al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a elementos
const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .contact-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Efecto de escritura en el título principal
const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.innerHTML += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Iniciar después de un pequeño delay
    setTimeout(typeWriter, 500);
}

// Formulario de contacto
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Enviar datos al backend
        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('¡Mensaje enviado correctamente! Te contactaré pronto.', 'success');
                this.reset();
            } else {
                showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        });
    });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#660273' : type === 'error' ? '#A305A6' : '#2D0140'};
        color: #E8D5F0;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(163, 5, 166, 0.3);
        border: 1px solid rgba(163, 5, 166, 0.5);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Manejar cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Efecto parallax sutil en hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Contador animado para estadísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace('+', ''));
        const count = +counter.innerText;
        const inc = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + inc) + '+';
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target + '+';
        }
    });
}

// Iniciar contador cuando la sección sea visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Efecto hover para tarjetas de proyecto
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading para imágenes (si las tienes)
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Actualizar año en footer automáticamente
const yearElement = document.querySelector('.footer p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
}

// Detectar modo oscuro del sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // El usuario prefiere modo oscuro
    console.log('Modo oscuro detectado - Tema espacial ya aplicado');
}

// Efectos especiales para el tema espacial
function addSpaceEffects() {
    // Agregar efecto de partículas en el hero
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #A305A6;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: twinkle ${2 + Math.random() * 3}s infinite;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            hero.appendChild(star);
        }
    }
}

// Añadir keyframe para el efecto twinkle
const twinkeStyle = document.createElement('style');
twinkeStyle.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
`;
document.head.appendChild(twinkeStyle);

// Ejecutar efectos cuando la página cargue
window.addEventListener('load', () => {
    addSpaceEffects();
    
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Mejorar el efecto de hover en las tarjetas
const allCards = document.querySelectorAll('.project-card, .skill-category, .stat');
allCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 30px rgba(163, 5, 166, 0.4)';
        this.style.borderColor = 'rgba(163, 5, 166, 0.6)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
        this.style.borderColor = '';
    });
});

// Función para copiar email al portapapeles
function copyEmail() {
    const email = 'kevin@ejemplo.com';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copiado al portapapeles', 'success');
    }).catch(err => {
        console.error('Error al copiar:', err);
        showNotification('No se pudo copiar el email', 'error');
    });
}

// Añadir evento click al email en contacto
const emailElement = document.querySelector('.contact-item:first-child span');
if (emailElement) {
    emailElement.style.cursor = 'pointer';
    emailElement.addEventListener('click', copyEmail);
    emailElement.title = 'Click para copiar email';
}

// Validación en tiempo real del formulario
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remover estilos de error previos
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validaciones específicas
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError(field, 'Por favor ingresa un email válido');
                isValid = false;
            }
            break;
        case 'text':
            if (field.required && !value) {
                showFieldError(field, 'Este campo es requerido');
                isValid = false;
            }
            break;
        default:
            if (field.required && !value) {
                showFieldError(field, 'Este campo es requerido');
                isValid = false;
            }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #A305A6;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    field.parentNode.appendChild(errorDiv);
    
    // Añadir estilos de error al campo
    field.style.borderColor = '#A305A6';
}

// CSS para campo con error
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #A305A6 !important;
        background-color: rgba(163, 5, 166, 0.1) !important;
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus {
        border-color: #A305A6 !important;
        box-shadow: 0 0 10px rgba(163, 5, 166, 0.3) !important;
    }
`;
document.head.appendChild(style);