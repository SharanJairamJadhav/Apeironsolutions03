document.addEventListener('DOMContentLoaded', () => {

  /* =======================================
     PRELOADER
  ======================================= */
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.progress');

  // Simulate loading progress
  let loadProgress = 0;
  const interval = setInterval(() => {
    loadProgress += Math.random() * 20;
    if (loadProgress > 100) loadProgress = 100;
    if (progressBar) progressBar.style.width = `${loadProgress}%`;

    if (loadProgress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          // Trigger initial reveals immediately after load
          revealElements();
        }, 600);
      }, 300);
    }
  }, 100);


  /* =======================================
     CUSTOM CURSOR
  ======================================= */
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  const hoverElements = document.querySelectorAll('a, button, .hover-expand');

  // Only activate cursor logic if device supports hover (desktop)
  if (window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Cursor strictly follows mouse
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    // Smooth trailing effect for follower
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Add hover classes
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    // Hide custom cursor elements on touch devices
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
  }


  /* =======================================
     STICKY NAVIGATION & MOBILE MENU
  ======================================= */
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-menu .btn');

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    const isActive = mobileMenu.classList.contains('active');
    if (isActive) {
      mobileMenu.classList.remove('active');
      menuToggle.innerHTML = '<span class="line"></span><span class="line"></span>';
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('active');
      menuToggle.innerHTML = '<span class="line" style="transform: rotate(45deg) translate(2px, 2px);"></span><span class="line" style="transform: rotate(-45deg) translate(4px, -4px);"></span>';
      document.body.style.overflow = 'hidden';
    }
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuToggle.innerHTML = '<span class="line"></span><span class="line"></span>';
      document.body.style.overflow = '';
    });
  });


  /* =======================================
     INTERSECTION OBSERVER (ANIMATIONS)
  ======================================= */
  const revealElementsList = document.querySelectorAll('.reveal-up');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  const revealElements = () => {
    revealElementsList.forEach(el => {
      revealObserver.observe(el);
    });
  };

  // In case preloader is disabled or fails, trigger observer
  setTimeout(revealElements, 1000);


  /* =======================================
     FORM VALIDATION
  ======================================= */
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Client-side validation is handled natively via 'required' attributes.
      // Simulate API Call
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        formMsg.innerText = "Thank you! Your request has been received. We will contact you shortly.";
        formMsg.className = "form-msg success";
        contactForm.reset();
        btn.innerText = originalText;
        btn.disabled = false;

        // Clear message after 5 seconds
        setTimeout(() => {
          formMsg.innerText = "";
          formMsg.className = "form-msg";
        }, 5000);
      }, 1500);
    });
  }
});