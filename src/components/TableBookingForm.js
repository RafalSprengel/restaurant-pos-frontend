import React, { useState } from "react";
import Modal from "../components/Modal.js";
import "../styles/table-booking-form.scss";
import "../styles/mantine-overrides.scss";
import { useFetch } from "../hooks/useFetch.js";
import api from "../utils/axios";
import { useForm } from "@mantine/form";
import {
    TextInput,
    Select,
    Textarea,
    Button,
    Grid,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

export default function TableBookingForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sucessFullDetails, setSuccessfulDetails] = useState()
    const [errorDetails, setErrorDetails] = useState()
    const { data: tablesData } = useFetch("/tables/type-of-tables");

    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            date: null,
            time: "",
            table: "",
            message: "",
        },
        validate: {
            name: (value) => (value.trim() === "" ? "Name is required" : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            phone: (value) => /^\d{5,}$/.test(value) ? null : "Phone must have at least 5 digits",
            date: (value) => (!value ? "Date is required" : null),
            time: (value) =>
                !value || value.trim() === "" ? "Time slot is required" : null,
            table: (value) =>
                !value || value.trim() === "" ? "Table selection is required" : null,
        },
    });

    const availabilityUrl =
        form.values.date && form.values.table
            ? `/tables/availability?date=${form.values.date}&tableNumber=${form.values.table}`
            : null;

    const { data: timeSlotsData } = useFetch(availabilityUrl);

    const tablesOption = tablesData?.map((el) => ({
        value: el.tableNumber.toString(),
        label: `No.${el.tableNumber} ${el.location} for ${el.capacity} people`,
    }));

    const slotsOption = timeSlotsData?.slots.map((slot) => ({
        value: slot.time,
        label: `${slot.time} ${!slot.available ? "Unavailable" : ""}`,
        disabled: !slot.available,
    }));

    const handleSubmit = async (values) => {
        try {
            const response = await api.post("/tables/reservations", {
                tableNumber: values.table,
                reservedTime: values.time,
                reservedDate: values.date,
                customerDetails: {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                },
                message: values.message,
            });

            if (response.status === 201) {
                form.reset();
                setSuccessfulDetails(response.data)
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error(
                "Reservation failed:",
                err.response?.data?.error || err.message
            );
            setIsModalOpen(true);
            setErrorDetails(err.response?.data)
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setErrorDetails(null)
        setSuccessfulDetails(null)
    };

    return (
        <>
            <form className="table-booking-form__wrap" onSubmit={form.onSubmit(handleSubmit)}>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <div data-aos="fade-up" data-aos-duration="400">
                            <TextInput
                                label="Your Name"
                                placeholder="Your Name"
                                value={form.values.name}
                                onChange={(e) => form.setFieldValue("name", e.target.value)}
                                error={form.errors.name}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <div data-aos="fade-up" data-aos-delay="50" data-aos-duration="400">
                            <TextInput
                                label="Your Email"
                                placeholder="your@email.com"
                                value={form.values.email}
                                onChange={(e) => form.setFieldValue("email", e.target.value)}
                                error={form.errors.email}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="400">
                            <TextInput
                                label="Your Phone"
                                placeholder="12345"
                                value={form.values.phone}
                                onChange={(e) => form.setFieldValue("phone", e.target.value)}
                                error={form.errors.phone}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <div data-aos="fade-up" data-aos-delay="150" data-aos-duration="400">
                            <Select
                                key={form.values.table || "table-reset"}
                                label="Table"
                                placeholder="Please select a table"
                                data={tablesOption || []}
                                value={form.values.table}
                                onChange={(value) => { form.setFieldValue("table", value); form.setFieldValue('time', '') }}
                                error={form.errors.table}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="400">
                            <DatePickerInput
                                label="Pick a date"
                                placeholder="Choose a date"
                                valueFormat="YYYY-MM-DD"
                                highlightToday
                                minDate={new Date()}
                                maxLevel="month"
                                value={form.values.date}
                                onChange={(date) => { form.setFieldValue("date", date); form.setFieldValue('time', '') }}
                                error={form.errors.date}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <div data-aos="fade-up" data-aos-delay="250" data-aos-duration="400">
                            <Select
                                key={`${form.values.table}-${form.values.date}-${form.values.time}` || "time-reset"}
                                label="Time Slot"
                                placeholder={
                                    form.values.date && (form.values.table
                                        ? (slotsOption?.length > 0 ? "select time" : "No available slots on this day!")
                                        : "Select date and table first")
                                }

                                data={slotsOption || []}
                                value={form.values.time}
                                onChange={(value) => form.setFieldValue("time", value)}
                                disabled={!form.values.date || !form.values.table}
                                error={form.errors.time}
                                styles={{
                                    input: {
                                        border: form.errors.name ? '1px solid red' : undefined,
                                    }
                                }}
                            />
                        </div>
                    </Grid.Col>
                </Grid>

                <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
                    <Textarea
                        label="Your Message"
                        placeholder="Optional message"
                        rows={4}
                        value={form.values.message}
                        onChange={(e) => form.setFieldValue("message", e.target.value)}
                    />
                </div>

                <div data-aos="fade-up" data-aos-delay="350" data-aos-duration="400" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" className="btn-accent-primary table-booking-form__btn">
                        Book a Table
                    </Button>
                </div>
            </form >

            <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
                <div className="table-booking-form__modal-wrap">
                    {sucessFullDetails &&
                        <h4 className="table-booking-form__modal-header">Thank You for your reservation!</h4>
                    }
                    {errorDetails &&
                        <h4 className="table-booking-form__modal-header">Error!</h4>
                    }
                    <div>{sucessFullDetails?.message || errorDetails?.message}</div>
                    <div className="table-booking-form__modal-details">
                        {sucessFullDetails &&
                            <>
                                <div>Date: {sucessFullDetails?.reservation_details.date}</div>
                                <div>Time: {sucessFullDetails?.reservation_details.time}</div>
                                <div>Table: {sucessFullDetails?.reservation_details.tableNumber}</div>
                            </>
                        }
                    </div>

                    <button
                        className="btn-accent-secondary table-booking-form__modal-button"
                        onClick={handleCloseModal}
                    >
                        Ok
                    </button>
                </div>
            </Modal>
        </>
    );
}
