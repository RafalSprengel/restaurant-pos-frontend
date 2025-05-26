import React, { useState } from "react";
import Modal from '../components/Modal.js';
import "../styles/table-booking-form.scss";
import '../styles/mantine-overrides.scss'
import { useFetch } from '../hooks/useFetch.js';
import api from '../utils/axios';
import { useForm } from '@mantine/form';
import {
    TextInput,
    Select,
    Textarea,
    Button,
    Group,
    Grid
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

export default function TableBookingForm() {
    const [isSuccessfulModalOpen, setIsSuccessfulModalOpen] = useState(false);
    const { data: tablesData } = useFetch('/tables');

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            date: null,
            time: '',
            table: '',
            message: ''
        },
        validate: {
            name: (value) => (value.trim() === '' ? 'Name is required' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => (/^\d{5,}$/.test(value) ? null : 'Phone must have at least 5 digits'),
            date: (value) => (!value ? 'Date is required' : null),
            time: (value) => (!value || value.trim() === '' ? 'Time slot is required' : null),
            table: (value) => (!value || value.trim() === '' ? 'Table selection is required' : null),
        },
    });

    const availabilityUrl = form.values.date && form.values.table
        ? `/tables/availability?date=${form.values.date}&tableNumber=${form.values.table}`
        : null;

    const { data: timeSlotsData } = useFetch(availabilityUrl);

    const tablesOption = tablesData?.map((el) => ({
        value: el.tableNumber.toString(),
        label: `No.${el.tableNumber} ${el.location} for ${el.capacity} people`
    }));

    const slotsOption = timeSlotsData?.slots.map((slot) => {
        const date = new Date(slot.time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        return {
            value: time,
            label: `${time} ${!slot.available ? 'Unavailable' : ''}`,
            disabled: !slot.available
        };
    });

    const handleSubmit = async (values) => {
        try {
            const response = await api.post('/tables/reservation', {
                tableNumber: values.table,
                reservedTime: values.time,
                reservedDate: values.date,
                customerDetails: {
                    name: values.name,
                    email: values.email,
                    phone: values.phone
                },
                message: values.message
            });

            if (response.status === 201) {
                form.reset();
                setIsSuccessfulModalOpen(true);
            }
        } catch (err) {
            console.error('Reservation failed:', err.response?.data?.error || err.message);
        }
    };

    return (
        <>
            <form className='table-booking-form__wrap' onSubmit={form.onSubmit(handleSubmit)}>

                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <TextInput
                            label="Your Name"
                            placeholder="Your Name"
                            {...form.getInputProps('name')}
                            styles={{
                                input: {
                                    borderColor: form.errors.name ? 'red' : undefined,
                                    color: form.errors.name ? 'red' : undefined,
                                },
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <TextInput
                            label="Your Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                            styles={{
                                input: {
                                    borderColor: form.errors.email ? 'red' : undefined,
                                    color: form.errors.email ? 'red' : undefined,
                                },
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <TextInput
                            label="Your Phone"
                            placeholder="12345"
                            {...form.getInputProps('phone')}
                            styles={{
                                input: {
                                    borderColor: form.errors.phone ? 'red' : undefined,
                                    color: form.errors.phone ? 'red' : undefined,
                                },
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Select
                            label="Table"
                            placeholder="Please select a table"
                            data={tablesOption || []}
                            {...form.getInputProps('table')}
                            styles={{
                                input: {
                                    borderColor: form.errors.table ? 'red' : undefined,
                                    color: form.errors.table ? 'red' : undefined,
                                },
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <DatePickerInput
                            label="Pick a date"
                            placeholder="Choose a date"
                            valueFormat="YYYY-MM-DD"
                            highlightToday
                            minDate={new Date()}
                            maxLevel='month'
                            {...form.getInputProps('date')}
                            styles={{
                                input: {
                                    borderColor: form.errors.date ? 'red' : undefined,
                                    color: form.errors.date ? 'red' : undefined,
                                },
                            }}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Select
                            label="Time Slot"
                            placeholder={form.values.date && form.values.table ? "Select time" : "Select date and table first"}
                            data={slotsOption || []}
                            {...form.getInputProps('time')}
                            disabled={!form.values.date || !form.values.table}
                            styles={{
                                input: {
                                    borderColor: form.errors.time ? 'red' : undefined,
                                    color: form.errors.time ? 'red' : undefined,
                                },
                            }}

                        />
                    </Grid.Col>
                </Grid>

                <Textarea
                    label="Your Message"
                    placeholder="Optional message"
                    rows={4}
                    {...form.getInputProps('message')}
                />
                    <Button type="submit" className='btn-accent-primary table-booking-form__btn'>Book a Table</Button>
            </form>

            <Modal isOpen={isSuccessfulModalOpen} close={() => setIsSuccessfulModalOpen(false)}>
                <div className='table-booking-form__modal-wrap'>
                    <h4 className='table-booking-form__modal-header'>Thank You for your reservation!</h4>
                    <div>Your table has been booked successfully</div>
                    <div className='table-booking-form__modal-details'>
                        <div>Date: {form.values.date}</div>
                        <div>Time: {form.values.time}</div>
                        <div>Table: {tablesOption?.find(el => el.value === form.values.table)?.label}</div>
                    </div>
                    <button
                        className='btn-accent-secondary table-booking-form__modal-button'
                        onClick={() => setIsSuccessfulModalOpen(false)}
                    >
                        Ok
                    </button>
                </div>
            </Modal>
        </>
    );
};