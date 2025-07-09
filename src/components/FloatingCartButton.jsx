import React from 'react';
import { IconShoppingCart } from '@tabler/icons-react';
import '../styles/floating-cart-button.scss'

export default function FloatingCartButton({ count, onClick }) {
  return (
    <div className="floating-cart-button" onClick={onClick}>
        <IconShoppingCart size={42} color="white" />
      {count > 0 && <span className="floating-cart-count">{count}</span>}
    </div>
  );
}
