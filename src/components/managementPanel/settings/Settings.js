import { useEffect, useState } from "react";
import { TextInput, NumberInput, Button, Box, Divider, Stack, Title, Container } from "@mantine/core";
import api from "../../../utils/axios";

export default function Settings() {
  const [reservationSettings, setReservationSettings] = useState({
    startHour: 10,
    endHour: 23,
    startHourOffset: 0,
    reservationDurationHours: 2,
    maxDaysInAdvance: 21,
  });

  const [messageSettings, setMessageSettings] = useState({
    adminEmail: '',
    gmailUser: '',
    gmailPass: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setReservationSettings(res.data.reservationSettings);
        setMessageSettings(res.data.messageSettings);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await api.put("/settings", {
        reservationSettings,
        messageSettings,
      });
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  return (
    <Container style={{width: '100%'}}>
      <Title order={2} mb="md">Settings</Title>

      <Stack spacing="sm">
        <Title order={4}>Table Reservations</Title>
        <NumberInput label="Start tables reservation hours" min={0} max={23} value={reservationSettings?.startHour} onChange={(val) => setReservationSettings((s) => ({ ...s, startHour: val }))} />
        <NumberInput label="End tables reservation hours" min={0} max={23} value={reservationSettings?.endHour} onChange={(val) => setReservationSettings((s) => ({ ...s, endHour: val }))} />
        <NumberInput label="Start Hour Offset" min={0} max={12} value={reservationSettings?.startHourOffset} onChange={(val) => setReservationSettings((s) => ({ ...s, startHourOffset: val }))} />
        <NumberInput label="Reservation Duration (hours)" min={1} max={12} value={reservationSettings?.reservationDurationHours} onChange={(val) => setReservationSettings((s) => ({ ...s, reservationDurationHours: val }))} />
        <NumberInput label="Max Days In Advance" min={1} max={60} value={reservationSettings?.maxDaysInAdvance} onChange={(val) => setReservationSettings((s) => ({ ...s, maxDaysInAdvance: val }))} />
      </Stack>

      <Divider my="xl" />

      <Stack spacing="sm">
        <Title order={4}>Messages</Title>
        <TextInput label="Admin Email" value={messageSettings?.adminEmail} onChange={(e) => setMessageSettings((s) => ({ ...s, adminEmail: e.target.value }))} />
        <TextInput label="Gmail User" value={messageSettings?.gmailUser} onChange={(e) => setMessageSettings((s) => ({ ...s, gmailUser: e.target.value }))} />
        <TextInput label="Gmail App Password" type="password" value={messageSettings?.gmailPass} onChange={(e) => setMessageSettings((s) => ({ ...s, gmailPass: e.target.value }))} />
      </Stack>

      <Button fullWidth mt="xl" onClick={saveSettings}>
        Save Settings
      </Button>
    </Container>
  );
}
