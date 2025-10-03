import { CheckCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import '../styles/home-page.scss';
import pizza from '../img/pizza.png';
import about from '../img/about.jpg';
import ImageSlider from '../components/ImageSlider.js';
import TestimonialsSlider from '../components/TestimonialsSlider.js';
import MyLightbox from '../components/MyLightbox.js';
import TeamMembersCards from '../components/TeamMembersCards.js';
import FoodMenu from '../components/FoodMenu.js';
import TableBookingForm from '../components/TableBookingForm.js'
import ContactForm from '../components/ContactForm.js'
import FloatingCartButton from '../components/FloatingCartButton.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import heroBg from '../img/homePage/hero-bg.jpg';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const MainPage = () => {
     const [specialsActiveTab, setSpecialsActiveTab] = useState(0);
     const { openCart, cartQuantity, isCartOpen } = useShoppingCart();
     // Tabs for Specials Section
     const specialsTabs = [
          {
               tabName: 'Culinary Masterpiece',
               title: 'The Art of Italian Gastronomy',
               content: 'Discover the heart of Italy on a plate. Our chefs craft each dish with passion, using traditional techniques and the finest imported ingredients to bring you an unforgettable culinary journey. Experience flavors that tell a story of heritage and quality.',
               image: '/img/homePage/tabs/specials-0.png'
          },
          {
               tabName: 'Seasonal Delights',
               title: 'Inspired by the Season’s Bounty',
               content: 'Our menu evolves with nature\'s calendar. We partner with local farms to source the freshest seasonal produce, ensuring every dish is a vibrant celebration of natural flavors. Enjoy a menu that is as fresh and unique as the season itself.',
               image: '/img/homePage/tabs/specials-1.png'
          },
          {
               tabName: 'Chef’s Exclusive',
               title: 'A Symphony of Flavors',
               content: 'Indulge in our chef’s latest creation—a meticulously designed dish that showcases innovative pairings and a bold culinary vision. This limited-time offering is an exclusive opportunity to savor a unique blend of tastes and textures, crafted with the utmost precision.',
               image: '/img/homePage/tabs/specials-2.png'
          },
          {
               tabName: 'Mediterranean Escape',
               title: 'A Taste of the Sun-Kissed Coast',
               content: 'Transport yourself to the serene Mediterranean coast with our light yet flavorful dishes. Featuring fresh seafood, aromatic herbs, and sun-ripened vegetables, this selection offers a refreshing escape and a true taste of coastal elegance.',
               image: '/img/homePage/tabs/specials-3.png'
          },
          {
               tabName: 'The Truffle Experience',
               title: 'Elegance in Every Bite',
               content: 'For a truly decadent experience, explore our special truffle-infused dishes. Each plate is a tribute to the "diamond of the kitchen," expertly paired to enhance its unique earthy aroma. A luxurious treat for the refined palate.',
               image: '/img/homePage/tabs/specials-4.png'
          }
     ];

     // Data for Events Slider
     const eventsSliderData = [
          {
               title: 'Private Dining & Events',
               price: '£120',
               content: 'Celebrate your special moments in our elegant space. Our team will tailor every detail, from the bespoke menu to the perfect ambiance, ensuring a truly memorable experience for you and your guests. Contact us to plan your private event.',
               image: '/img/homePage/slider/events-slider-0.jpg'
          },
          {
               title: 'Corporate Gatherings',
               price: '£99',
               content: 'Impress your clients or reward your team with an exceptional dining experience. Our private event services offer a sophisticated setting, professional service, and a curated menu to meet all your corporate needs.',
               image: '/img/homePage/slider/events-slider-1.jpg'
          },
          {
               title: 'Wine Tastings',
               price: '£189',
               content: 'Join us for an exclusive journey through the world of fine wines. Our sommelier will guide you through a selection of exquisite vintages, expertly paired with a tasting menu designed to elevate the flavors of each glass.',
               image: '/img/homePage/slider/events-slider-2.jpg'
          }
     ];

     // Testimonial Data
     const testimonialData = [
          {
               quote: 'This service exceeded my expectations. Everything was delivered on time and with great attention to detail. The team was incredibly professional and efficient. I am thoroughly impressed with the quality of work provided.',
               name: 'Anna Kowalska',
               profession: 'Graphic Designer',
               image: '/img/homePage/testimonials/testimonials-1.jpg'
          },
          {
               quote: 'Absolutely fantastic experience from start to finish. The team was professional, responsive, and very creative. They made sure to address all my concerns. I couldn’t be happier with the results.',
               name: 'John Smith',
               profession: 'Software Engineer',
               image: '/img/homePage/testimonials/testimonials-2.jpg'
          },
          {
               quote: 'Highly recommend to anyone looking for quality and professionalism. They listened carefully to my needs and delivered exactly what I wanted. The attention to detail was remarkable. I will definitely work with them again in the future.',
               name: 'Maria Nowak',
               profession: 'Marketing Specialist',
               image: '/img/homePage/testimonials/testimonials-3.jpg'
          },
          {
               quote: 'Incredible team, great communication, and superb results. I will definitely work with them again on future projects. They exceeded my expectations at every stage. The end product was exactly what I envisioned.',
               name: 'James Brown',
               profession: 'Entrepreneur',
               image: '/img/homePage/testimonials/testimonials-4.jpg'
          },
          {
               quote: 'A reliable partner that truly cares about clients. Their support during the project was outstanding and very helpful. They always kept me informed throughout the process. The outcome was beyond what I imagined.',
               name: 'Sophie Wilson',
               profession: 'Project Manager',
               image: '/img/homePage/testimonials/testimonials-5.jpg'
          }
     ];

     // Lightbox Gallery Images
     const lightboxImages = [
          { full: '/img/homePage/lightboxGallery/gallery-1.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-1-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-2.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-2-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-3.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-3-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-4.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-4-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-5.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-5-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-6.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-6-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-7.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-7-thumb.jpg' },
          { full: '/img/homePage/lightboxGallery/gallery-8.jpg', thumb: '/img/homePage/lightboxGallery/thumb/gallery-8-thumb.jpg' },
     ];

     // Team Members Data
     const teamData = [
          {
               name: "John Doe",
               role: "Master Chef",
               image: '/img/homePage/team/person-1.jpg',
               xUrl: "https://example.com/johndoe",
               linkedInUrl: "https://linkedin.com/in/johndoe",
               twitterUrl: "https://twitter.com/johndoe",
               facebookUrl: "https://facebook.com/johndoe",
          },
          {
               name: "Jane Smith",
               role: "Patissier",
               image: '/img/homePage/team/person-2.jpg',
               xUrl: "https://example.com/janesmith",
               linkedInUrl: "https://linkedin.com/in/janesmith",
               twitterUrl: "https://twitter.com/janesmith",
               facebookUrl: "https://facebook.com/janesmith",
          },
          {
               name: "Michael Brown",
               role: "Cook",
               image: '/img/homePage/team/person-3.jpg',
               xUrl: "https://example.com/michaelbrown",
               linkedInUrl: "https://linkedin.com/in/michaelbrown",
               twitterUrl: "https://twitter.com/michaelbrown",
               facebookUrl: "https://facebook.com/michaelbrown",
          }
     ];

     // Contact Icons & Info
     const contactIcons = [
          {
               icon: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/geo-alt.svg",
               title: "Location",
               text: "123 Main Street, City, Country"
          },
          {
               icon: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/clock.svg",
               title: "Open Hours",
               text: "Monday - Saturday: 11:00 AM - 2300 PM"
          },
          {
               icon: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/telephone.svg",
               title: "Call Us",
               text: "+1 5589 55488 55"
          },
          {
               icon: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/envelope.svg",
               title: "Email Us",
               text: "info@example.com",
          }
     ];

     const handleSpecialsTabClick = (index) => {
          setSpecialsActiveTab(index);
     };

     useEffect(() => {
          AOS.init({
               duration: 500,
               once: true,
               offset: -150,
          });
     }, []);

     return (
          <>
               {/* HERO SECTION */}
               <section id="hero" className="hero">
                    <LazyLoadImage
                         src={heroBg}
                         alt="hero"
                         className="hero__bg-image"
                         wrapperClassName="hero__bg-wrapper"
                         effect="blur"
                    />
                    <div className="container hero__container">
                         <div className="hero__content">

                              <h2 className="hero__title" data-aos="fade-up">
                                   Welcome to <span className="hero__title--accent">Restoran</span>
                              </h2>
                              <p data-aos="fade-up" data-aos-delay="100" className="hero__description">Delivering great food for more than 18 years!</p>
                              <div data-aos="fade-up" data-aos-delay="200" className="hero__buttons">
                                   <a href='#book-a-table' className="button btn-accent-primary hero__button">Book A Table</a>
                                   <a href='#our-menu' className="button btn-accent-primary hero__button">See Menu</a>
                              </div>
                         </div>
                         <div className="hero__image-container">
                              <img src={pizza} alt="hero" className="hero__image" />
                         </div>
                    </div>
               </section>

               {/* ABOUT SECTION */}
               <section id="about" className="about">
                    <div className="container about__container">
                         <div className="about__content" data-aos='fade-right'>
                              <h3 className="about__title">A Passion for Exquisite Dining</h3>
                              <p className="about__description font-italic-style">
                                   Our commitment to culinary excellence is rooted in a deep respect for tradition and a bold approach to modern flavors. We craft every dish to be a memorable experience.
                              </p>
                              <ul className="about__list">
                                   <li className="about__list-item">
                                        <CheckCheck />
                                        <span>Exquisite dishes prepared with fresh, premium ingredients.</span>
                                   </li>
                                   <li className="about__list-item">
                                        <CheckCheck />
                                        <span>An elegant and sophisticated atmosphere for a truly special occasion.</span>
                                   </li>
                                   <li className="about__list-item">
                                        <CheckCheck />
                                        <span>A curated selection of the finest wines to complement every meal.</span>
                                   </li>
                              </ul>
                              <p className='about__bottom-text'>We believe that dining is not just about food, but about the entire experience—from the first glance at the menu to the final, lingering taste. We invite you to join us and discover what makes our restaurant a destination for discerning palates.</p>
                         </div>
                         <div className="about__image-container" data-aos='fade-left'>
                              <img src={about} alt="about" className="about__image" />
                         </div>
                    </div>
               </section>

               {/* WHY US SECTION */}
               <section id="why-us" className="why-us">
                    <div className="container why-us__container">
                         <div className="why-us__title">
                              <h2>WHY US</h2>
                              <p>Why Choose Our Restaurant</p>
                         </div>
                         <div className='why-us__cards'>
                              <div className="why-us__card" data-aos='zoom-in-up'>
                                   <span className="why-us__card-number">01</span>
                                   <h4 className="why-us__card-title">Fresh Ingredients</h4>
                                   <p className="why-us__card-description">We source our ingredients from trusted local suppliers and organic farms, ensuring every dish is not only delicious but also of the highest quality and freshness.</p>
                              </div>
                              <div className="why-us__card" data-aos='zoom-in-up' data-aos-delay="100">
                                   <span className="why-us__card-number">02</span>
                                   <h4 className="why-us__card-title">Masterful Chefs</h4>
                                   <p className="why-us__card-description">Our team of award-winning chefs brings a wealth of experience and a passion for culinary innovation, creating dishes that are a feast for both the eyes and the palate.</p>
                              </div>
                              <div className="why-us__card" data-aos='zoom-in-up' data-aos-delay="200">
                                   <span className="why-us__card-number">03</span>
                                   <h4 className="why-us__card-title">Elegant Atmosphere</h4>
                                   <p className="why-us__card-description">Dine in an atmosphere of sophisticated elegance. Our beautifully designed interior and attentive service create the perfect setting for any occasion, from an intimate dinner to a grand celebration.</p>
                              </div>
                         </div>
                    </div>
               </section>

               {/* OUR MENU SECTION */}
               <section id="our-menu" className='our-menu' >
                    <div className="container our-menu__container" >
                         <div className="our-menu__title">
                              <h2>OUR MENU</h2>
                              <p>Discover Our Delicious Menu</p>
                         </div>
                         <div className="our-menu__content">
                              <FoodMenu />
                         </div>
                    </div>
               </section>

               {/* SPECIALS SECTION */}
               <section id="specials" className="specials">
                    <div className='container specials__container'>
                         <div className="specials__title">
                              <h2>SPECJALS</h2>
                              <p>Check Our Specials</p>
                         </div>
                         <div className="specials__content">
                              <div className="specials__nav-tabs">
                                   <div className="specials__nav-tabs-list">
                                        {specialsTabs.map((tab, index) => (
                                             <div
                                                  data-aos="fade-right"
                                                  data-aos-duration="500"
                                                  data-aos-delay={index * 150}
                                                  key={index}
                                             >
                                                  <div
                                                       className={`specials__nav-tabs-item ${index === specialsActiveTab ? 'specials__nav-tabs-item--active' : ''}`}
                                                       onClick={() => handleSpecialsTabClick(index)}
                                                  >
                                                       {tab.tabName}
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                              <div className="specials__item">
                                   {specialsTabs
                                        .filter((tab, index) => index === specialsActiveTab)
                                        .map((tab, index) => (
                                             <React.Fragment key={index}>
                                                  <div data-aos="fade-left" className='specials__item-text'>
                                                       <h4 className="specials__item-title">{tab.title}</h4>
                                                       <p className="specials__item-description font-italic-style">{tab.content}</p>
                                                  </div>
                                                  <img
                                                       src={tab.image}
                                                       className='specials__item-image'
                                                       data-aos="fade-left"
                                                       data-aos-delay='200'
                                                       alt="specials" />
                                             </React.Fragment>
                                        ))}
                              </div>
                         </div>
                    </div>
               </section>

               {/* EVENTS SECTION */}
               <section id="events" className="events">
                    <div className='container events__container'>
                         <div className="events__title">
                              <h2>EVENTS</h2>
                              <p>Check Our Events</p>
                         </div>
                         <div className="events__content">
                              <ImageSlider data={eventsSliderData} />
                         </div>
                    </div>
               </section>

               {/* RESERVATION SECTION */}
               <section id="book-a-table" className="book-a-table">
                    <div className='container book-a-table__container'>
                         <div className="book-a-table__title">
                              <h2>RESERVATION</h2>
                              <p>Book A Table</p>
                         </div>
                         <div className='book-a-table__content'>
                              <TableBookingForm />
                         </div>
                    </div>
               </section>

               {/* TESTIMONIALS SECTION */}
               <section id="testimonials" className='testimonials'>
                    <div className='container testimonials__container'>
                         <div className="testimonials__title">
                              <h2>TESTIMONIALS</h2>
                              <p>What they're saying about us</p>
                         </div>
                         <TestimonialsSlider data={testimonialData} />
                    </div>
               </section>

               {/* GALLERY SECTION */}
               <section id="gallery" className='gallery'>
                    <div className='gallery__container container'>
                         <div className="gallery__title">
                              <h2>GALLERY</h2>
                              <p>Some photos from Our Restauranty</p>
                         </div>
                         <div className='gallery__content'></div>
                    </div>
                    <MyLightbox images={lightboxImages} />
               </section>

               {/* OUR TEAM SECTION */}
               <section id='our-team' className='our-team'>
                    <div className='container our-team__container'>
                         <div className="our-team__title">
                              <h2>OUR TEAM</h2>
                              <p>Meet Our Team</p>
                         </div>
                         <div className='our-team__content'>
                              <TeamMembersCards data={teamData} />
                         </div>
                    </div>
               </section>

               {/* CONTACT SECTION */}
               <section id="contact" className='contact'>
                    <div className='container contact__container'>
                         <div className="contact__title">
                              <h2>CONTACT</h2>
                              <p>Get in Touch</p>
                         </div>
                         <div>
                              <iframe
                                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2359.0035271970405!2d-0.3157891221863379!3d53.75382027241024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4878be0c0dd1278b%3A0x2e90074e056faac0!2s222%20Holderness%20Rd%2C%20Hull%20HU9%202AA!5e0!3m2!1spl!2suk!4v1755461601635!5m2!1spl!2suk"
                                   width="100%"
                                   height="450"
                                   style={{ border: 0 }}
                                   allowFullScreen
                                   loading="lazy"
                                   referrerPolicy="no-referrer-when-downgrade"
                                   title="Google Maps location for 222 Holderness Rd, Hull"
                              ></iframe>
                         </div>

                         <div className='contact__content'>
                              <div className='contact__info'>
                                   {contactIcons.map((icon, index) => (
                                        <div key={index} className='contact__info-item' data-aos="fade-right" data-aos-delay={index * 100}>
                                             <div className='contact__info-item-icon-wrap' style={{ color: 'black' }}>
                                                  <img
                                                       src={icon.icon}
                                                       alt={icon.title}
                                                       width="22"
                                                       height="22"
                                                  />
                                             </div>
                                             <div>
                                                  <h4 className='contact__info-item-title'>{icon.title}</h4>
                                                  <p className='contact__info-item-text'>{icon.text}</p>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                              <ContactForm />
                         </div>

                    </div>
               </section>{(cartQuantity > 0) && !isCartOpen &&
                    <FloatingCartButton count={cartQuantity} onClick={openCart} />
               }

          </>
     );
};

export default MainPage;