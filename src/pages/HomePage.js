import { CheckCheck } from 'lucide-react';
import '../styles/HomePage.scss';
import pizza from '../img/pizza.png';
import about from '../img/about.jpg';

export const MainPage = () => {
     return ( 
          <>
               <section id= "hero" className="hero">
                     <div className="container hero__container">
                         <div className="hero__content">
                              <h2 className="hero__title">
                                   Welcome to <span className="hero__title--accent">Restoran</span>
                              </h2>
                              <p className="hero__description">Delivering great food for more than 18 years!</p>
                              <div className="hero__buttons">
                                   <button className="button  btn-accent-secondary">BOOK A TABLE</button>
                                   <button className="button  btn-accent-primary">ORDER NOW</button>
                              </div>
                         </div>
                         <div className="hero__image-container">
                              <img src={pizza} alt="hero" className="hero__image" />
                         </div>
                    </div>
               </section>

               <section id="about" className="about">
                    <div className="container about__container">
                              <div className="about__content">
                                   <h3 className="about__title">Voluptatem dignissimos provident</h3>
                                   <p className="about__description font-italic-style">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua.
                                   </p>
                                   <ul className="about__list">
                                        <li className="about__list-item">
                                             <CheckCheck />
                                             <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                                        </li>
                                        <li className="about__list-item">
                                             <CheckCheck />
                                             <span>Duis aute irure dolor in reprehenderit in voluptate velit.</span>
                                        </li>
                                        <li className="about__list-item">
                                             <CheckCheck />
                                             <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                                        </li>
                                   </ul>
                                   <p className='about__bottom-text'>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident</p>
                              </div>
                              <div className="about__image-container">
                                   <img src={about} alt="about" className="about__image" />
                              </div>
                         </div>
               </section>
               <section id="why-us" className="why-us">
                    <div className="container why-us__container">
                         <div className="why-us__title">
                              <h2>WHY US</h2>
                              <p>Why Choose Our Restaurant</p>
                         </div>
                        <div className='why-us__cards'>
                              <div className="why-us__card">
                                   <span className="why-us__card-number">01</span>
                                   <h4 className="why-us__card-title">Fresh Ingredients</h4>
                                   <p className="why-us__card-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                              </div>
                              <div className="why-us__card">
                                   <span className="why-us__card-number">02</span>
                                   <h4 className="why-us__card-title">Fast Delivery</h4>
                                   <p className="why-us__card-description">  Lorem h4 dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                   </div>
                              <div className="why-us__card">
                                   <span className="why-us__card-number">03</span>
                                   <h4 className="why-us__card-title">Best Quality</h4>
                                   <p className="why-us__card-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>   
                                   </div>
                        </div>
                    </div>
               </section>
               <section id="menu">

               </section>
          </>
     );
};

export default MainPage;
