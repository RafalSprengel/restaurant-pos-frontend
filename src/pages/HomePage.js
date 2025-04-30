import { CheckCheck } from 'lucide-react'; //icons 'check-check';
import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import '../styles/home-page.scss';
import pizza from '../img/pizza.png';
import about from '../img/about.jpg';
import ImageSlider from '../components/ImageSlider.js'
import TestimonialsSlider from '../components/TestimonialsSlider.js';
import MyLightbox from '../components/MyLightbox.js';
import TeamMembersCards from '../components/TeamMembersCards.js';

export const MainPage = () => {
      const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch('/product-categories/');
      const navigate = useNavigate();
      const location = useLocation();
      const queryString = location.search;
      const { data: productsData, loading: productsLoading, error: productsError } = useFetch('/products/' + queryString);
      let products = productsData?.products || [];

      const[specialsActiveTab, setSpecialsActiveTab] = useState(0);

      const specialsTabs = [
          {
               tabName: 'Modi sit est',
               title: 'Architecto ut aperiam autem id',
               content: 'Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero.',
               image: '/img/homePage/tabs/specials-0.png'
          },
          {
               tabName: 'Unde praesentium sed',
               title: 'Et blanditiis nemo veritatis excepturi',
               content: 'Ea ipsum voluptatem consequatur quis est. Illum error ullam omnis quia et reiciendis sunt sunt est. Non aliquid repellendus itaque accusamus eius et velit ipsa voluptates. Optio nesciunt eaque beatae accusamus lerode pakto madirna desera vafle de nideran pal.',
               image: '/img/homePage/tabs/specials-1.png'
          },
          {
               tabName: 'Pariatur explicabo vel',
               title: 'Impedit facilis occaecati odio neque aperiam sit',
               content: 'Iure officiis odit rerum. Harum sequi eum illum corrupti culpa veritatis quisquam. Neque necessitatibus illo rerum eum ut. Commodi ipsam minima molestiae sed laboriosam a iste odio. Earum odit nesciunt fugiat sit ullam. Soluta et harum voluptatem optio quae.',
               image: '/img/homePage/tabs/specials-2.png'
          },
          {
               tabName: 'Nostrum qui quasi',
               title: 'Fuga dolores inventore laboriosam ut est accusamus laboriosam dolore',
               content: 'Eaque consequuntur consequuntur libero expedita in voluptas. Nostrum ipsam necessitatibus aliquam fugiat debitis quis velit. Eum ex maxime error in consequatur corporis atque. Eligendi asperiores sed qui veritatis aperiam quia a laborum inventore',
               image: '/img/homePage/tabs/specials-3.png'
          },
          {
               tabName: 'Iusto ut expedita aut',
               title: 'Est eveniet ipsam sindera pad rone matrelat sando reda',
               content: 'Exercitationem nostrum omnis. Ut reiciendis repudiandae minus. Omnis recusandae ut non quam ut quod eius qui. Ipsum quia odit vero atque qui quibusdam amet. Occaecati sed est sint aut vitae molestiae voluptate vel.',
               image: '/img/homePage/tabs/specials-4.png'
          }
     ];

     const eventsSliderData = [
          {
               title: 'Birthday Parties',
               price: '£120',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
               image: '/img/homePage/slider/events-slider-0.jpg'
          },
          {
               title: 'Custom Parties',
               price: '£99',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
               image: '/img/homePage/slider/events-slider-1.jpg'
          },
          {
               title: 'Corporate Events',
               price: '£189',
               content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
               image: '/img/homePage/slider/events-slider-2.jpg'
          }
     ]

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
        ]

     const handleSpecialsTabClick = (index) => {
          setSpecialsActiveTab(index);
     }

     const handleCategoryClick = (categoryName) => {
          const params = new URLSearchParams(location.search);
          params.forEach((value, key) => params.delete(key));
          params.set('category', categoryName);
          navigate('?' + params);
     };

     // useEffect(() => {
     //      const handleScrollToSection = () => {
     //        const hash = window.location.hash;
     //        if (hash) {
     //          const sectionId = hash.split('?')[0].substring(1); 
     //          const section = document.getElementById(sectionId);
     //          if (section) {
     //            section.scrollIntoView({ behavior: 'smooth' });
     //          }
     //        }
     //      };
      
     //      handleScrollToSection();
     //      window.addEventListener('hashchange', handleScrollToSection);
     //      return () => {
     //        window.removeEventListener('hashchange', handleScrollToSection);
     //      };
     //    }, []); 


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
               <section id="our-menu" className='our-menu'>
                    <div className="container our-menu__container">
                         <div className="our-menu__title">
                              <h2>OUR MENU</h2>
                              <p>Discover Our Delicious Menu</p>
                         </div>
                         <div className="our-menu__content">
                              <ul className='our-menu__categories-list'>
                                   <li>
                                        <a href="/#our-menu">All</a>
                                   </li>
                                   {categories?.map((cat, index)=>{
                                        return (
                                             <li key={index} className='our-menu__categories-list-item'>
                                                  <a onClick={()=>handleCategoryClick(cat.name)}>{cat.name}</a>
                                             </li>
                                        )
                                   })}
                              </ul>
                              <div className='our-menu__items'>

                                   {products?.map((product, index) => {
                                        return (
                                             <div key={index} className="our-menu__item">
                                                  <div className='our-menu__item-image-container'>
                                                       <img src={pizza} alt={product.name} className="our-menu__item-image" />
                                                  </div>
                                                  <div className='our-menu__item-content'>
                                                       <div className='our-menu__item-title-container'>
                                                            <h5 className='our-menu__item-title'>{product.name}</h5>
                                                            <span className='our-menu__item-dots'></span>
                                                            <span className='our-menu__item-price'>&#163;{product.price}</span>
                                                       </div>
                                                       <p className='our-menu__item-description font-italic-style'>{product.desc}</p>
                                                  </div>
                                             </div>
                                        )
                                   })}
                                  
                              </div>

                         </div>
                    </div>
               </section>
               <section id="specials" className="specials">
                    <div className='container specials__container'>
                    <div className="specials__title">
                              <h2>SPECJALS</h2>
                              <p>Check Our Specials</p>
                    </div>
                    <div className="specials__content">
                         <div className="specials__nav-tabs">
                              <ul className="specials__nav-tabs-list">
                                   {specialsTabs.map((tab, index) => (
                                        <li key={index} className={`specials__nav-tabs-item ${index === specialsActiveTab ? 'specials__nav-tabs-item--active' : ''}`} onClick={() => handleSpecialsTabClick(index)}>
                                             {tab.tabName}
                                        </li>
                                   ))}
                              </ul>
                         </div>
                         <div className="specials__item">
                              {specialsTabs
                              .filter((tab, index) => index === specialsActiveTab)
                              .map((tab, index) => (
                              <>
                                   <div className='specials__item-text'>
                                        <h4 className="specials__item-title">{tab.title}</h4>
                                        <p className="specials__item-description font-italic-style">{tab.content}</p>
                                   </div>
                                   <div className='specials__item-image'>
                                        <img src={tab.image} alt="specials" className="specials__item-image" />
                                   </div>
                              </>
                              ))}
                              
                         </div>
                    </div>
                    </div>
               </section>
               <section id="events" className="events">
                    <div className='events__slider-wrapper container'>
                         <ImageSlider data={eventsSliderData} />
                    </div>
               </section>
               <section id="book-a-table" className="book-a-table">
                    <div className='container book-a-table__container'>
                         <div className="book-a-table__title">
                                   <h2>RESERVATION</h2>
                                   <p>Book A Table</p>
                         </div>
                         <div className='book-a-table__content'>
                              <div className='book-a-table__form-wrap'>
                                   <div className='book-a-table__form-group'>
                                        <input type='text' placeholder='Your Name' className='book-a-table__form-field' />
                                        <input type='text' placeholder='Your Email' className='book-a-table__form-field' />
                                        <input type='text' placeholder='Your Phone' className='book-a-table__form-field'/>
                                        <input type='date' placeholder='dd:mm:rr' className='book-a-table__form-field'/>
                                        <input type='time' placeholder='--:--' className='book-a-table__form-field'/>
                                        <input type='number' placeholder='#of People' className='book-a-table__form-field'/>
                                   </div>
                                   <textarea placeholder='Your Message' rows="6" className='book-a-table__form-field'></textarea>
                                   <button className='btn-accent-primary book-a-table__form-btn'>Book a Table</button>
                              </div>
                         </div>

                    </div>

               </section>
               <section id="testimonials" className='testimonials'>
                    <div className='container testimonials__container'>
                         <div className="testimonials__title">
                              <h2>TESTIMONIALS</h2>
                              <p>What they're saying about us</p>
                         </div>
                         <TestimonialsSlider  data={testimonialData}/>
                    </div>
               </section>

               <section id="gallery" className='gallery'>
                    <div className='gallery__container container'>
                         <div className="gallery__title">
                              <h2>GALLERY</h2>
                              <p>Some photos from Our Restauranty</p>
                         </div>
                         <div className='gallery__content'>
                              
                         </div>
                    </div>
                    <MyLightbox images={lightboxImages}/>
               </section>
               <section id='our-team' className='our-team'>
                    <div className='container our-team__container'>
                         <div className="our-team__title">
                              <h2>OUR TEAM</h2>
                              <p>Meet Our Team</p>
                         </div>
                         <div className='our-team__content'>
                              <TeamMembersCards data={teamData}/>
                         </div>
                    </div>
               </section>
               <section id="contact" className='contact'>
                    <div className='container contact__container'>
                         <div className="contact__title">
                              <h2>CONTACT</h2>
                              <p>Get in Touch</p>
                         </div>
                         <div className='contact__map'>
                              <iframe
                              style={{ border: 0, width: "100%", height: "400px" }}
                              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-0.1365!3d53.7676!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487b207957e1b087%3A0xa9839c8d05f31a29!2sHull%2C%20UK!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus&zoom=14"
                              frameBorder="0"
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                         </div>


                         <div className='contact__content'>
                              <div className='contact__info'>
                                   {contactIcons.map((icon, index) => (
                                        <div key={index} className='contact__info-item'>
                                             <div className='contact__info-item-icon-wrap' style={{color: 'black'}}>
                                                  <img
                                                       src={icon.icon}
                                                       alt={icon.title}
                                                       width="32"
                                                       height="32"
                                                  />
                                             </div>
                                             <div>
                                                  <h4 className='contact__info-item-title'>{icon.title}</h4>
                                                  <p className='contact__info-item-text'>{icon.text}</p>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                              <div className='contact__form'>
                                   <div className='contact__form-group'>
                                        <input type='text' placeholder='Your Name' className='contact__form-field' />
                                        <input type='text' placeholder='Your Email' className='contact__form-field' />
                                   </div>
                                   <div className='contact__form-group'>
                                        <input type='text' placeholder='Subject' className='contact__form-field' /> 
                                   </div>
                                        <textarea placeholder='Your Message' rows="6" className='contact__form-field'></textarea>
                                        <button className='btn-accent-primary contact__form-btn'>Send Message</button>
                              </div>
                         </div>

                    </div>

               </section>
          </>
     );
};

export default MainPage;
