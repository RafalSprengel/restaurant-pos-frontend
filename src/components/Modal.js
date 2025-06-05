import { useRef } from 'react';
import '../styles/modal.scss';

export default function Modal({ isOpen, close, children }) {
     const overlay = useRef();
     const handleClickOnLayer = (e) => {
          if (e.target === overlay.current) close();
     };

     return (
          <>
               {isOpen && (
                    <div className="custom-modal__overlay" ref={overlay} onClick={handleClickOnLayer}>
                         <div className="custom-modal__main">{children}</div>
                    </div>
               )}
          </>
     );
}
