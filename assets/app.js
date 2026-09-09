/* =========================================================
   Akash Bhattacharya — Portfolio interactions
   Theme toggle, typed hero role, scroll-spy, animated stats,
   visit counter, command palette, copy-to-clipboard,
   konami-code easter egg, printable résumé.
   ========================================================= */
(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- Theme selection ---------------- */
  const root = document.documentElement;
  const themeSelect = document.getElementById('themeSelect');
  const themes = ['light', 'dark', 'forest', 'ocean', 'rose'];

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeSelect.value = theme;
  }
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  themeSelect.addEventListener('change', function () {
    applyTheme(themeSelect.value);
    localStorage.setItem('theme', themeSelect.value);
  });

  function cycleTheme() {
    const current = root.getAttribute('data-theme');
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    applyTheme(next);
    localStorage.setItem('theme', next);
    showToast(`Theme changed to ${themeSelect.options[themeSelect.selectedIndex].text}`);
  }

  /* ---------------- Mobile menu ---------------- */
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('open');
    document.body.classList.add('sidebar-locked');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('open');
    document.body.classList.remove('sidebar-locked');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  sidebarBackdrop.addEventListener('click', closeSidebar);
  document.querySelectorAll('.side-nav a').forEach(a =>
    a.addEventListener('click', closeSidebar)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
  });
  // Collapsing back to desktop width while the mobile menu is open would
  // otherwise leave the backdrop/scroll-lock stuck on.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && sidebar.classList.contains('open')) closeSidebar();
  });

  /* ---------------- Scroll progress bar ---------------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = (scrolled || 0) + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------------- Scroll-spy nav + section reveal ---------------- */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.side-nav a');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });
  sections.forEach(s => revealObserver.observe(s));

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.side-nav a[data-section="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spyObserver.observe(s));

  /* ---------------- Typed hero role ---------------- */
  const roles = [
    '.NET Core Backend Engineer',
    'Enterprise AI Solutions Architect',
    'Agentic AI Systems Builder',
    'Microsoft Azure Specialist',
    'Senior Associate · PwC India'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------------- Animated stat counters ---------------- */
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current = Math.min(target, current + step);
        el.textContent = current + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  /* ---------------- Terminal "whoami" typewriter ---------------- */
  const terminalLines = [
    '> whoami',
    'Akash Bhattacharya',
    'Senior Associate – Technology @ PwC India',
    '',
    '> cat focus.txt',
    '.NET Core · C# · SQL Server', 'Python',
    'Microsoft Azure · Microsoft Graph API',
    'Agentic AI · MCP · RAG pipelines',
    '',
    '> echo $STATUS',
    'Open to solving problems and delivering value ✔'
  ];
  const terminalBody = document.getElementById('terminalBody');
  let tLine = 0, tChar = 0;
  function typeTerminal() {
    if (tLine >= terminalLines.length) return;
    const line = terminalLines[tLine];
    tChar++;
    terminalBody.textContent = terminalLines.slice(0, tLine).join('\n') +
      (tLine > 0 ? '\n' : '') + line.slice(0, tChar);
    if (tChar >= line.length) {
      tLine++; tChar = 0;
      setTimeout(typeTerminal, 220);
    } else {
      setTimeout(typeTerminal, 18);
    }
  }
  const terminalObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { typeTerminal(); obs.disconnect(); }
    });
  }, { threshold: 0.4 });
  terminalObserver.observe(document.getElementById('terminalCard'));

  /* ---------------- Live IST clock ---------------- */
  const istClock = document.getElementById('istClock');
  function updateClock() {
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hh = String(ist.getHours()).padStart(2, '0');
    const mm = String(ist.getMinutes()).padStart(2, '0');
    const ss = String(ist.getSeconds()).padStart(2, '0');
    istClock.textContent = `${hh}:${mm}:${ss}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------------- Toasts ---------------- */
  function showToast(msg) {
    const stack = document.getElementById('toastStack');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  /* ---------------- Copy to clipboard chips ---------------- */
  document.querySelectorAll('.copy-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const value = chip.dataset.copy;
      navigator.clipboard?.writeText(value).then(() => {
        showToast(`Copied "${value}" to clipboard`);
      }).catch(() => showToast('Could not copy — try selecting manually'));
    });
  });

  /* ---------------- Back to top ---------------- */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Download résumé (print view) ---------------- */
  document.getElementById('downloadResumeBtn').addEventListener('click', () => {
    showToast('Opening print dialog — choose "Save as PDF"');
    setTimeout(() => window.print(), 300);
  });

  /* ---------------- Command palette (Ctrl/Cmd+K or "/") ---------------- */
  const cmdkOverlay = document.getElementById('cmdkOverlay');
  const cmdkInput = document.getElementById('cmdkInput');
  const cmdkList = document.getElementById('cmdkList');
  const cmdkTrigger = document.getElementById('cmdkTrigger');

  const commands = [
    { label: 'Home', hint: 'go', action: () => scrollToId('home') },
    { label: 'About', hint: 'go', action: () => scrollToId('about') },
    { label: 'Skills', hint: 'go', action: () => scrollToId('skills') },
    { label: 'Experience', hint: 'go', action: () => scrollToId('experience') },
    { label: 'Projects', hint: 'go', action: () => scrollToId('projects') },
    { label: 'Education', hint: 'go', action: () => scrollToId('education') },
    { label: 'Certifications', hint: 'go', action: () => scrollToId('certifications') },
    { label: 'Contact', hint: 'go', action: () => scrollToId('contact') },
    { label: 'Switch to the next theme', hint: 'action', action: cycleTheme },
    { label: 'Copy email address', hint: 'action', action: () => document.querySelector('.copy-chip[data-copy^="akash"]').click() },
    { label: 'Download résumé (PDF)', hint: 'action', action: () => document.getElementById('downloadResumeBtn').click() },
    { label: 'Open LinkedIn', hint: 'link', action: () => window.open('https://linkedin.com/in/akashbhatt1207', '_blank') },
    { label: 'Email Akash', hint: 'link', action: () => window.location.href = 'mailto:akash.12.7.00@gmail.com' },
  ];

  function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

  let activeIndex = 0, filtered = commands;

  function renderList() {
    cmdkList.innerHTML = '';
    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.textContent = cmd.label;
      const hint = document.createElement('span');
      hint.style.opacity = '0.5';
      hint.style.fontSize = '0.72rem';
      hint.textContent = cmd.hint;
      li.appendChild(hint);
      if (i === activeIndex) li.classList.add('active');
      li.addEventListener('click', () => runCommand(cmd));
      cmdkList.appendChild(li);
    });
  }

  function runCommand(cmd) {
    closeCmdk();
    cmd.action();
  }

  function openCmdk() {
    cmdkOverlay.classList.add('open');
    cmdkInput.value = '';
    filtered = commands;
    activeIndex = 0;
    renderList();
    setTimeout(() => cmdkInput.focus(), 30);
  }
  function closeCmdk() {
    cmdkOverlay.classList.remove('open');
  }

  cmdkTrigger.addEventListener('click', openCmdk);
  cmdkOverlay.addEventListener('click', (e) => { if (e.target === cmdkOverlay) closeCmdk(); });

  cmdkInput.addEventListener('input', () => {
    const q = cmdkInput.value.toLowerCase();
    filtered = commands.filter(c => c.label.toLowerCase().includes(q));
    activeIndex = 0;
    renderList();
  });

  document.addEventListener('keydown', (e) => {
    const isOpen = cmdkOverlay.classList.contains('open');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen ? closeCmdk() : openCmdk();
      return;
    }
    if (e.key === '/' && !isOpen && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openCmdk();
      return;
    }
    if (!isOpen) return;
    if (e.key === 'Escape') closeCmdk();
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(filtered.length - 1, activeIndex + 1); renderList(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(0, activeIndex - 1); renderList(); }
    if (e.key === 'Enter' && filtered[activeIndex]) { runCommand(filtered[activeIndex]); }
  });

  /* ---------------- Visit counter (backend-powered) ---------------- */
  const visitCountEl = document.getElementById('visitCount');
  fetch('/api/visits', { method: 'POST' })
    .then(r => r.json())
    .then(data => {
      animateCount(visitCountEl, data.count);
    })
    .catch(() => { visitCountEl.textContent = '—'; });

  function animateCount(el, target) {
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    (function tick() {
      current = Math.min(target, current + step);
      el.textContent = current.toLocaleString();
      if (current < target) requestAnimationFrame(tick);
    })();
  }

  /* ---------------- Konami code easter egg ---------------- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiProgress = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[konamiProgress]) {
      konamiProgress++;
      if (konamiProgress === konami.length) {
        konamiProgress = 0;
        launchConfetti();
        showToast('🎉 Easter egg found! Let\'s build something great together.');
      }
    } else {
      konamiProgress = (key === konami[0]) ? 1 : 0;
    }
  });

  function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const colors = ['#ff5b2e', '#ffbd2e', '#27c93f', '#4d9dff', '#f2f1ec'];
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      r: 4 + Math.random() * 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: -2 + Math.random() * 4,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12
    }));
    let frames = 0;
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      });
      frames++;
      if (frames < 180) {
        requestAnimationFrame(frame);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    frame();
  }
})();
