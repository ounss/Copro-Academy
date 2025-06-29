/**
 * COPRO ACADEMY - JavaScript corrigé
 * Carousel, Articles et Formations fonctionnels
 */

// ===================================
// UTILITIES
// ===================================
const utils = {
  delay: (ms) => new Promise((res) => setTimeout(res, ms)),
  debounce: (fn, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  },
  formatDate: (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  hide: (el) => {
    el.style.display = "none";
    el.setAttribute("data-hidden", "true");
  },
  show: (el) => {
    el.style.display = "";
    el.setAttribute("data-hidden", "false");
    el.classList.add("visible");
  },
  getUrlParam: (name) => new URLSearchParams(window.location.search).get(name),
};

// ===================================
// CAROUSEL HÉRO - CORRIGÉ
// ===================================
class HeroCarousel {
  constructor() {
    this.hero = document.querySelector(".hero");
    this.images = document.querySelectorAll(".hero__image");
    this.currentIndex = 0;
    this.intervalTime = 4000;
    this.intervalId = null;

    if (!this.hero || this.images.length <= 1) return;

    this.init();
  }

  init() {
    // Assurer qu'une image est active au départ
    this.images.forEach((img, index) => {
      img.classList.remove("hero__image--active");
      if (index === 0) img.classList.add("hero__image--active");
    });

    this.start();
  }

  show(index) {
    this.images.forEach((img) => img.classList.remove("hero__image--active"));
    this.images[index].classList.add("hero__image--active");
    this.currentIndex = index;
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.show(nextIndex);
  }

  start() {
    this.stop();
    this.intervalId = setInterval(() => this.next(), this.intervalTime);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// ===================================
// ARTICLES PAGE - CORRIGÉ
// ===================================
class ArticlesPage {
  constructor() {
    this.container = document.getElementById("articlesContainer");
    if (!this.container) return;

    this.filterLinks = document.querySelectorAll(".filter-btn");
    this.gridBtn = document.getElementById("gridView");
    this.listBtn = document.getElementById("listView");
    this.loadBtn = document.getElementById("loadMore");
    this.viewControls = document.getElementById("viewControls");

    this.allItems = Array.from(this.container.querySelectorAll(".card"));
    this.itemsPerLoad = 6;
    this.currentlyShown = this.itemsPerLoad;
    this.isListView = false;
    this.currentFilter = "all";

    this.init();
  }

  init() {
    this._enhanceFilters();
    this._bindEvents();
    this._applyFilter();
  }

  _enhanceFilters() {
    // Montrer les contrôles de vue
    if (this.viewControls) {
      this.viewControls.style.display = "flex";
      setTimeout(() => {
        this.viewControls.style.opacity = "1";
      }, 300);
    }
  }

  _bindEvents() {
    // Filtres
    this.filterLinks.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this._handleFilter(link);
      })
    );

    // Vues
    this.gridBtn?.addEventListener("click", () => this._toggleView(false));
    this.listBtn?.addEventListener("click", () => this._toggleView(true));

    // Bouton charger plus
    this.loadBtn?.addEventListener("click", () => this._loadMore());
  }

  _handleFilter(link) {
    // Mettre à jour le filtre actif
    this.filterLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    this.currentFilter = link.dataset.type;
    this.currentlyShown = this.itemsPerLoad; // Reset
    this._applyFilter();
  }

  _applyFilter() {
    const filteredItems = this._getFilteredItems();

    // Cacher tous les éléments
    this.allItems.forEach((item) => utils.hide(item));

    // Montrer les éléments filtrés (jusqu'à currentlyShown)
    filteredItems.slice(0, this.currentlyShown).forEach((item) => {
      utils.show(item);
    });

    this._updateLoadButton(filteredItems);
  }

  _getFilteredItems() {
    if (this.currentFilter === "all") {
      return this.allItems;
    }
    return this.allItems.filter(
      (item) => item.dataset.type === this.currentFilter
    );
  }

  _updateLoadButton(filteredItems) {
    if (!this.loadBtn) return;

    const hasMore = filteredItems.length > this.currentlyShown;

    this.loadBtn.style.display = filteredItems.length > 0 ? "block" : "none";
    this.loadBtn.disabled = !hasMore;

    if (!hasMore) {
      this.loadBtn.style.display = "none";
    }
  }

  _loadMore() {
    if (!this.loadBtn || this.loadBtn.disabled) return;

    this.loadBtn.disabled = true;
    this.loadBtn.textContent = "Chargement...";

    setTimeout(() => {
      this.currentlyShown += this.itemsPerLoad;
      this._applyFilter();
    }, 500);
  }

  _toggleView(listView) {
    this.isListView = listView;
    this.container.classList.toggle("list-view", listView);
    this.gridBtn?.classList.toggle("active", !listView);
    this.listBtn?.classList.toggle("active", listView);
  }
}

