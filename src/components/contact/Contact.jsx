import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contactez Notre École de Langue</h1>
        <p>Nous sommes là pour répondre à toutes vos questions</p>
      </header>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Informations de Contact</h2>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <span>Téléphone: <strong>54542264</strong></span>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <span>Email: contact@ecolelangue.com</span>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Adresse: 123 Rue des Langues, Ville</span>
          </div>
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <span>Heures d'ouverture: Lundi-Vendredi, 9h-17h</span>
          </div>
        </div>

        <div className="contact-form">
          <h2>Envoyez-nous un Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nom Complet</label>
              <input type="text" id="name" placeholder="Votre nom" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Votre email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <input type="text" id="subject" placeholder="Sujet de votre message" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Votre message" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Envoyer</button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <h2>Nous Trouver</h2>
        <div className="map-placeholder">
          {/* Ici vous pourriez intégrer une Google Map ou autre */}
          <p>Carte de localisation de l'école</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;