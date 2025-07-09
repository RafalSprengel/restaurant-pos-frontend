import { useState, useEffect } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import { useAuth } from '../context/authContext.js';
import api from '../utils/axios';
import '../styles/checkout.scss';

export default function Checkout() {
  const { cartItems, cartSummaryPrice } = useShoppingCart();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const [orderData, setOrderData] = useState({
    customerInfo: { name: '', surname: '', phone: '', email: '' },
    deliveryTime: { selectedOption: 1, hour: '16:30' },
    deliveryMethod: 2,
    deliveryAddress: { city: '', street: '', houseNo: '', flatNo: '', floor: '' },
    orderNote: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: '', surname: '', phone: '', email: '', city: '', street: '', houseNo: '',
  });

  const validateField = (val, regex) => regex.test(val);

  const handleCustomerInputChange = (e) => {
    setShowErrorMessage(false);
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, [name]: value },
    }));

    let error = '';
    if (!value.trim()) {
      error = 'This field cannot be empty';
    } else if (name === 'email' && !validateField(value, /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/)) {
      error = 'Please enter a valid email';
    }

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleDeliveryTimeOption = (selectedOption) => {
    setOrderData((prev) => ({
      ...prev,
      deliveryTime: { ...prev.deliveryTime, selectedOption },
    }));
  };

  const handleDeliveryHourChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      deliveryTime: { ...prev.deliveryTime, hour: e.target.value },
    }));
  };

  const handleDeliveryMethodChange = (method) => {
    setOrderData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  const handleAddressInputChange = (e) => {
    setShowErrorMessage(false);
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      deliveryAddress: { ...prev.deliveryAddress, [name]: value },
    }));

    let error = '';
    if (!value.trim()) {
      error = 'This field cannot be empty';
    } else if (!validateField(value, /^[a-zA-Z0-9-\sąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/)) {
      error = 'This field may only contain letters, numbers, and hyphens';
    }

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleNoteChange = (e) => {
    setOrderData((prev) => ({ ...prev, orderNote: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields =
      orderData.deliveryMethod === 1
        ? {
            name: !orderData.customerInfo.name.trim() ? 'This field cannot be empty' : fieldErrors.name,
            surname: !orderData.customerInfo.surname.trim() ? 'This field cannot be empty' : fieldErrors.surname,
            phone: !orderData.customerInfo.phone.trim() ? 'This field cannot be empty' : fieldErrors.phone,
            email: !orderData.customerInfo.email.trim() ? 'This field cannot be empty' : fieldErrors.email,
            city: !orderData.deliveryAddress.city.trim() ? 'This field cannot be empty' : fieldErrors.city,
            street: !orderData.deliveryAddress.street.trim() ? 'This field cannot be empty' : fieldErrors.street,
            houseNo: !orderData.deliveryAddress.houseNo.trim() ? 'This field cannot be empty' : fieldErrors.houseNo,
          }
        : {
            name: !orderData.customerInfo.name.trim() ? 'This field cannot be empty' : fieldErrors.name,
            surname: !orderData.customerInfo.surname.trim() ? 'This field cannot be empty' : fieldErrors.surname,
            phone: !orderData.customerInfo.phone.trim() ? 'This field cannot be empty' : fieldErrors.phone,
            email: !orderData.customerInfo.email.trim() ? 'This field cannot be empty' : fieldErrors.email,
            city: '', street: '', houseNo: '',
          };

    setFieldErrors(requiredFields);

    const hasErrors = Object.values(requiredFields).some((e) => e !== '');
    if (hasErrors) {
      setShowErrorMessage(true);
      return;
    }

    const itemsToSend = cartItems.map((item) => ({ id: item._id, quantity: item.quantity }));

    try {
      const response = await api.post('/stripe/create-checkout-session', {
        items: itemsToSend,
        customerId: user?._id,
        customer: orderData.customerInfo,
        deliveryAddress: orderData.deliveryMethod === 1 ? orderData.deliveryAddress : undefined,
        note: orderData.orderNote,
        orderType:
          orderData.deliveryMethod === 1 ? 'delivery' : orderData.deliveryMethod === 2 ? 'pickup' : 'dine-in',
        orderTime: orderData.deliveryTime.selectedOption === 2 ? orderData.deliveryTime.hour : null,
        successUrl: `${window.location.origin}/order/success`,
        cancelUrl: `${window.location.origin}/order/cancel`,
        isGuest: !isAuthenticated,
      });

      if (response.status === 200) {
        window.location = response.data.url;
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      setOrderData((prev) => ({
        ...prev,
        customerInfo: {
          name: user.name || '',
          surname: user.surname || '',
          phone: user.phone || '',
          email: user.email || '',
        },
      }));
    }
  }, [user]);

  return (
      <form className="checkout" onSubmit={handleSubmit}>
        <div className="checkout__form">
          <h5>{user?.name || 'Guest'}</h5>
          <h3>Order Options</h3>

          {showErrorMessage && <div className="error-message">Please fill in all required fields</div>}

          <div className="checkout__form__user">
            {['name', 'surname', 'phone', 'email'].map((field) => (
              <div className="checkout__form__field" key={field}>
                <label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}:</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  onChange={handleCustomerInputChange}
                  value={orderData.customerInfo[field]}
                  disabled={field === 'email' && isAuthenticated}
                />
                {fieldErrors[field] && <span className="error">{fieldErrors[field]}</span>}
              </div>
            ))}
          </div>

          <div className="checkout__form__orderTime">
            <label className="formFieldWrap">
              <input
                type="radio"
                name="orderTime"
                value="1"
                checked={orderData.deliveryTime.selectedOption === 1}
                onChange={() => handleDeliveryTimeOption(1)}
              />
              ASAP
            </label>

            <label className="formFieldWrap">
              <input
                type="radio"
                name="orderTime"
                value="2"
                checked={orderData.deliveryTime.selectedOption === 2}
                onChange={() => handleDeliveryTimeOption(2)}
              />
              Time:
              <input
                type="time"
                min="10:00"
                max="22:00"
                value={orderData.deliveryTime.hour}
                onChange={handleDeliveryHourChange}
                disabled={orderData.deliveryTime.selectedOption !== 2}
              />
            </label>
          </div>

          <div className="checkout__form__deliveryType">
            {[{ val: 1, label: 'Delivery' }, { val: 2, label: 'Pickup' }, { val: 3, label: 'Dine-in' }].map((opt) => (
              <label className="formFieldWrap" key={opt.val}>
                <input
                  type="radio"
                  name="delivery"
                  value={opt.val}
                  checked={orderData.deliveryMethod === opt.val}
                  onChange={() => handleDeliveryMethodChange(opt.val)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {orderData.deliveryMethod === 1 && (
            <div className="checkout__form__address">
              {['city', 'street', 'houseNo'].map((field) => (
                <div className="checkout__form__field" key={field}>
                  <label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}:</label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    onChange={handleAddressInputChange}
                    value={orderData.deliveryAddress[field]}
                  />
                  {fieldErrors[field] && <span className="error">{fieldErrors[field]}</span>}
                </div>
              ))}
            </div>
          )}

          <div className="checkout__form__note">
            <label htmlFor="note">Order Note:</label>
            <textarea
              id="note"
              name="note"
              onChange={handleNoteChange}
              value={orderData.orderNote}
              rows={3}
            ></textarea>
          </div>

          <div className="checkout__form__total">
            <span>Total:</span>
            <strong>{cartSummaryPrice()} zł</strong>
          </div>

          <div className="checkout__form__submit">
            <button type="submit">Place Order</button>
          </div>
        </div>
      </form>
  );
}