// ===================================
// FORMATIONS PAGE - NOUVEAU
// ===================================
class FormationsPage {
  constructor() {
    this.container = document.getElementById("formationsContainer");
    if (!this.container) return;

    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.allCards = Array.from(
      this.container.querySelectorAll(".formation-card")
    );
    this.currentFilter = "all";

    this.init();
  }

  init() {
    this._bindEvents();
    this._applyFilter();
  }

  _bindEvents() {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this._handleFilter(btn);
      });
    });
  }

  _handleFilter(btn) {
    // Mettre à jour le bouton actif
    this.filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    this.currentFilter = btn.dataset.type;
    this._applyFilter();
  }

  _applyFilter() {
    this.allCards.forEach((card) => {
      const cardType = card.dataset.type;
      const shouldShow =
        this.currentFilter === "all" || cardType === this.currentFilter;

      if (shouldShow) {
        utils.show(card);
        card.style.animation = "fadeInUp 0.6s ease";
      } else {
        utils.hide(card);
      }
    });
  }
}

// ===================================
// NAVBAR, NEWSLETTER, CONTACT (inchangés)
// ===================================
const navbar = {
  init() {
    const burger = document.querySelector(".navbar__burger");
    const nav = document.querySelector(".navbar__nav");
    if (!burger || !nav) return;

    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("navbar__nav--open");
      burger.setAttribute("aria-expanded", open);
    });

    document.addEventListener("click", (e) => {
      if (!burger.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove("navbar__nav--open");
        burger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("navbar__nav--open")) {
        nav.classList.remove("navbar__nav--open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  },
};

const newsletter = {
  init() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => this._submit(e));
  },

  async _submit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = "Inscription...";
    btn.disabled = true;
    await utils.delay(1500);
    btn.textContent = "✓ Inscrit !";
    btn.style.background = "#2ecc71";
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = "";
    }, 3000);
  },
};

