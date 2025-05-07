// product.js
document.addEventListener('DOMContentLoaded', () => {
  const App = {
    product: null,
    currentColor: null,
    sliderImages: [],
    currentSlide: 0,
    cardWidth: 0,
    cart: [],

    init() {
      this.loadProduct();
      this.setupColorOptions();
      this.buildSlider();
      this.buildReviews();
      this.buildSimilar();
      this.buildPayments();
      this.initCart();
      this.bindUI();
      this.initTouch();
    },

  loadProduct() {
  const id = new URLSearchParams(location.search).get('id');
  this.product = products[id];
  
  if (!this.product) {
    console.error('Produit non trouvé');
    return;
  }
  
  // Mettre à jour les éléments seulement s'ils existent
  const updateElement = (selector, content) => {
    const el = document.querySelector(selector);
    if(el) el.textContent = content;
  };

  document.title = `${this.product.nom} | Zéphyr Store`;
  updateElement('.product-title', this.product.nom);
  updateElement('.product-description', this.product.description);
  updateElement('.current-price', `${this.product.prix.toFixed(2)} €`);
  updateElement('.old-price', `${this.product.ancienPrix?.toFixed(2) || ''} €`);
  
  const featuresList = document.querySelector('.product-features');
  if(featuresList) {
    featuresList.innerHTML = this.product.caracteristiques?.
      map(c => `<li>${c}</li>`).join('') || '';
  }
},

    setupColorOptions() {
  // Vérifier la présence des couleurs
  const colors = Object.keys(this.product.couleurs || {});
  if (!colors.length) {
    console.error('Aucune couleur disponible pour ce produit');
    document.getElementById('color-error').textContent = 'Produit indisponible';
    document.getElementById('color-error').style.display = 'block';
    return;
  }

  // Éléments DOM
  const container = document.querySelector('.color-options');
  const colorError = document.getElementById('color-error');
  
  // Vérifier l'existence des éléments
  if (!container) {
    console.error('Conteneur des couleurs introuvable');
    return;
  }

  // Générer le HTML des options
  container.innerHTML = colors.map(key => {
    const color = this.product.couleurs[key];
    return `
      <div class="color-option">
        <input 
          type="radio" 
          id="color-${key}" 
          name="couleur" 
          value="${key}"
          ${this.currentColor === key ? 'checked' : ''}
        >
        <label 
          for="color-${key}" 
          class="color-swatch" 
          style="background-color: ${color.code}"
          title="${color.nom}"
        >
          <span class="checkmark">✓</span>
        </label>
      </div>
    `;
  }).join('');

  // Gestionnaire d'événements
  container.addEventListener('change', (e) => {
    if (e.target.name === 'couleur') {
      this.currentColor = e.target.value;
      colorError.style.display = 'none';
      this.buildSlider();
      
      // Animation de confirmation
      const selectedLabel = e.target.nextElementSibling;
      selectedLabel.classList.add('selected-animation');
      setTimeout(() => {
        selectedLabel.classList.remove('selected-animation');
      }, 300);
    }
  });

  // Initialiser la première couleur
  this.currentColor = colors[0];
  const firstInput = container.querySelector('input[type="radio"]');
  if (firstInput) firstInput.checked = true;

  // Cacher l'erreur initialement
  colorError.style.display = 'none';
},

    buildSlider() {
      if (!this.product?.couleurs?.[this.currentColor]) {
    console.error('Couleur non trouvée');
    return;
  }
      const imgs = this.product.couleurs[this.currentColor].images;
      const cont = document.querySelector('.slider-container');
      cont.innerHTML = imgs.map((src,i) =>
        `<img src="${src}" class="slider-image${i===0?' active':''}" alt="">`
      ).join('') + `
        <div class="slider-navigation">
          <button onclick="App.changeSlide(-1)">❮</button>
          <button onclick="App.changeSlide(1)">❯</button>
        </div>`;
      this.sliderImages = Array.from(cont.querySelectorAll('.slider-image'));
      this.currentSlide = 0;
    },

    changeSlide(dir) {
      this.sliderImages[this.currentSlide].classList.remove('active');
      this.currentSlide = (this.currentSlide + dir + this.sliderImages.length) % this.sliderImages.length;
      this.sliderImages[this.currentSlide].classList.add('active');
    },

    buildReviews() {
      const cont = document.querySelector('.reviews-container');
      cont.innerHTML = this.product.avis.map(av => `
        <div class="review-card">
          <div class="review-header">
            <strong>${av.auteur}</strong>
            <div class="review-rating">${'★'.repeat(av.note)}</div>
          </div>
          <div class="review-body">
            <p class="review-text">${av.texte}</p>
            <div class="review-images">
              ${av.photos.map(p => `<img src="${p}" width="80">`).join('')}
            </div>
          </div>
        </div>
      `).join('');
      setTimeout(() => {
        const card = cont.querySelector('.review-card');
        this.cardWidth = card.offsetWidth + 40;
        this.updateArrows();
      }, 100);
      document.querySelector('.left-arrow').onclick  = () => this.scrollReviews(-1);
      document.querySelector('.right-arrow').onclick = () => this.scrollReviews(1);
    },

    scrollReviews(dir) {
      const c = document.querySelector('.reviews-container');
      c.scrollBy({ left: this.cardWidth * dir, behavior: 'smooth' });
      setTimeout(() => this.updateArrows(), 300);
    },

    updateArrows() {
      const c = document.querySelector('.reviews-container');
      document.querySelector('.left-arrow').style.display  = c.scrollLeft > 0 ? 'block' : 'none';
      document.querySelector('.right-arrow').style.display = (c.scrollLeft + c.clientWidth) < c.scrollWidth ? 'block' : 'none';
    },

    buildSimilar() {
      const simContainer = document.querySelector('.similaires');
      simContainer.innerHTML = this.product.similaires.map(id => {
        const p = products[id];
        if (!p) return '';
        const img = p.couleurs[Object.keys(p.couleurs)[0]].images[0];
        return `
          <div class="similaire">
            <a href="fiche-produit.html?id=${id}">
              <img src="${img}" alt="${p.nom}">
              <div>${p.nom}</div>
            </a>
          </div>
        `;
      }).join('');
    },

    buildPayments() {
      document.querySelector('.moyens-paiement').innerHTML =
        this.product.moyensPaiement.map(src => `<img src="${src}" height="32">`).join('');
    },

    initCart() {
      this.cart = JSON.parse(localStorage.getItem('panier')||'[]');
      this.renderCart();
      document.getElementById('liste-panier')
        .addEventListener('click', e => {
          const btn = e.target.closest('.poubelle');
          if (!btn) return;
          this.cart = this.cart.filter(i => i.id !== +btn.dataset.id);
          this.saveCart();
        });
    },

    addToCart() {
      const sel = document.querySelector('input[name="couleur"]:checked');
      if (!sel) return document.getElementById('color-error').style.display = 'block';
      const col = sel.value;
      const item = {
        id: Date.now(),
        nom: this.product.nom,
        prix: this.product.prix,
        couleur: col,
        quantite: 1,
        image: this.product.couleurs[col].images[0]
      };
      const exist = this.cart.find(i => i.nom===item.nom && i.couleur===col);
      if (exist) exist.quantite++;
      else this.cart.push(item);
      this.saveCart();
      this.flashAdded();
    },

    saveCart() {
      localStorage.setItem('panier', JSON.stringify(this.cart));
      this.renderCart();
    },

    renderCart() {
      document.getElementById('compteur-panier').textContent =
        this.cart.reduce((a,b)=>a+b.quantite,0);
      const ul = document.getElementById('liste-panier');
      ul.innerHTML = this.cart.map(i => `
        <li class="panier-item">
          <img src="${i.image}" width="50" alt="">
          <div class="item-desc">${i.nom} (${i.couleur}) ×${i.quantite}</div>
          <span class="poubelle" data-id="${i.id}">🗑️</span>
        </li>
      `).join('');
      const tot = this.cart.reduce((s,i)=>s+i.prix*i.quantite,0).toFixed(2);
      document.getElementById('total-panier').textContent = `${tot} €`;
    },

    flashAdded() {
      const btn = document.querySelector('.add-to-cart');
      btn.textContent = 'Ajouté !';
      setTimeout(() => btn.textContent = 'Ajouter au panier', 2000);
    },

    bindUI() {
      document.querySelector('.add-to-cart').onclick = () => this.addToCart();
      document.querySelector('.cart-btn').onclick = e => {
        e.stopPropagation();
        document.getElementById('recapitulatif-panier').classList.toggle('active');
      };
      document.addEventListener('click', e => {
        if (!e.target.closest('.cart-btn') && !e.target.closest('#recapitulatif-panier')) {
          document.getElementById('recapitulatif-panier').classList.remove('active');
        }
      });
    },

    initTouch() {
      let startX=0;
      const slider = document.querySelector('.slider-container');
      slider?.addEventListener('touchstart', e => startX=e.touches[0].clientX);
      slider?.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff)>50) this.changeSlide(diff>0?1:-1);
      });
      const rev = document.querySelector('.reviews-container');
      rev?.addEventListener('touchstart', e => startX=e.touches[0].clientX);
      rev?.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff)>50) this.scrollReviews(diff>0?1:-1);
      });
    }
  };

  window.App = App;
  App.init();
});
