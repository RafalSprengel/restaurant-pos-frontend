import React, { useState } from 'react';
import '../styles/Form.css'; // Upewnij się, że masz odpowiedni plik CSS dla stylów

const Form = () => {
    const [formData, setFormData] = useState({
        city: '',
        street: '',
        houseNo: ''
    });

    const [errors, setErrors] = useState({
        city: '',
        street: '',
        houseNo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Sprawdź, czy pole jest puste
        if (!value.trim()) {
            setErrors({
                ...errors,
                [name]: 'To pole nie może być puste'
            });
        } else {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            city: !formData.city.trim() ? 'To pole nie może być puste' : '',
            street: !formData.street.trim() ? 'To pole nie może być puste' : '',
            houseNo: !formData.houseNo.trim() ? 'To pole nie może być puste' : ''
        };

        setErrors(newErrors);

        // Sprawdź, czy są jakieś błędy
        const isError = Object.values(newErrors).some(error => error !== '');

        if (!isError) {
            // Wyślij dane formularza
            console.log('Formularz wysłany:', formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label htmlFor="city">Miasto</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                />
                {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="street">Ulica</label>
                <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                />
                {errors.street && <span className="error">{errors.street}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="houseNo">Numer domu</label>
                <input
                    type="text"
                    id="houseNo"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleChange}
                />
                {errors.houseNo && <span className="error">{errors.houseNo}</span>}
            </div>

            <button type="submit" className="button">Wyślij</button>
        </form>
    );
};

export default Form;