const contactForm = {
  init() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleSubmit(form);
    });

    form.querySelectorAll("input,textarea,select").forEach((field) => {
      field.addEventListener("blur", () => this._validateField(field));
      field.addEventListener("input", () => this._clearFieldError(field));
    });

    this._prefillSubject();
  },

  _validateField(field) {
    const val = field.value.trim();
    let msg = "";

    if (field.hasAttribute("required") && !val) {
      msg = "Ce champ est obligatoire";
    } else if (
      field.type === "email" &&
      val &&
      !/^[^@]+@[^@]+\.[^@]+$/.test(val)
    ) {
      msg = "Email invalide";
    } else if (field.name === "message" && val.length && val.length < 20) {
      msg = "Au moins 20 caractères";
    }

    if (msg) {
      this._showError(field, msg);
    } else {
      this._clearFieldError(field);
    }

    return !msg;
  },

  _showError(field, msg) {
    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");

    let err = document.getElementById(field.id + "-error");
    if (!err) {
      err = document.createElement("div");
      err.id = field.id + "-error";
      err.className = "form-error";
      field.after(err);
    }
    err.textContent = msg;
    err.classList.add("form-error--show");
  },

  _clearFieldError(field) {
    field.classList.remove("error");
    field.removeAttribute("aria-invalid");
    const err = document.getElementById(field.id + "-error");
    if (err) err.textContent = "";
  },

  async _handleSubmit(form) {
    let errs = 0;
    form.querySelectorAll("input,textarea,select").forEach((f) => {
      if (!this._validateField(f)) errs++;
    });

    if (errs) {
      form.querySelector(".error")?.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = "Envoi en cours...";
    btn.disabled = true;

    await utils.delay(2000);

    btn.textContent = "✓ Message envoyé !";
    btn.style.background = "#2ecc71";

    setTimeout(() => {
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = "";
    }, 3000);
  },

  _prefillSubject() {
    const sujet = utils.getUrlParam("sujet");
    if (!sujet) return;
    const sel = document.getElementById("sujet");
    if (sel && sel.querySelector(`option[value="${sujet}"]`)) {
      sel.value = sujet;
    }
  },
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialiser tous les composants
  new HeroCarousel();
  navbar.init();
  newsletter.init();
  contactForm.init();
  new ArticlesPage();
  new FormationsPage();
  new TableOfContents(); // ← Ajouter cette ligne

  console.log("Copro Academy: Tous les composants initialisés");
});
// ===================================
// TABLE OF CONTENTS - ACTIVE TRACKING
// ===================================
// ===================================
// TABLE OF CONTENTS - ACTIVE TRACKING CORRIGÉ
// ===================================
class TableOfContents {
  constructor() {
    this.toc = document.querySelector(".table-of-contents, .toc");
    this.tocLinks = document.querySelectorAll(
      ".table-of-contents a, .toc__link"
    );
    // Chercher les sections avec ID au lieu des h2[id]
    this.sections = document.querySelectorAll(
      "section[id], .article-body section[id], .content-main section[id]"
    );

    if (!this.toc || this.tocLinks.length === 0 || this.sections.length === 0)
      return;

    this.currentActiveLink = null;
    this.init();
  }

  init() {
    // Utiliser IntersectionObserver pour de meilleures performances
    this.setupIntersectionObserver();

    // Click handlers pour smooth scroll
    this.tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => this.handleTocClick(e));
    });

    console.log("TOC initialized with", this.sections.length, "sections");
  }

  setupIntersectionObserver() {
    // Options pour l'IntersectionObserver
    const options = {
      root: null,
      rootMargin: "-20% 0px -35% 0px", // Zone de détection
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    // Callback pour l'intersection
    const callback = (entries) => {
      // Trier les entrées par position verticale
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      // Prendre la première section visible
      if (visibleSections.length > 0) {
        const activeSection = visibleSections[0].target;
        this.setActiveSection(activeSection.id);
      }
    };

    // Créer l'observer
    this.observer = new IntersectionObserver(callback, options);

    // Observer toutes les sections
    this.sections.forEach((section) => {
      this.observer.observe(section);
    });
  }

  setActiveSection(sectionId) {
    // Trouver le lien correspondant à cette section
    const targetLink = document.querySelector(`a[href="#${sectionId}"]`);

    if (targetLink && targetLink !== this.currentActiveLink) {
      // Retirer l'ancienne classe active
      if (this.currentActiveLink) {
        this.currentActiveLink.classList.remove("active", "toc__link--active");
      }

      // Ajouter la nouvelle classe active
      targetLink.classList.add("active", "toc__link--active");
      this.currentActiveLink = targetLink;

      // Scroll TOC si nécessaire
      this.scrollTocToActiveLink(targetLink);

      console.log("Active section:", sectionId);
    }
  }

  handleTocClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute("href");

    if (href && href.startsWith("#")) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        // Calculer la position avec offset pour le header fixe
        const headerOffset = 120;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }

  scrollTocToActiveLink(activeLink) {
    if (!this.toc || this.toc.scrollHeight <= this.toc.clientHeight) return;

    const tocRect = this.toc.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const relativeTop = linkRect.top - tocRect.top;

    // Scroll si le lien est en dehors de la zone visible
    if (relativeTop < 50 || relativeTop > tocRect.height - 100) {
      this.toc.scrollTo({
        top: this.toc.scrollTop + relativeTop - tocRect.height / 2,
        behavior: "smooth",
      });
    }
  }

  // Méthode de nettoyage
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
