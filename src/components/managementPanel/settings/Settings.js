import { useEffect, useState } from "react";
import { TextInput, NumberInput, Checkbox, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import api from "../../../utils/axios";
import "./Settings.scss";
import ErrorMessage from '../../ErrorMessage';

export default function Settings() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorFetchSettings, setErrorFetchSettings] = useState(null); // Zmieniono nazwę stanu
    const [errorSaveSettings, setErrorSaveSettings] = useState(null); // Nowy stan

    const form = useForm({
        initialValues: {
            startHour: 10,
            endHour: 23,
            startHourOffset: 0,
            reservationDurationHours: 2,
            maxDaysInAdvance: 21,
            host: '',
            port: 587,
            secure: false,
            user: '',
            pass: '',
        },
        validate: {
            startHour: (value) => value >= 0 && value <= 23 ? null : 'Start hour must be 0-23',
            endHour: (value) => value >= 0 && value <= 23 ? null : 'End hour must be 0-23',
            startHourOffset: (value) => value >= 0 && value <= 12 ? null : 'Offset must be 0-12',
            reservationDurationHours: (value) => value >= 1 && value <= 12 ? null : 'Duration must be 1-12',
            maxDaysInAdvance: (value) => value >= 1 && value <= 60 ? null : 'Max days 1-60',
            host: (value) => value.trim() ? null : 'Host is required',
            port: (value) => value > 0 && value <= 65535 ? null : 'Port must be 1-65535',
            user: (value) => value.trim() ? null : 'User is required',
            pass: (value) => value.trim() ? null : 'Password is required',
        },
        validateInputOnBlur: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setErrorFetchSettings(null); // Resetowanie błędu przed pobieraniem
            try {
                const res = await api.get("/settings");
                if (res.data.error) {
                    setErrorFetchSettings(res.data.error);
                } else {
                    if (res.data.reservationSettings) form.setValues(res.data.reservationSettings);
                    if (res.data.smtpSettings) form.setValues((v) => ({ ...v, ...res.data.smtpSettings }));
                }
            } catch (err) {
                setErrorFetchSettings(err.response?.data?.error || "You don't have enough rights to perform this action");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const saveSettings = async (values) => {
        setIsLoading(true);
        setErrorSaveSettings(null);
        try {
            const res = await api.put("/settings", {
                reservationSettings: {
                    startHour: values.startHour,
                    endHour: values.endHour,
                    startHourOffset: values.startHourOffset,
                    reservationDurationHours: values.reservationDurationHours,
                    maxDaysInAdvance: values.maxDaysInAdvance,
                },
                smtpSettings: {
                    host: values.host,
                    port: values.port,
                    secure: values.secure,
                    user: values.user,
                    pass: values.pass,
                },
            });
            if (res.data.error) {
                setErrorSaveSettings(res.data.error);
            } else {
                setErrorSaveSettings(null);
            }
        } catch (err) {
            setErrorSaveSettings(err.response?.data?.error || "You don't have enough rights to perform this action");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="settings__loading">
            <Loader size="sm" variant="dots" />
            <span>Loading...</span>
        </div>
    );
    
    if (errorFetchSettings) return (
        <div className="settings__error">
            <ErrorMessage message={errorFetchSettings} />
            <button className="button-panel" onClick={() => window.history.back()}>Back</button>
        </div>
    );

    return (
        <form className="settings" onSubmit={form.onSubmit(saveSettings)}>
            <h2 className="settings__title">Settings</h2>
            
            {errorSaveSettings && <ErrorMessage message={errorSaveSettings} />}

            <div className="settings__section">
                <h3 className="settings__section-title">Table Reservations</h3>
                <div className="settings__row">
                    <NumberInput
                        label="Start Hour"
                        min={0} max={23}
                        {...form.getInputProps('startHour')}
                        classNames={{
                            root: 'settings__field',
                            input: `settings__input ${form.errors.startHour ? 'settings__input--error' : ''}`,
                            label: 'settings__label'
                        }}
                    />
                    <NumberInput
                        label="End Hour"
                        min={0} max={23}
                        {...form.getInputProps('endHour')}
                        classNames={{
                            root: 'settings__field',
                            input: `settings__input ${form.errors.endHour ? 'settings__input--error' : ''}`,
                            label: 'settings__label'
                        }}
                    />
                </div>
                <NumberInput
                    label="Start Hour Offset"
                    min={0} max={12}
                    {...form.getInputProps('startHourOffset')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.startHourOffset ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
                <NumberInput
                    label="Reservation Duration (hours)"
                    min={1} max={12}
                    {...form.getInputProps('reservationDurationHours')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.reservationDurationHours ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
                <NumberInput
                    label="Max Days In Advance"
                    min={1} max={60}
                    {...form.getInputProps('maxDaysInAdvance')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.maxDaysInAdvance ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
            </div>

            <div className="settings__section">
                <h3 className="settings__section-title">SMTP Settings</h3>
                <TextInput
                    label="SMTP Host"
                    {...form.getInputProps('host')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.host ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
                <NumberInput
                    label="SMTP Port"
                    min={1} max={65535}
                    {...form.getInputProps('port')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.port ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
                <Checkbox
                    label="Use Secure (SSL/TLS)"
                    {...form.getInputProps('secure', { type: 'checkbox' })}
                    className="settings__checkbox"
                />
                <TextInput
                    label="SMTP User"
                    {...form.getInputProps('user')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.user ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
                <TextInput
                    label="SMTP Password"
                    type="password"
                    {...form.getInputProps('pass')}
                    classNames={{
                        root: 'settings__field',
                        input: `settings__input ${form.errors.pass ? 'settings__input--error' : ''}`,
                        label: 'settings__label'
                    }}
                />
            </div>

            <div className="buttons-group">
                <button type="submit" className="button-panel">Save Settings</button>
                <button type="button" className="button-panel" variant="default" onClick={() => window.history.back()}>Back</button>
            </div>
        </form>
    );
}