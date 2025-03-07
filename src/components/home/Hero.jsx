import React from "react"
import Title from "../common/title/Title"
import "./Hero.css"

const Hero = () => {
  return (
    <>

      <section className='hero'>
        <div className='container'>
          <div className='row'>
            <Title subtitle='BE THE EXCELLENT' title='Best Online Education Expertise' />
            <p>Beyond the distant hills, past the valleys of Echo and Whisper, dwell the silent words, unseen and unheard, waiting for a voice to bring them to life.</p>
            <div className='button'>
              <button className='primary-btn'>
                GET STARTED NOW <i className='fa fa-long-arrow-alt-right'></i>
              </button>
              <button>
                VIEW COURSE <i className='fa fa-long-arrow-alt-right'></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className='margin'></div>
    </>
  )
}

export default Hero
