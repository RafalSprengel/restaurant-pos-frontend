import config from "../config";
import Modal from '../components/Modal.js';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import './productCard.scss';
import { Skeleton } from '@mantine/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function ProductCard({ currentProduct: product, isOpen, close }) {
    const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity, openCart } = useShoppingCart();

    const handleSubmit = () => {
        close();
        openCart();
    };

    if (!product) {
        console.error('Product information is missing.');
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <div className="product-card">
                <LazyLoadImage
                    src={`${config.API_URL}${product.thumbnail}`}
                    alt={product.name}
                    className="product-card__image"
                      wrapperClassName="product-card__image-wrapper"
                    placeholder={
                        <Skeleton height={100} width={350} animate={true} />
                    }
                    effect="blur"
                />
                <div className="product-card__content">
                    <div className="product-card__name">{product.name}</div>
                    {product.desc && <div className="product-card__description">{product.desc}</div>}
                    <div className="product-card__price">£{product.price}</div>
                    <div className='product-card__counter'>
                        <span className="product-card__counter--minus"
                            onClick={() => decreaseCartQuantity(product)}
                        >
                            -
                        </span>
                        <span className='product-card__counter--quantity'>
                            {getItemQuantity(product._id)}
                        </span>
                        <span className='product-card__counter--plus'
                            onClick={() => increaseCartQuantity(product)}
                        >
                            +
                        </span>
                    </div>
                    <div className="product-card__actions">
                        <button
                            type="button"
                            className="product-card__button product-card__button--back"
                            onClick={close}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="product-card__button product-card__button--submit"
                            onClick={handleSubmit}
                        >
                            Go to cart
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    );
};