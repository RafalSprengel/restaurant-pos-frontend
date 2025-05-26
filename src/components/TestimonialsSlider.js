import React, { useState, useEffect, useRef } from "react";
import '../styles/testimonials-slider.scss';

export default function TestimonialsSlider({ data }) {
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

    const mediumScreen = 900;
    const largeScreen = 1280;

    let slideWidth = windowWidth < mediumScreen ? 100 : windowWidth < largeScreen ? 50 : 33.33;

    // Swipe / drag obsługa
    const startX = useRef(0);
    const isDragging = useRef(false);
    const deltaX = useRef(0);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        isDragging.current = true;
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        deltaX.current = e.touches[0].clientX - startX.current;
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;

        if (deltaX.current > 50 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else if (deltaX.current < -50 && currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }

        deltaX.current = 0;
        isDragging.current = false;
        resetAutoSlide();
    };

    const handleMouseDown = (e) => {
        startX.current = e.clientX;
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        deltaX.current = e.clientX - startX.current;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;

        if (deltaX.current > 50 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else if (deltaX.current < -50 && currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }

        deltaX.current = 0;
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        resetAutoSlide();
    };

    return (
        <div className="testimonial-slider__wrap">
            <div
                className="testimonial-slider__track"
                style={{
                    width: `${data.length * 100}%`,
                    transform: `translateX(-${currentIndex * (slideWidth / data.length)}%)`,
                    transition: 'transform 0.5s ease-in-out'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
            >
                {data.map((el, index) => (
                    <div
                        key={index}
                        className="testimonial-slider__slide"
                        style={{ width: `${slideWidth / data.length}%` }}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="testimonial-slider__slide-quote">
                            <i className="testimonial-slider__slide-quote-mark">"</i>
                            {el.quote}
                            <i className="testimonial-slider__slide-quote-mark">"</i>
                        </div>
                        <div className="testimonial-slider__slide-profile">
                            <img src={el.image} className="testimonial-slider__slide-profile-image" />
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
                {data.map((_, index) => (
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
