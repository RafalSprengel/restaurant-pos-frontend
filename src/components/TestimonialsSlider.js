import React, {useState, useEffect,useRef} from "react";
import '../styles/testimonials-slider.scss'

export default function TestimonialsSlider({data}){

   
       const [currentIndex, setCurrentIndex] = useState(0);
       const intervalRef = useRef(null);
       const [windowWidth, setWindowWidth] = useState(window.innerWidth);
   
       const startAutoSlide = () => {
           intervalRef.current = setInterval(() => {
               setCurrentIndex(prevIndex =>
                   prevIndex === data.length - 1 ? 0 : prevIndex + 1
               );
           }, 5000);
       };
   
       const resetAutoSlide = () => {
           clearInterval(intervalRef.current);
           startAutoSlide();
       };
   
       const handlePaginationClick = (index) => {
           setCurrentIndex(index);
           resetAutoSlide(); 
       };
   
       useEffect(() => {
           startAutoSlide();
           return () => clearInterval(intervalRef.current);
       }, []);
       
       
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


   // const slideWidth = windowWidth < 700 ? 100 / data.length : 33.33 / data.length;
    //const translateX = windowWidth < 700 ? (currentIndex * (100 / data.length)) : (currentIndex * (33.33 / data.length));

    // let slidewidth;
    // if(windowWidth < 1000 ) slidewidth=50
    // else if(windowWidth < 700) slidewidth=100;
    // else slidewidth= 33.33
    const mediumScreen = 900;
    const largeScreen = 1280;

    let slideWidth = windowWidth < mediumScreen ? 100 : windowWidth < largeScreen ? 50 : 33.33;

       return (
           <div className="testimonial-slider__wrap">
               <div
                   className="testimonial-slider__track"
                   style={{
                    width: `${data.length*100}%`,
                    transform: `translateX(-${currentIndex * ( slideWidth/data.length)}%)` }}
               >
                   {data.map((el, index) => (
                       <div
                           key={index}
                           className="testimonial-slider__slide"
                            style={{ width: `${slideWidth/data.length}%` }}
                       >
                            <div className="testimonial-slider__slide-quote">
                                <i className="testimonial-slider__slide-quote-mark">"</i>
                                {el.quote}
                                <i className="testimonial-slider__slide-quote-mark">"</i>
                            </div>
                            <div className="testimonial-slider__slide-profile">
                                <img src={el.image} className="testimonial-slider__slide-profile-image"></img>
                                <span className="testimonial-slider__slide-profile-name">
                                    {el.name}
                                </span>
                                <span className="testimonial-slider__slide-profile-profession">
                                    {el.profession}
                                </span>
                            </div>
                       </div>
                   ))}
               </div>
               <div className='testimonial-slider__pagination'>
                   {data.map((el, index) => (
                       <span
                           key={index}
                           className={'testimonial-slider__pagination-bullet ' + (index === currentIndex ? 'testimonial-slider__pagination-bullet--active' : '')}
                           onClick={() => handlePaginationClick(index)}
                       ></span>
                   ))}
               </div>
           </div>
       );
}