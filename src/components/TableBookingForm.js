import React, { useEffect, useState } from "react";
import "../styles/table-booking-form.scss"

export default function TableBookingForm() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        people: '',
        message: ''
    })

    const [formErrors, setFormErrors] = useState()

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value

        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        for (let key in formData) {
            if (formData[key].trim() === '') {
                errors[key] = 'This field must be filed'
            }
        }
        setFormErrors(errors)
    }


    useEffect(() => {
        console.log(formErrors)
    })

    return (
        <form className='table-booking-form__wrap' onSubmit={handleSubmit}>
            <div className='table-booking-form__group'>
                <input
                    type='text'
                    name='name'
                    placeholder='Your Name'
                    value={formData.name}
                    onChange={handleChange}
                    className='table-booking-form__field'
                    data-aos='fade-up'
                    required
                    onInvalid={(e) => e.target.setCustomValidity('Please provide your name')}
                    onInput={(e) => e.target.setCustomValidity("")}
                />
                <input
                    type='email'
                    name='email'
                    placeholder='Your Email'
                    value={formData.email}
                    onChange={handleChange}
                    className='table-booking-form__field'
                    data-aos='fade-up'
                    data-aos-delay="100"
                    data-aos-duration="400"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="table-booking-form__field"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="400"
                    required
                    pattern="^\d{5,}$"
                    onInvalid={(e) => e.target.setCustomValidity('Please provide your phone number')} 
                    onInput={(e) => e.target.setCustomValidity("")}
                />
                <input
                    type='date'
                    name='date'
                    placeholder='dd:mm:rr'
                    value={formData.date}
                    onChange={handleChange}
                    className='table-booking-form__field'
                    data-aos='fade-up'
                    data-aos-delay="300"
                    data-aos-duration="400"
                    required
                    onInvalid={(e) => e.target.setCustomValidity('Please provide date')}
                    onInput={(e) => e.target.setCustomValidity("")}
                />
                <input
                    type='time'
                    name='time'
                    placeholder='--:--'
                    value={formData.time}
                    onChange={handleChange}
                    className='table-booking-form__field'
                    data-aos='fade-up'
                    data-aos-delay="500"
                    data-aos-duration="400"
                    required
                    onInvalid={(e) => e.target.setCustomValidity('Please provide time')}
                    onInput={(e) => e.target.setCustomValidity("")}
                />
                <input
                    type='number'
                    name='people'
                    placeholder='#of People'
                    value={formData.people}
                    onChange={handleChange}
                    className='table-booking-form__field'
                    data-aos='fade-up'
                    data-aos-delay="600"
                    data-aos-duration="400"
                    required
                    onInvalid={(e) => e.target.setCustomValidity('Please provide amount of people')}
                    onInput={(e) => e.target.setCustomValidity("")}
                />
            </div>
            <textarea
                name='message'
                placeholder='Your Message'
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className='table-booking-form__field'
                data-aos='fade-up'
                data-aos-delay="700"
                data-aos-duration="400"
                required
            />
            <button
                type='submit'
                className='btn-accent-primary table-booking-form__btn'
                data-aos="fade-up"
                data-aos-delay="800"
                data-aos-duration="400"
            >
                Book a Table
            </button>
        </form>
    )
}
