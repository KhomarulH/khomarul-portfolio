/**
 * ===================================================================
 * DARK MINIMALIST PORTFOLIO - CORE SCRIPTS & INTERACTIONS
 * Features:
 * - Dynamic Typewriter with Scramble & Cursor Blink
 * - Cursor Spotlight Follower
 * - 3D Tilt Cards with Dynamic Specular Glare
 * - Project Category Filter & Detail Modal
 * - Scroll Reveal via IntersectionObserver & Skill Bar Fill
 * - Navbar Scroll Spy & Mobile Drawer
 * - One-Click Copy Email with Glassmorphic Toast
 * - Contact Form Handler with Feedback
 * - Accent Palette Theme Switcher (persisted via localStorage)
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
   * 1. CURSOR SPOTLIGHT TRACKER
   * ------------------------------------------------------------------ */
  const root = document.documentElement;
  window.addEventListener('pointermove', (e) => {
    root.style.setProperty('--mouse-x', `${e.clientX}px`);
    root.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  /* ------------------------------------------------------------------
   * 2. TYPEWRITER EFFECT
   * ------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriter-role');
  if (typewriterElement) {
    const roles = [
      'Full-Stack Developer',
      'Creative Technologist',
      'UI/UX Craftsman',
      'Modern Web Architect'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 95;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at full text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before next word
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  /* ------------------------------------------------------------------
   * 3. 3D TILT EFFECT FOR PROJECT CARDS & VISUAL CARDS
   * ------------------------------------------------------------------ */
  const tiltElements = document.querySelectorAll('.tilt-card');

  tiltElements.forEach(card => {
    // Inject glare element if missing
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt max +/- 8 degrees
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
      card.style.setProperty('--card-mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--card-mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  /* ------------------------------------------------------------------
   * 4. SCROLL REVEAL & SKILL PROGRESS BARS (IntersectionObserver)
   * ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const skillBars = document.querySelectorAll('.skill-fill');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animate skill progress bars when skills section is visible
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-level') || '85%';
          bar.style.width = targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  /* ------------------------------------------------------------------
   * 5. NAVBAR SCROLL SPY & MOBILE MENU
   * ------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksList = document.querySelector('.nav-links');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy active section
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('open');
      const isOpen = navLinksList.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        if (mobileToggle) mobileToggle.innerHTML = '☰';
      });
    });
  }

  /* ------------------------------------------------------------------
   * 6. PROJECT CATEGORY FILTER
   * ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ------------------------------------------------------------------
   * 7. PROJECT DETAILS MODAL
   * ------------------------------------------------------------------ */
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalTechList = document.getElementById('modal-tech-list');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalCodeLink = document.getElementById('modal-code-link');
  const detailButtons = document.querySelectorAll('.btn-details');

  // Sample detailed project data
  const projectData = {
    '1': {
      title: 'AetherAI - Enterprise Neural Analytics',
      category: 'Web App',
      description: 'Platform analitik berbasis kecerdasan buatan dengan visualisasi metrik real-time berkinerja tinggi, prediktif intelligence, serta arsitektur cloud serverless microservices. Dibangun dengan fokus pada kecepatan, keamanan enkripsi end-to-end, dan kemudahan kolaborasi multi-tenant.',
      tech: ['React 19', 'Next.js', 'TypeScript', 'TailwindCSS', 'Python FastAPI', 'PostgreSQL', 'Redis'],
      live: '#',
      code: '#'
    },
    '2': {
      title: 'Nexus DeFi - Multi-Chain Crypto Portal',
      category: 'Web App',
      description: 'Platform keuangan desentralisasi modern yang mengintegrasikan multi-chain liquidity aggregation, swap instan berbiaya rendah, tracking portofolio aset, dan visualisasi grafik candlestick real-time berbasis WebSockets.',
      tech: ['TypeScript', 'Vue 3', 'Web3.js', 'Ethers.js', 'TailwindCSS', 'Chart.js'],
      live: '#',
      code: '#'
    },
    '3': {
      title: 'Zenith Pulse - Mobile Health & Habit Tracker',
      category: 'Mobile',
      description: 'Aplikasi mobile cross-platform untuk pelacakan kesehatan holistik, metrik bio-ritme, sinkronisasi smartwatch cerdas, dan analisis kebiasaan harian dengan desain UI dark minimalist elegan.',
      tech: ['React Native', 'Expo', 'Redux Toolkit', 'Firebase', 'Node.js'],
      live: '#',
      code: '#'
    },
    '4': {
      title: 'Luminary Studio - Creative Design System',
      category: 'UI/UX',
      description: 'Sistem desain komprehensif tingkat enterprise untuk produk digital modern. Dilengkapi lebih dari 120+ token warna, komponen aksesibel WCAG 2.1 AAA, interaksi mikro 60fps, dan dokumentasi interaktif lengkap.',
      tech: ['Figma', 'Storybook', 'Design Tokens', 'Vanilla CSS', 'WCAG AAA'],
      live: '#',
      code: '#'
    },
    '5': {
      title: 'Synthetix Cloud - Developer Platform',
      category: 'Web App',
      description: 'Dashboard developer cloud-native untuk orchestrating edge container deployments, real-time log streaming, CI/CD pipeline visualizer, dan integrasi webhook terpusat.',
      tech: ['Golang', 'Docker', 'React', 'TailwindCSS', 'gRPC', 'PostgreSQL'],
      live: '#',
      code: '#'
    },
    '6': {
      title: 'Aura Sound - Ambient Audio Streaming App',
      category: 'Mobile',
      description: 'Aplikasi streaming audio spasial dan soundscape alami berdefinisi tinggi untuk fokus kerja, meditasi mendalam, dan kualitas tidur optimal dengan equalizer cerdas berbasis AI.',
      tech: ['Flutter', 'Dart', 'Audio DSP', 'Supabase', 'Bloc State'],
      live: '#',
      code: '#'
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const projectId = card.getAttribute('data-id');
      const data = projectData[projectId];

      if (data && modalOverlay) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDescription.textContent = data.description;

        modalTechList.innerHTML = '';
        data.tech.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = t;
          modalTechList.appendChild(span);
        });

        modalLiveLink.href = data.live;
        modalCodeLink.href = data.code;

        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  /* ------------------------------------------------------------------
   * 8. TOAST NOTIFICATIONS & COPY EMAIL
   * ------------------------------------------------------------------ */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, icon = '✓') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'hidayat.dev@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email disalin ke clipboard: ' + email, '📋');
      }).catch(() => {
        showToast('Gagal menyalin email otomatis', '⚠️');
      });
    });
  }

  /* ------------------------------------------------------------------
   * 9. CONTACT FORM HANDLER (FormSubmit AJAX Integration)
   * ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showToast('Harap lengkapi seluruh formulir!', '⚠️');
        return;
      }

      // Animated Loading Feedback
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Mengirim...</span>';
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://formsubmit.co/ajax/Khomarulhidayat9@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: subject ? `Portofolio: ${subject}` : `Pesan Baru Portofolio dari ${name}`,
            message: message,
            _captcha: "false",
            _template: "table"
          })
        });

        const data = await response.json();

        if (response.ok && (data.success === "true" || data.success === true || response.status === 200)) {
          contactForm.reset();
          showToast(`Terima kasih, ${name}! Pesan berhasil dikirim ke email saya.`, '🚀');
        } else {
          throw new Error(data.message || 'Gagal mengirim pesan');
        }
      } catch (err) {
        console.error('Contact Form Error:', err);
        showToast('Gagal mengirim pesan. Silakan hubungi via WhatsApp atau Email langsung.', '⚠️');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* ------------------------------------------------------------------
   * 10. ACCENT THEME SWITCHER
   * ------------------------------------------------------------------ */
  const colorDots = document.querySelectorAll('.color-dot');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'indigo';

  function applyTheme(themeName) {
    if (themeName === 'indigo') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', themeName);
    }

    colorDots.forEach(dot => {
      if (dot.getAttribute('data-theme') === themeName) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    localStorage.setItem('portfolio-theme', themeName);
  }

  applyTheme(savedTheme);

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      applyTheme(theme);
      showToast(`Tema aksen diubah ke ${theme.toUpperCase()}`, '🎨');
    });
  });

});
