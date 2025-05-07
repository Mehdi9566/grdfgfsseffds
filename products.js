const products = {
  'ventilateur-3en1': {
    id: 'ventilateur-3en1',
    nom: 'Humidificateur Portable 3 en 1 : Ventilateur USB, Veilleuse LED & Brumisateur d\'Eau',
    description: 'Transformez votre espace en un havre de fraîcheur et de bien-être avec cet humidificateur portable 3 en 1 !',
    prix: 19.99,
    ancienPrix: 39.99,
    caracteristiques: [
      'Ventilateur USB pour une brise rafraîchissante',
      'Brumisateur pour purifier l’air',
      'Veilleuse LED relaxante',
      'Design compact & transportable',
      '3 en 1 : ventilation, humidification, éclairage'
    ],
    couleurs: {
      blanc: {
        nom: 'Blanc',
        code: '#ffffff',
        images: [
          'images/produits/ventilateur-blanccolor.png',
          'images/produits/ventilateur-10.png',
          'images/produits/ventilateur-4.png',
          'images/produits/ventilateur-5.png'
        ]
      },
      noir: {
        nom: 'Noir',
        code: '#000000',
        images: [
          'images/produits/ventilateur-noircolor.png',
          'images/produits/ventilateur-10.png',
          'images/produits/ventilateur-4.png',
          'images/produits/ventilateur-5.png'
        ]
      }
    },
    avis: [
      {
        auteur: 'Sophie R. – Lille',
        note: 5,
        texte: '"Facile à emporter, il m’a sauvé pendant la canicule. Et il est super joli en plus."',
        photos: ['images/commentaire1.png']
      },
      {
        auteur: 'Lucas P. – Bordeaux',
        note: 4,
        texte: '"Super produit, très efficace pour l\'été !"',
        photos: ['images/commentaire2.png']
      },
      {
        auteur: 'Émilie G. – Paris',
        note: '"J\'adore ! L\'effet brumisateur rend vraiment l\'air plus frais, c’est bluffant. Et la batterie tient plusieurs heures, ce qui est top pour les déplacements."',
        note: 5,
        photos: ['images/commentaire3.png']
      }
    ],
    similaires: ['gourde-smart', 'brumisateur-main', 'tente-uv'],
    moyensPaiement: [
      'images/visa.png',
      'images/mastercard.png',
      'images/paypal.png'
    ]
  },

  'gourde-smart': {
    id: 'gourde-smart',
    nom: 'Gourde Connectée Zéphyr',
    description: 'Gourde isotherme intelligente avec écran tactile',
    prix: 29.99,
    ancienPrix: 39.99,
    caracteristiques: [
      'Bouton tactile LED',
      'Autonomie 7 jours',
      'Étanche IP68',
      'Capacité 750ml'
    ],
    couleurs: {
      acier: {
        nom: 'Acier Brossé',
        code: '#A3A3A3',
        images: ['gourde-acier1.jpg', 'gourde-acier2.jpg']
      }
    },
    avis: [],
    similaires: ['ventilateur-3en1'],
    moyensPaiement: [
      'images/visa.png',
      'images/mastercard.png'
    ]
  }
};

// Export pour usage global dans le navigateur
if (typeof window !== 'undefined') {
  window.products = products;
}
