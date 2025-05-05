import { useRef } from 'react';
import '../styles/modal-confirm.scss';

export default function ModalConfirm({ isOpen, close, children, onConfirm }) {
     const layer = useRef();

     const handleClickOnLayer = (e) => {
          if (e.target === layer.current) close();
     };

     return (
          <>
               {isOpen && (
                    <div className="customModal" ref={layer} onClick={handleClickOnLayer}>
                         <div className="customModal__main">
                              {children}
                              <div className="customModal__buttons">
                                   <button className="customModal__button customModal__button--cancel" onClick={close}>
                                        Cancel
                                   </button>
                                   <button
                                        className="customModal__button customModal__button--confirm"
                                        onClick={() => {
                                             onConfirm();
                                             close();
                                        }}>
                                        Confirm
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
}
