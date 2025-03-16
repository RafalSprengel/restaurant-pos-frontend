import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import {useAuth} from '../context/authContext.js';
import api from '../utils/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Checkout.scss';

export default function Checkout() {
    const { cartItems, cartSummaryPrice } = useShoppingCart();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
   const { isAuthenticated, user} = useAuth();
   
    const [order, setOrder] = useState({
        customer: {
            name: '',
            surname:'',
            phone:'',
            email: '',
        },
        time: { option: 1, hour: '16:30' },
        delivery: 2,
        address: { city: '', street: '', houseNo: '', flatNo: '', floor: '' },
        note: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        surname: '',
        phone:'',
        email: '',
        city: '',
        street: '',
        houseNo: '',
    });

    const validateField = (val, regex) => regex.test(val);

    const handleCustomerFieldChange = (e) => {
        setShowErrorMessage(false);
        const { name, value } = e.target;
        setOrder((order) => ({ ...order, customer: { ...order.customer, [name]: value } }));

        let error = '';
        if (!value.trim()) {
            error = 'This field cannot be empty';
        } else if (name === 'email' && !validateField(value, /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/)) {
            error = 'Please enter a valid email';
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleTimeOption = (option) => {
        setOrder((order) => ({ ...order, time: { option, hour: order.time.hour } }));
    };

    const handleHourOption = (e) => {
        setOrder((order) => ({ ...order, time: { ...order.time, hour: e.target.value } }));
    };

    const handlePlaceOption = (option) => {
        setOrder((order) => ({ ...order, delivery: option }));
    };

    const handleAddressFieldChange = (e) => {
        setShowErrorMessage(false);
        const { name, value } = e.target;
        setOrder((order) => ({ ...order, address: { ...order.address, [name]: value } }));

        let error = '';
        if (!value.trim()) {
            error = 'This field cannot be empty';
        } else if (!validateField(value, /^[a-zA-Z0-9-\sąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/)) {
            error = 'This field may only contain letters, numbers, and hyphens';
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleNoteChange = (e) => {
        setOrder((order) => ({ ...order, note: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields =
            order.delivery === 1
                ? {
                      // for delivery
                      name: !order.customer.name.trim() ? 'This field cannot be empty' : errors.name,
                      surname: !order.customer.surname.trim() ? 'This field cannot be empty' : errors.surname,
                      phone: !order.customer.phone.trim() ? 'This field cannot be empty' : errors.phone,
                      email: !order.customer.email.trim() ? 'This field cannot be empty' : errors.email,
                      city: !order.address.city.trim() ? 'This field cannot be empty' : errors.city,
                      street: !order.address.street.trim() ? 'This field cannot be empty' : errors.street,
                      houseNo: !order.address.houseNo.trim() ? 'This field cannot be empty' : errors.houseNo,
                  }
                : {
                      // for pickup and dine in
                      name: !order.customer.name.trim() ? 'This field cannot be empty' : errors.name,
                      surname: !order.customer.surname.trim() ? 'This field cannot be empty' : errors.surname,
                    phone: !order.customer.phone.trim() ? 'This field cannot be empty' : errors.phone,
                      email: !order.customer.email.trim() ? 'This field cannot be empty' : errors.email,
                      city: '',
                      street: '',
                      houseNo: '',
                  };
    
        setErrors(requiredFields);
    
        const hasErrors = Object.values(requiredFields).some((el) => el !== '');
    
        if (hasErrors) {
            setShowErrorMessage(true);
            return;
        } else {
            setShowErrorMessage(false);
        }
    
        const itemsToSend = cartItems.map((el) => ({ id: el._id, quantity: el.quantity }));
    
        try {
            const response = await api.post('/stripe/create-checkout-session', {
                items: [...itemsToSend],
                customerId: user?._id, //If registered user
                customer: { name: order.customer.name, surname: order.customer.surname, phone: order.customer.phone , email: order.customer.email },
                deliveryAddress:
                    order.delivery === 1
                        ? {
                              city: order.address.city,
                              street: order.address.street,
                              houseNo: order.address.houseNo,
                              flatNo: order.address.flatNo,
                              floor: order.address.floor,
                          }
                        : undefined,
                note: order.note,
                orderType: order.delivery === 1 ? 'delivery' : order.delivery === 2 ? 'pickup' : 'dine-in',
                orderTime: order.time.option === 2 ? order.time.hour : null,
                successUrl: `${window.location.origin}/order/success`,
                cancelUrl: `${window.location.origin}/order/cancel`,
                isGuest: !isAuthenticated,
            });
    
            const res = response.data;
    
            if (!response.status === 200) {
                console.error(res.error);
            } else {
                console.log('## line 150 Checkout')
                window.location = res.url;
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
     
        if (user) {
            setOrder((prevOrder) => ({
                ...prevOrder,
                customer: { name: user.name || '' , surname: user.surname || '' ,phone: user.phone || '' , email: user.email || '' },
            }));
        }
    }, [user]);


    return (
        <form className="checkout" onSubmit={handleSubmit}>
            <div className="checkout__form">
                <div style={{ display: 'flex', justifyContent: 'space-between', justifyContent: 'flex-end'}}>
                    <h5>
                        {user?.name || 'Guest'}
                        </h5>
                    </div>
                <div className="checkout__form__header">Order Options:</div>

                {showErrorMessage && <Alert variant="danger">Please fill in all required fields</Alert>}

                <div className="checkout__form__user">
                    <div className="checkout__form__field">
                        <label htmlFor="name">Name:</label>
                        <br></br>
                        <input type="text" id="name" name="name" onChange={handleCustomerFieldChange} value={order.customer.name} />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>
                    <div className="checkout__form__field">
                        <label htmlFor="surname">Surname:</label>
                        <br></br>
                        <input type="text" id="surname" name="surname" onChange={handleCustomerFieldChange} value={order.customer.surname} />
                        {errors.surname && <span className="error">{errors.surname}</span>}
                    </div>
                    <div className="checkout__form__field">
                        <label htmlFor="phone">Phone:</label>
                        <br></br>
                        <input type="text" id="phone" name="phone" onChange={handleCustomerFieldChange} value={order.customer.phone} />
                        {errors.phone && <span className="error">{errors.phone}</span>}
                    </div>
                    <div className="checkout__form__field">
                        <label htmlFor="email">Email:</label>
                        <br></br>
                        <input
                        type="email"
                        id="email"
                        name="email" 
                        disabled={isAuthenticated}
                        onChange={handleCustomerFieldChange}
                        value={order.customer.email} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                </div>

                <div className="checkout__form__orderTime">
                    <p>Order for:</p>
                    <div className={`formFieldWrap ${order?.time.option === 1 ? 'formFieldWrap--active' : ''}`} onClick={() => handleTimeOption(1)}>
                        <input id="asap" name="ASAP" type="radio" value="asap" onChange={() => null} checked={order?.time.option === 1} />
                        <label htmlFor="asap"> ASAP</label>
                    </div>
                    <div className={`formFieldWrap ${order?.time.option === 2 ? 'formFieldWrap--active' : ''}`} onClick={() => handleTimeOption(2)}>
                        <input id="time" name="orderTime" type="radio" value="time" onChange={() => null} checked={order?.time.option === 2} />
                        <label htmlFor="timeSlot">Scheduled Time</label>
                        {order?.time.option === 2 && (
                            <div className="checkout__form__orderTime__timeSlot">
                                <select value={order?.time.hour} onChange={handleHourOption}>
                                    <option value="15:00">15:00</option>
                                    <option value="15:30">15:30</option>
                                    <option value="16:00">16:00</option>
                                    <option value="16:30">16:30</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div className="checkout__form__orderPlace">
                    <div>Delivery Method:</div>
                    <div className={`formFieldWrap ${order?.delivery === 1 ? 'formFieldWrap--active' : ''}`} onClick={() => handlePlaceOption(1)}>
                        <input id="delivery" name="delivery" type="radio" value="delivery" onChange={() => null} checked={order?.delivery === 1} />
                        <label htmlFor="delivery">Delivery</label>
                    </div>
                    <div className={`formFieldWrap ${order?.delivery === 2 ? 'formFieldWrap--active' : ''}`} onClick={() => handlePlaceOption(2)}>
                        <input id="pickup" name="pickup" type="radio" value="pickup" onChange={() => null} checked={order?.delivery === 2} />
                        <label htmlFor="pickup">Pickup</label>
                    </div>
                    <div className={`formFieldWrap ${order?.delivery === 3 ? 'formFieldWrap--active' : ''}`} onClick={() => handlePlaceOption(3)}>
                        <input id="forHere" name="forHere" type="radio" value="forHere" onChange={() => null} checked={order?.delivery === 3} />
                        <label htmlFor="forHere">Dine In</label>
                    </div>
                </div>
                {order?.delivery === 1 && (
                    <div className="checkout__form__orderAddress">
                        <div className="checkout__form__orderAddress__city">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" onChange={handleAddressFieldChange} value={order?.address?.city} />
                            {errors.city && <span className="error">{errors.city}</span>}
                        </div>
                        <div className="checkout__form__orderAddress__group1">
                            <div className="checkout__form__orderAddress__group1__street">
                                <label htmlFor="street">Street</label>
                                <input type="text" id="street" onChange={handleAddressFieldChange} name="street" value={order?.address?.street} />
                                {errors.street && <span className="error">{errors.street}</span>}
                            </div>
                            <div className="checkout__form__orderAddress__group1__houseNumber">
                                <label htmlFor="houseNumber">House Number</label>
                                <input
                                    type="text"
                                    id="houseNumber"
                                    onChange={handleAddressFieldChange}
                                    name="houseNo"
                                    value={order?.address?.houseNo}
                                />
                                {errors.houseNo && <span className="error">{errors.houseNo}</span>}
                            </div>
                        </div>
                        <div className="checkout__form__orderAddress__group2">
                            <div className="checkout__form__orderAddress__group2__flatNumber">
                                <label htmlFor="flatNumber">Flat Number</label>
                                <input
                                    type="text"
                                    id="flatNumber"
                                    onChange={handleAddressFieldChange}
                                    name="flatNo"
                                    value={order?.address?.flatNo}
                                />
                            </div>
                            <div className="checkout__form__orderAddress__group2__floor">
                                <label htmlFor="floor">Floor</label>
                                <input type="text" id="floor" onChange={handleAddressFieldChange} name="floor" value={order?.address?.floor} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="checkout__form__note">
                    <label htmlFor="note">Order Notes</label>
                    <textarea rows="3" id="note" onChange={handleNoteChange} name="note" value={order.note} />
                </div>
            </div>
            <div className="checkout__summary">
                <div className="checkout__summary__header">Cart:</div>
                <div className="checkout__summary__content">
                    {cartItems.map((el, index) => (
                        <div className="checkout__summary__content__item" key={index}>
                            <div className="checkout__summary__content__item__name">{el.name}</div>
                            <div className="checkout__summary__content__item__spacer"></div>
                            <div className="checkout__summary__content__item__quantity">{el.quantity} X</div>
                            <div className="checkout__summary__content__item__price">&pound;{el.price}</div>
                        </div>
                    ))}
                </div>
                <div className="checkout__summary__price">
                    <div className="checkout__summary__price__name">TOTAL:</div>
                    <div className="checkout__summary__price__amount">{cartSummaryPrice()}</div>
                </div>
                <div className="checkout__summary__button">
                    <button type="submit" className="button-contained">
                        ORDER
                    </button>
                </div>
            </div>
        </form>
    );
}
