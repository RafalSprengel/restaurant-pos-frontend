import { useEffect } from 'react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import '../styles/my-lightbox.scss';

const MyLightbox = ({ images }) => {
  useEffect(() => {
    const lightbox = GLightbox({
      selector: '.my-lightbox__image-link'
    });

    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <div className="my-lightbox">
    {images.map((img, index) => (
      <a
        href={img.full}
        className="my-lightbox__image-link"
        data-gallery="my-gallery"
        data-aos="fade-up"
        data-aos-delay={index*100}
        key={index}
      >
        <img
          src={img.thumb}
          alt={`Picture ${index + 1}`}
          className="my-lightbox__image"
        />
      </a>
    ))}
  </div>
  
  );
};

export default MyLightbox;
