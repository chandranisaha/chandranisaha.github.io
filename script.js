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
  
    // Enhanced Text analyzer functionality
    const textInput = document.getElementById("text-input");
    const textStats = document.getElementById("text-stats");
    const analyzeBtn = document.getElementById("analyze-btn");
  
    analyzeBtn.addEventListener("click", function() {
      analyzeText();
    });
  
    function analyzeText() {
      const text = textInput.value;
      
      if (!text) {
        textStats.innerHTML = "<p>Please enter some text to analyze.</p>";
        return;
      }
      
      const trimmedText = text.trim();
      const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s+/g, "").length;
      const sentences = trimmedText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      const sentenceCount = sentences.length;
      const paragraphs = trimmedText.split(/\n\s*\n/).filter(para => para.trim().length > 0);
      const paragraphCount = paragraphs.length;
      const readingTimeMinutes = Math.ceil(wordCount / 200);
  
      let longestWord = "";
      let shortestWord = "";
  
      words.forEach(word => {
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
  
      const wordFrequency = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
        if (cleanWord.length > 0) {
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      });
  
      const commonWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
  
      const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;
  
      const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
      const spaceCount = (text.match(/\s/g) || []).length;
      const newlineCount = (text.match(/\n/g) || []).length;
      const specialSymbolCount = (text.match(/[^\w\s]/g) || []).length;
  
      const pronouns = [
        "i", "me", "my", "mine", "myself", "you", "your", "yours", "yourself", "yourselves",
        "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
        "we", "us", "our", "ours", "ourselves", "they", "them", "their", "theirs", "themselves",
        "this", "that", "these", "those", "who", "whom", "whose", "which", "what"
      ];
      const pronounCounts = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]|_/g, "");
        if (pronouns.includes(cleanWord)) {
          pronounCounts[cleanWord] = (pronounCounts[cleanWord] || 0) + 1;
        }
      });
  
      const prepositions = [
        "about", "above", "across", "after", "against", "along", "amid", "among", "around", "at",
        "before", "behind", "below", "beneath", "beside", "between", "beyond", "by", "concerning",
        "considering", "despite", "down", "during", "except", "for", "from", "in", "inside", "into",
        "like", "near", "of", "off", "on", "onto", "out", "outside", "over", "past", "regarding",
        "round", "since", "through", "throughout", "to", "toward", "towards", "under", "underneath",
        "until", "unto", "up", "upon", "with", "within", "without"
      ];
      const prepositionCounts = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]|_/g, "");
        if (prepositions.includes(cleanWord)) {
          prepositionCounts[cleanWord] = (prepositionCounts[cleanWord] || 0) + 1;
        }
      });
  
      const indefiniteArticles = ["a", "an"];
      const articleCounts = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]|_/g, "");
        if (indefiniteArticles.includes(cleanWord)) {
          articleCounts[cleanWord] = (articleCounts[cleanWord] || 0) + 1;
        }
      });
  
      textStats.innerHTML = `
        <div class="stats-section">
          <h2>Basic Text Statistics</h2>
          <div class="stats-grid">
            <div class="stat-item"><h3>Word Count</h3><p>${wordCount}</p></div>
            <div class="stat-item"><h3>Character Count</h3><p>${charCount} (${charCountNoSpaces} without spaces)</p></div>
            <div class="stat-item"><h3>Sentence Count</h3><p>${sentenceCount}</p></div>
            <div class="stat-item"><h3>Paragraph Count</h3><p>${paragraphCount}</p></div>
            <div class="stat-item"><h3>Average Sentence Length</h3><p>${avgWordsPerSentence} words</p></div>
            <div class="stat-item"><h3>Estimated Reading Time</h3><p>${readingTimeMinutes} minute${readingTimeMinutes !== 1 ? 's' : ''}</p></div>
            <div class="stat-item"><h3>Longest Word</h3><p>${longestWord} (${longestWord.length} characters)</p></div>
            <div class="stat-item"><h3>Shortest Word</h3><p>${shortestWord} (${shortestWord.length} characters)</p></div>
            <div class="stat-item"><h3>Most Common Words</h3><ul>${commonWords.map(([word, count]) => `<li>${word}: ${count} time${count !== 1 ? 's' : ''}</li>`).join('')}</ul></div>
          </div>
        </div>
  
        <div class="stats-section">
          <h2>Character Analysis</h2>
          <div class="stats-grid">
            <div class="stat-item"><h3>Letters</h3><p>${letterCount}</p></div>
            <div class="stat-item"><h3>Spaces</h3><p>${spaceCount}</p></div>
            <div class="stat-item"><h3>Newlines</h3><p>${newlineCount}</p></div>
            <div class="stat-item"><h3>Special Symbols</h3><p>${specialSymbolCount}</p></div>
          </div>
        </div>
  
        <div class="stats-section">
          <h2>Pronoun Analysis</h2>
          <table class="analysis-table"><thead><tr><th>Pronoun</th><th>Count</th></tr></thead><tbody>
          ${Object.entries(pronounCounts).length > 0 ? 
            Object.entries(pronounCounts).sort((a, b) => b[1] - a[1]).map(([p, c]) => `<tr><td>${p}</td><td>${c}</td></tr>`).join('') :
            `<tr><td colspan="2">No pronouns found</td></tr>`}
          </tbody></table>
        </div>
  
        <div class="stats-section">
          <h2>Preposition Analysis</h2>
          <table class="analysis-table"><thead><tr><th>Preposition</th><th>Count</th></tr></thead><tbody>
          ${Object.entries(prepositionCounts).length > 0 ? 
            Object.entries(prepositionCounts).sort((a, b) => b[1] - a[1]).map(([p, c]) => `<tr><td>${p}</td><td>${c}</td></tr>`).join('') :
            `<tr><td colspan="2">No prepositions found</td></tr>`}
          </tbody></table>
        </div>
  
        <div class="stats-section">
          <h2>Indefinite Article Analysis</h2>
          <table class="analysis-table"><thead><tr><th>Article</th><th>Count</th></tr></thead><tbody>
          ${Object.entries(articleCounts).length > 0 ? 
            Object.entries(articleCounts).sort((a, b) => b[1] - a[1]).map(([a, c]) => `<tr><td>${a}</td><td>${c}</td></tr>`).join('') :
            `<tr><td colspan="2">No indefinite articles found</td></tr>`}
          </tbody></table>
        </div>
      `;
    }
  
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
  });
  