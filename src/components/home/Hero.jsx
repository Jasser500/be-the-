import React from "react"
import Title from "../common/title/Title"
import "./Hero.css"

const Hero = () => {
  return (
    <>
      <section className='hero'>
        <div className='container'>
          <div className='row'>
            <Title subtitle='BE THE EXCELLENT' title='Best Online Language School' />
            <div className='button'>
              <button className='primary-btn'>
                GET STARTED NOW <i className='fa fa-long-arrow-alt-right'></i>
              </button>
              <button>
                VIEW COURSES <i className='fa fa-long-arrow-alt-right'></i>
              </button>
            </div>
          </div>

            <p>
              Beyond the distant hills, past the valleys of Echo and Whisper, dwell the silent words, 
              unseen and unheard, waiting for a voice to bring them to life.
            </p>

            <div className='hero-stats'>
              <div className='stat'>
                <h3>+1000</h3>
                <p>Étudiants satisfaits</p>
              </div>
              <div className='stat'>
                <h3>25</h3>
                <p>Langues disponibles</p>
              </div>
              <div className='stat'>
                <h3>50+</h3>
                <p>Formateurs certifiés</p>
              </div>
            </div>

           
          <div className='hero-image'>
            <img src='/images/hero-langue.png' alt='Online Language School' />
          </div>
        </div>
      </section>

      <div className='margin'></div>
    </>
  )
}

export default Hero
