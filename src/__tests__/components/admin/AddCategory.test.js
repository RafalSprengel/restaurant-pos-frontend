import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddCategory from '../../../components/admin/AddCategory';

describe('AddCategory component', () => {
    let setFormData;
    let setShowErrorAlert;

    beforeEach(() => {
        setFormData = jest.fn();
        setShowErrorAlert = jest.fn();
    });

    test('handleChange updates formData correctly for text input', () => {
        const { getByLabelText } = render(<AddCategory setFormData={setFormData} setShowErrorAlert={setShowErrorAlert} />);
        const nameInput = getByLabelText('Category Name');

        fireEvent.change(nameInput, { target: { name: 'name', value: 'New Category' } });

        expect(setFormData).toHaveBeenCalledWith(expect.objectContaining({
            name: 'New Category'
        }));
        expect(setShowErrorAlert).toHaveBeenCalledWith(false);
    });

    test('handleChange updates formData correctly for file input', () => {
        const { getByLabelText } = render(<AddCategory setFormData={setFormData} setShowErrorAlert={setShowErrorAlert} />);
        const fileInput = getByLabelText('Category Image');
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(setFormData).toHaveBeenCalledWith(expect.objectContaining({
            image: file
        }));
        expect(setShowErrorAlert).toHaveBeenCalledWith(false);
    });

    test('handleChange resets error alert', () => {
        const { getByLabelText } = render(<AddCategory setFormData={setFormData} setShowErrorAlert={setShowErrorAlert} />);
        const nameInput = getByLabelText('Category Name');

        fireEvent.change(nameInput, { target: { name: 'name', value: 'New Category' } });

        expect(setShowErrorAlert).toHaveBeenCalledWith(false);
    });
});
