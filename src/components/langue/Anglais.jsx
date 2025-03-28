import React from 'react';
import './Anglais.css'; // Importez le fichier CSS pour le style
import { Link } from "react-router-dom";
const Anglais = () => {
  return (
    <div className="anglais-container">
      <h1>Formation en langue Anglaise</h1>
      <p>
        Skill Connect propose une sélection exhaustive de formations en anglais qui répondent à différents besoins professionnels et académiques. Que ce soit dans le domaine de l’anglais médical, de l’ESP (English for Specific Purposes) ou de la réussite des examens TOEFL, TOEIC et IELTS, notre centre de formation est là pour vous accompagner dans l’accomplissement de vos aspirations.
      </p>

      <section className="section-medical">
        <h2>Anglais Médical</h2>
        <p>
          La maîtrise de l’anglais médical est cruciale pour les professionnels de la santé qui exercent dans des milieux anglophones. Le but de notre programme d’anglais médical est de vous assister dans votre communication avec vos patients et collègues, tout en vous permettant de saisir la terminologie médicale particulière.
        </p>

        <h3>Ce que vous apprendrez :</h3>
        <ul>
          <li><strong>Terminologie médicale</strong> en anglais</li>
          <li><strong>Communication avec les patients</strong> et les professionnels de la santé</li>
          <li><strong>Lecture et compréhension</strong> des articles médicaux et des rapports cliniques</li>
        </ul>
      </section>

     
      <Link to="/inscription" className="inscription-button">S’inscrire maintenant</Link>
    </div>
  );
};

export default Anglais;