/**
 * EL QUILOMBO CECSyTS - UNMdP
 * Main Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCareerTabs();
  initResourceFilter();
  initGpaCalculator();
  initClaimGenerator();
  initFaqAccordion();
});

/* ==========================================================================
   NAVBAR & SCROLL HANDLING
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy active state
    const scrollPos = window.scrollY + 200;
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.classList.remove('ph-list');
          icon.classList.add('ph-x');
        } else {
          icon.classList.remove('ph-x');
          icon.classList.add('ph-list');
        }
      }
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('ph-x');
          icon.classList.add('ph-list');
        }
      });
    });
  }
}

/* ==========================================================================
   CAREER TABS SWITCHING
   ========================================================================== */
function initCareerTabs() {
  const tabBtns = document.querySelectorAll('.career-tab-btn');
  const panels = document.querySelectorAll('.career-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`career-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   RESOURCE HUB SEARCH & FILTER
   ========================================================================== */
function initResourceFilter() {
  const searchInput = document.getElementById('resourceSearch');
  const filterPills = document.querySelectorAll('.filter-pill-btn');
  const cards = document.querySelectorAll('.resource-card');
  const countEl = document.getElementById('resourceCount');

  let currentCategory = 'all';
  let currentSearch = '';

  function filterCards() {
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.dataset.category || '';
      const text = (card.innerText || '').toLowerCase();

      const matchesCat = currentCategory === 'all' || category.includes(currentCategory);
      const matchesSearch = currentSearch === '' || text.includes(currentSearch);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) {
      countEl.innerText = `${visibleCount} recursos encontrados`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.filter || 'all';
      filterCards();
    });
  });
}

/* ==========================================================================
   GPA / PROMEDIO UNIVERSITARIO CALCULATOR
   ========================================================================== */
function initGpaCalculator() {
  const subjectInput = document.getElementById('calcSubject');
  const scoreInput = document.getElementById('calcScore');
  const addBtn = document.getElementById('calcAddBtn');
  const gradesList = document.getElementById('gradesList');
  const avgTotalEl = document.getElementById('avgTotal');
  const avgNoFailEl = document.getElementById('avgNoFail');
  const totalCountEl = document.getElementById('totalSubjects');
  const clearBtn = document.getElementById('calcClearBtn');

  // Pre-seed with sample subjects to give instant usefulness
  let grades = [
    { name: 'Salud Pública I', score: 8 },
    { name: 'Anatomofisiología', score: 9 },
    { name: 'Introducción a la Carrera', score: 7 }
  ];

  function renderGrades() {
    if (!gradesList) return;
    gradesList.innerHTML = '';

    if (grades.length === 0) {
      gradesList.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--text-dim); font-size:0.9rem;">No cargaste materias todavía. ¡Agregá tus notas arriba!</div>';
      if (avgTotalEl) avgTotalEl.innerText = '0.00';
      if (avgNoFailEl) avgNoFailEl.innerText = '0.00';
      if (totalCountEl) totalCountEl.innerText = '0';
      return;
    }

    let sumTotal = 0;
    let sumPassing = 0;
    let passingCount = 0;

    grades.forEach((item, index) => {
      sumTotal += item.score;
      if (item.score >= 4) {
        sumPassing += item.score;
        passingCount++;
      }

      const row = document.createElement('div');
      row.className = 'grade-row-item';
      row.innerHTML = `
        <span class="grade-row-subject">${escapeHtml(item.name)}</span>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span class="grade-row-score" style="color: ${item.score >= 4 ? '#34d399' : '#f87171'}">${item.score.toFixed(1)}</span>
          <button class="grade-delete-btn" data-index="${index}" title="Eliminar materia">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;
      gradesList.appendChild(row);
    });

    const avgTotal = sumTotal / grades.length;
    const avgPassing = passingCount > 0 ? (sumPassing / passingCount) : 0;

    if (avgTotalEl) avgTotalEl.innerText = avgTotal.toFixed(2);
    if (avgNoFailEl) avgNoFailEl.innerText = avgPassing.toFixed(2);
    if (totalCountEl) totalCountEl.innerText = grades.length.toString();

    // Attach delete listeners
    gradesList.querySelectorAll('.grade-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        grades.splice(idx, 1);
        renderGrades();
        showToast('Materia eliminada del cálculo', 'info');
      });
    });
  }

  if (addBtn && subjectInput && scoreInput) {
    addBtn.addEventListener('click', () => {
      const name = subjectInput.value.trim();
      const score = parseFloat(scoreInput.value);

      if (!name) {
        showToast('Por favor ingresá el nombre de la materia', 'warning');
        subjectInput.focus();
        return;
      }
      if (isNaN(score) || score < 1 || score > 10) {
        showToast('La nota debe ser un número del 1 al 10', 'warning');
        scoreInput.focus();
        return;
      }

      grades.push({ name, score });
      subjectInput.value = '';
      scoreInput.value = '';
      renderGrades();
      showToast(`¡Nota de ${name} agregada!`, 'success');
      subjectInput.focus();
    });

    // Enter key support
    scoreInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Querés limpiar todas las notas cargadas?')) {
        grades = [];
        renderGrades();
        showToast('Calculadora reiniciada', 'info');
      }
    });
  }

  // Initial render
  renderGrades();
}

/* ==========================================================================
   STUDENT RECLAMOS & WHATSAPP GENERATOR
   ========================================================================== */
function initClaimGenerator() {
  const careerSelect = document.getElementById('claimCareer');
  const typeSelect = document.getElementById('claimType');
  const detailText = document.getElementById('claimDetail');
  const generateBtn = document.getElementById('claimSendBtn');

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const career = careerSelect.value;
      const type = typeSelect.value;
      const detail = detailText.value.trim();

      if (!detail) {
        showToast('Por favor escribí brevemente tu consulta o situación', 'warning');
        detailText.focus();
        return;
      }

      const message = `¡Hola compas de El Quilombo FCSyTS! Les escribo desde la web del Centro de Estudiantes.\n\n*Carrera:* ${career}\n*Motivo:* ${type}\n*Detalle:* ${detail}\n\n¿Me podrían orientar o dar una mano con esta gestión? ¡Muchas gracias!`;

      // Official WhatsApp of El Quilombo FCSyTS
      // We encode the message and open WhatsApp direct link
      const encodedMsg = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?text=${encodedMsg}`;

      window.open(url, '_blank');
      showToast('¡Redirigiendo a WhatsApp con tu consulta armada!', 'success');
    });
  }
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close others
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });
}

/* ==========================================================================
   HELPER UTILITIES: TOAST NOTIFICATIONS & SANITIZATION
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'ph-info';
  let color = '#38bdf8';
  if (type === 'success') {
    icon = 'ph-check-circle';
    color = '#34d399';
  } else if (type === 'warning') {
    icon = 'ph-warning';
    color = '#fbbf24';
  }

  toast.innerHTML = `
    <i class="ph ${icon}" style="color:${color}; font-size:1.25rem;"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}

// Copy text utility
window.copyToClipboard = function(text, label = 'Enlace') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`¡${label} copiado al portapapeles!`, 'success');
  }).catch(() => {
    showToast('No se pudo copiar automáticamente', 'warning');
  });
};
