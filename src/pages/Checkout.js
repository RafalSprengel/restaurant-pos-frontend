import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import { useAuth } from '../context/authContext.js';
import { useForm } from '@mantine/form';
import { useFetch } from '../hooks/useFetch.js';
import api from '../utils/axios';
import { TextInput, Textarea, Button, Radio, Group } from '@mantine/core';
import { IconAt, IconPhone, IconArrowBack } from '@tabler/icons-react';
import '../styles/checkout.scss';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartSummaryPrice } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const { data: customer } = useFetch('/customers/customer');
  const [isSubmittingOnProgress, setIsSubmittingOnProgress] = useState(false);


  const form = useForm({
    initialValues: {
      firstName: '',
      surname: '',
      phone: '',
      email: '',
      city: '',
      street: '',
      houseNo: '',
      flatNo: '',
      orderNote: '',
      deliveryMethod: '2',
      deliveryTimeOption: '1',
      deliveryTimeHour: '16:30',
    },
    validate: {
      firstName: (value) => (value.trim() ? null : 'This field is required'),
      surname: (value) => (value.trim() ? null : 'This field is required'),
      phone: (value) => (value.trim() ? null : 'This field is required'),
      email: (value) => (/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/.test(value) ? null : 'Please enter a valid email'),
      city: (value, values) => (values.deliveryMethod === '1' && !value.trim() ? 'This field is required' : null),
      street: (value, values) => (values.deliveryMethod === '1' && !value.trim() ? 'This field is required' : null),
      houseNo: (value, values) => (values.deliveryMethod === '1' && !value.trim() ? 'This field is required' : null),
    },
  });

  const handleSubmit = async (values) => {
    const itemsToSend = cartItems.map((item) => ({ id: item._id, quantity: item.quantity }));

    try {
      setIsSubmittingOnProgress(true);
      const response = await api.post('/stripe/create-checkout-session', {
        items: itemsToSend,
        purchaser: {
          firstName: values.firstName,
          surname: values.surname,
          phone: values.phone,
          email: values.email,
        },
        deliveryAddress:
          values.deliveryMethod === '1'
            ? {
              city: values.city,
              street: values.street,
              houseNo: values.houseNo,
              flatNo: values.flatNo,
            }
            : undefined,
        note: values.orderNote,
        orderType:
          values.deliveryMethod === '1'
            ? 'delivery'
            : values.deliveryMethod === '2'
              ? 'pickup'
              : 'dine-in',
        orderTime: values.deliveryTimeOption === '2' ? values.deliveryTimeHour : null,
        registered: isAuthenticated,
        successUrl: `${window.location.origin}/order/success`,
        cancelUrl: `${window.location.origin}/order/cancel`,
      });

      if (response.status === 200) {
        window.location = response.data.url;
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingOnProgress(false);
    }
  };

  useEffect(() => {
    if (customer) {
      form.setValues({
        ...form.values,
        firstName: customer.firstName || '',
        surname: customer.surname || '',
        phone: customer.phone || '',
        email: customer.email || '',
        city: customer.address?.city || '',
        street: customer.address?.street || '',
        houseNo: customer.address?.houseNo || '',
        flatNo: customer.address?.flatNo || '',
      });
    }

  }, [customer]);

  return (
    <form className="checkout" onSubmit={form.onSubmit(handleSubmit)}>
      <div className="checkout__form">
        <div className='checkout__top-bar'>
          <href className='checkout__back-link' onClick={() => navigate(-1)}><IconArrowBack size={22} />&nbsp;Back</href>
          <span className='checkout__user-name'>{customer?.firstName || 'Guest'}</span>
        </div>

        <h3 className='checkout__title'>Order Options</h3>

        <div className="checkout__user-details">
          <TextInput label="First Name" placeholder="First Name" {...form.getInputProps('firstName')} />
          <TextInput label="Surname" placeholder="Surname" {...form.getInputProps('surname')} />
          <TextInput label="Phone" placeholder="Phone" {...form.getInputProps('phone')} rightSection={<IconPhone size={16} />} />
          <TextInput label="Email" placeholder="Email" {...form.getInputProps('email')} rightSection={<IconAt size={16} />} disabled={isAuthenticated} />
        </div>


        <div className="checkout__order-time">
          <Radio.Group
            label="Delivery Time"
            {...form.getInputProps('deliveryTimeOption')}
          >
            <Group mt="xs">
              <Radio value="1" label="ASAP" />
              <Radio
                value="2"
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    Time:
                    <input
                      type="time"
                      min="10:00"
                      max="22:00"
                      value={form.values.deliveryTimeHour}
                      onChange={(e) => form.setFieldValue('deliveryTimeHour', e.target.value)}
                      disabled={form.values.deliveryTimeOption !== '2'}
                      style={{ width: 100, padding: '7px', borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  </div>
                }
              />
            </Group>
          </Radio.Group>
        </div>


        <div className="checkout__delivery-type">
          <Radio.Group
            label="Delivery Method"
            {...form.getInputProps('deliveryMethod')}
          >
            <Group mt="xs">
              <Radio value="1" label="Delivery" />
              <Radio value="2" label="Pickup" />
              <Radio value="3" label="Dine-in" />
            </Group>
          </Radio.Group>
        </div>

        {form.values.deliveryMethod === '1' && (
          <div className="checkout__delivery-address">
            <TextInput label="City" placeholder="City" {...form.getInputProps('city')} />
            <TextInput label="Street" placeholder="Street" {...form.getInputProps('street')} />
            <TextInput label="House No" placeholder="House No" {...form.getInputProps('houseNo')} />
            <TextInput label="Flat No" placeholder="Flat No" {...form.getInputProps('flatNo')} />
          </div>
        )}

        <div className="checkout__note">
          <Textarea label="Order Note" placeholder="Any special requests?" autosize minRows={3} {...form.getInputProps('orderNote')} />
        </div>

        <div className="checkout__total">
          <span>Total:</span>
          <strong>{cartSummaryPrice()} zł</strong>
        </div>

        <div className="checkout__actions">
          <Button
            type="submit"
            disabled={isSubmittingOnProgress}
            fullWidth
          >
            {isSubmittingOnProgress ? 'Processing...' : 'Place Order'}
          </Button>
          <Button type="button" onClick={() => navigate(-1)} fullWidth variant="outline">Cancel</Button>
        </div>
      </div>
    </form>
  );
}