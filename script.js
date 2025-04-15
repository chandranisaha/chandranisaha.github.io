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
        if (scrollTop > lastScrollTop && scrollTop > 300) {
          // Scrolling down past hero section
          header.classList.add('hide-header');
        } else {
          // Scrolling up
          header.classList.remove('hide-header');
        }
      } else {
        header.classList.remove('sticky');
        header.classList.remove('hide-header');
      }
      
      lastScrollTop = scrollTop;
    });
  
    // Text analyzer functionality
    const textInput = document.getElementById("text-input");
    const textStats = document.getElementById("text-stats");
    const analyzeBtn = document.getElementById("analyze-btn");
  
    analyzeBtn.addEventListener("click", function() {
      analyzeText();
    });
  
    function analyzeText() {
      const text = textInput.value.trim();
      
      if (!text) {
        textStats.innerHTML = "<p>Please enter some text to analyze.</p>";
        return;
      }
  
      // Count words
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      
      // Count characters (with and without spaces)
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s+/g, "").length;
      
      // Count sentences
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      const sentenceCount = sentences.length;
      
      // Count paragraphs
      const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
      const paragraphCount = paragraphs.length;
      
      // Calculate reading time (average reading speed: 200 words per minute)
      const readingTimeMinutes = Math.ceil(wordCount / 200);
      
      // Find longest and shortest words
      let longestWord = "";
      let shortestWord = "";
      
      words.forEach(word => {
        // Remove punctuation when comparing word lengths
        const cleanWord = word.replace(/[^\w]/g, "");
        if (cleanWord.length > 0) {
          if (!shortestWord || cleanWord.length < shortestWord.length) {
            shortestWord = cleanWord;
          }
          if (cleanWord.length > longestWord.length) {
            longestWord = cleanWord;
          }
        }
      });
      
      // Create word frequency map
      const wordFrequency = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
        if (cleanWord.length > 0) {
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      });
      
      // Find most common words (top 5)
      const commonWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      // Calculate average sentence length
      const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;
      
      // Generate HTML for stats
      textStats.innerHTML = `
        <div class="stats-grid">
          <div class="stat-item">
            <h3>Word Count</h3>
            <p>${wordCount}</p>
          </div>
          <div class="stat-item">
            <h3>Character Count</h3>
            <p>${charCount} (${charCountNoSpaces} without spaces)</p>
          </div>
          <div class="stat-item">
            <h3>Sentence Count</h3>
            <p>${sentenceCount}</p>
          </div>
          <div class="stat-item">
            <h3>Paragraph Count</h3>
            <p>${paragraphCount}</p>
          </div>
          <div class="stat-item">
            <h3>Average Sentence Length</h3>
            <p>${avgWordsPerSentence} words</p>
          </div>
          <div class="stat-item">
            <h3>Estimated Reading Time</h3>
            <p>${readingTimeMinutes} minute${readingTimeMinutes !== 1 ? 's' : ''}</p>
          </div>
          <div class="stat-item">
            <h3>Longest Word</h3>
            <p>${longestWord} (${longestWord.length} characters)</p>
          </div>
          <div class="stat-item">
            <h3>Shortest Word</h3>
            <p>${shortestWord} (${shortestWord.length} characters)</p>
          </div>
          <div class="stat-item">
            <h3>Most Common Words</h3>
            <ul>
              ${commonWords.map(([word, count]) => `<li>${word}: ${count} time${count !== 1 ? 's' : ''}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  });