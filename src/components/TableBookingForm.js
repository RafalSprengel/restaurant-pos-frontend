import React, { useEffect, useState } from "react";
import "../styles/table-booking-form.scss";
import { useFetch } from '../hooks/useFetch.js';
import Select from 'react-select';

export default function TableBookingForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        timeSlotOption: '',
        tableOption: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState()
    const { data: tablesData, loading: loadingTablesData, error: fetchTablesDataError, refetch: refetchTablesData } = useFetch('/tables');

    const availabilityUrl = formData.date && formData.tableOption
        ? `/tables/availability?date=${formData.date}&tableNumber=${formData.tableOption.value}`
        : null;

    const { data: timeSlotsData, loading: loadingTimeSlots, error: fetchTimeSlotsError, refetch: refetchTimeSlots } = useFetch(availabilityUrl);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleTableChange = (option) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            timeSlotOption: '',
            tableOption: option
        }));
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            timeSlotOption: '',
            date: value
        }));
    };

    const handleTimeChange = (option) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            timeSlotOption: option
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        for (let key in formData) {
            if (formData[key].trim() === '') {
                errors[key] = 'This field must be filled';
            }
        }

        setFormErrors(errors);
    };

    const customSelectStyles = {
        container: (base) => ({
            ...base,
            flex: '1 1 31%',
            fontSize: '1.1rem',
        }),
        control: (base) => ({
            ...base,
            backgroundColor: '#0c0b09',
            color: '#fff',
            borderColor: '#555',
            height: '100%',
            padding: '15px 10px',
            borderRadius: '0'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#333' : '#222',
            color: state.isDisabled ? '#777' : '#fff',
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#222'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#fff'
        })
    };

    let slotsOption = timeSlotsData?.slots.map((slot) => {
        const date = new Date(slot.time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return {
            value: hours + ':' + minutes,
            label: hours + ':' + minutes + ' ' + ((!slot.available) ? 'Unavailable' : ''),
            isDisabled: !slot.available
        };
    });

    let tablesOption = tablesData?.map((el) => {
        return ({
            value: el.tableNumber,
            label: 'No.' + el.tableNumber + ' ' + el.location + ' for ' + el.capacity + ' people'
        });
    });

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

                <div
                    data-aos='fade-up'
                    data-aos-delay="300"
                    data-aos-duration="400"
                    className='table-booking-form__field'
                    style={{ zIndex: 2 }}
                >
                    <Select
                        name="tableOption"
                        value={formData.tableOption}
                        onChange={(option) => handleTableChange(option)}
                        required
                        onInvalid={(e) => e.target.setCustomValidity('Please select a table')}
                        onInput={(e) => e.target.setCustomValidity("")}
                        options={tablesOption}
                        styles={customSelectStyles}
                        placeholder={"Please select a table"}
                    />
                </div>

                <input
                    type='date'
                    name='date'
                    placeholder='dd:mm:rr'
                    value={formData.date}
                    onChange={handleDateChange}
                    className='table-booking-form__field'
                    data-aos='fade-up'
                    data-aos-delay="300"
                    data-aos-duration="400"
                    required
                    onInvalid={(e) => e.target.setCustomValidity('Please provide date')}
                    onInput={(e) => e.target.setCustomValidity("")}
                />
                <div
                    data-aos='fade-up'
                    data-aos-delay="300"
                    data-aos-duration="400"
                    className='table-booking-form__field'
                    style={{ zIndex: 1 }}
                >
                    <Select
                        name="timeSlotOption"
                        value={formData.timeSlotOption}
                        onChange={(option) => handleTimeChange(option)}
                        required
                        isDisabled={!formData.date || !formData.tableOption}
                        onInvalid={(e) => e.target.setCustomValidity('Please provide time')}
                        onInput={(e) => e.target.setCustomValidity("")}
                        options={slotsOption}
                        styles={customSelectStyles}
                        placeholder={formData.date && formData.tableOption ? "Select time" : "Please select the date and table first"}
                    />
                </div>
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
    );
}