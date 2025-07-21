document.addEventListener("DOMContentLoaded", function() {
    // Theme toggling
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
    }
  
    themeToggle.addEventListener("click", function() {
      body.classList.toggle("dark-mode");
      // Save theme preference
      localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    });
  
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70, // Account for header height
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Intersection Observer for section reveal on scroll
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.15 // 15% of the section must be visible
    };
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        // For gallery items, add loaded class to parent
        if (this.parentElement.classList.contains('gallery-item')) {
          this.parentElement.classList.add('loaded');
        }
      });
      
      // For already loaded images
      if (img.complete) {
        img.classList.add('loaded');
        if (img.parentElement.classList.contains('gallery-item')) {
          img.parentElement.classList.add('loaded');
        }
      }
    });
  
    // Header behavior on scroll
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('sticky');
        // Always show header, never hide
        header.classList.remove('hide-header');
      } else {
        header.classList.remove('sticky');
        header.classList.remove('hide-header');
      }
      
      lastScrollTop = scrollTop;
    });
  
    // === Event Tracking (Clicks and Views Logging) ===
    function getElementType(element) {
      if (element.tagName === 'IMG') return 'image';
      if (element.tagName === 'SELECT') return 'drop-down';
      if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') return 'text';
      if (element.tagName === 'BUTTON') return 'button';
      if (element.tagName === 'A') return 'link';
      if (element.tagName === 'SECTION') return 'section';
      return 'other';
    }
  
    function logEvent(eventType, element) {
      const timestamp = new Date().toISOString();
      const objectType = getElementType(element);
      console.log(`${timestamp} , ${eventType} , ${objectType}`);
    }
  
    document.addEventListener('click', function(e) {
      const target = e.target;
      logEvent('click', target);
    });
  
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent('view', entry.target);
        }
      });
    }, {
      threshold: 0.5
    });
  
    document.querySelectorAll('section, img, input, textarea, select, button, a').forEach(element => {
      viewObserver.observe(element);
    });

  // Sidebar toggle logic (moved inside DOMContentLoaded)
  const sidebar = document.getElementById('sidebar');
  const logo = document.getElementById('logo');
  const closeBtn = document.querySelector('#sidebar .close-btn');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Collapse both Now and Ideas cards
    const nowCard = document.getElementById('now-card');
    const ideasCard = document.getElementById('ideas-card');
    if (nowCard) nowCard.classList.remove('expanded');
    if (ideasCard) ideasCard.classList.remove('expanded');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (logo) {
    logo.addEventListener('click', function() {
      console.log('Logo clicked');
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
        console.log('Sidebar opened');
      }
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
  
  // Sidebar expand/collapse logic for Now and Ideas cards
  sidebar.addEventListener('click', function(e) {
    const toggleBtn = e.target.closest('.sidebar-toggle');
    if (toggleBtn) {
      e.stopPropagation();
      console.log('Sidebar arrow clicked');
      const card = toggleBtn.closest('.sidebar-card');
      if (card && (card.id === 'now-card' || card.id === 'ideas-card')) {
        card.classList.toggle('expanded');
      }
    }
  });

  // Fallback: add direct click handler to all sidebar-toggle buttons
  document.querySelectorAll('.sidebar-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = btn.closest('.sidebar-card');
      if (card && (card.id === 'now-card' || card.id === 'ideas-card')) {
        card.classList.toggle('expanded');
      }
    });
  });

  // Progress bar below navbar: always white
  let progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }
  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.style.background = '#fff';
  }
  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('DOMContentLoaded', updateProgressBar);
  updateProgressBar();
  });
  