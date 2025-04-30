import React, { useState, useEffect, useRef } from 'react';
import '../styles/image-slider.scss';

export default function ImageSlider({ data }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

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

    return (
        <div className="imageSlider__wrap">
            <div
                className="imageSlider__track"
                style={{ transform: `translateX(-${currentIndex * (100 / data.length)}%)` }}
            >
                {data.map((event, index) => (
                    <div
                        key={index}
                        className="imageSlider__slide"
                        style={{ width: `${100 / data.length}%` }}
                    >
                        <div className="imageSlider__slide-image-container">
                            <img src={event.image} alt="events" className="imageSlider__slide-image" />
                        </div>
                        <div className="imageSlider__slide-content">
                            <h3 className="imageSlider__slide-header">{event.title}</h3>
                            <span className="imageSlider__slide-price">{event.price}</span>
                            <div className="imageSlider__slide-description">{event.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='imageSlider__pagination'>
                {data.map((el, index) => (
                    <span
                        key={index}
                        className={'imageSlider__pagination-bullet ' + (index === currentIndex ? 'imageSlider__pagination-bullet--active' : '')}
                        onClick={() => handlePaginationClick(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}
