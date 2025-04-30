import { useEffect } from 'react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import '../styles/my-lightbox.scss'; // Import your custom styles

const MyLightbox = ({ images }) => {
  useEffect(() => {
    const lightbox = GLightbox({
      selector: '.my-lightbox'
    });

    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <div className="my-lightbox__gallery">
    {images.map((img, index) => (
      <a
        href={img.full}
        className="my-lightbox"
        data-gallery="my-gallery"
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
