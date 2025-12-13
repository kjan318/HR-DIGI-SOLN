/**
 * Script content consolidated from templatemo-glossy-touch.js.
 * Provides interactive effects: parallax, scroll, and click ripple.
 */

// Add interactive parallax effect to background shapes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        // Adjust speed for subtle effect
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        
        // Use a persistent style transformation (original template used shape.style.transform which is fine)
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

// Add scroll-based animations (Parallax effect)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.bg-shapes');
    const speed = scrolled * 0.5;
    if (parallax) {
        // Apply parallax shift
        parallax.style.transform = `translateY(${speed}px)`;
    }
});


// Add click ripple effect to glass elements
document.querySelectorAll('.glass').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            /* Animation keyframes are now defined in theme_setup.css */
            animation: ripple 0.6s linear; 
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Ensure position is relative for absolute children (like the ripple)
        this.style.position = 'relative'; 
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});