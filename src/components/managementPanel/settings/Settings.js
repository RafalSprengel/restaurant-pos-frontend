import { useEffect, useState } from "react";
import {
  TextInput,
  NumberInput,
  Button,
  Divider,
  Stack,
  Title,
  Container,
  Checkbox,
  PasswordInput,
  Group,
  Tooltip,
  Box,
} from "@mantine/core";

import { showNotification } from '@mantine/notifications';
import api from "../../../utils/axios";

export default function Settings() {
  const [reservationSettings, setReservationSettings] = useState({
    startHour: 10,
    endHour: 23,
    startHourOffset: 0,
    reservationDurationHours: 2,
    maxDaysInAdvance: 21,
  });

  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setReservationSettings(res.data.reservationSettings || reservationSettings);
        setSmtpSettings(res.data.smtpSettings || smtpSettings);
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
        smtpSettings,
      });
      showNotification({
        title: 'Success',
        message: 'Settings saved successfully',
        color: 'green',
        autoClose: 3000,
        disallowClose: true,
      });
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'Failed to save settings',
        color: 'red',
        autoClose: 5000,
        disallowClose: true,
      });
      console.error("Error saving settings:", err);
    }
  };

  return (
    <Container style={{ width: "100%" }}>
      <Group position="apart" mb="md">
        <Title align="center" order={2}>
          Settings
        </Title>
      </Group>

      <Stack spacing="sm" mb="xl">
        <Title order={4}>Table Reservations</Title>
        <Group spacing="md">
          <Box sx={{ flex: 1 }}>
            <NumberInput
              label="Start hour"
              min={0}
              max={23}
              value={reservationSettings?.startHour}
              onChange={(val) =>
                setReservationSettings((s) => ({ ...s, startHour: val ?? 0 }))
              }
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <NumberInput
              label="End hour"
              min={0}
              max={23}
              value={reservationSettings?.endHour}
              onChange={(val) =>
                setReservationSettings((s) => ({ ...s, endHour: val ?? 0 }))
              }
            />
          </Box>
        </Group>
        <NumberInput
          label="Start Hour Offset"
          min={0}
          max={12}
          value={reservationSettings?.startHourOffset}
          onChange={(val) =>
            setReservationSettings((s) => ({ ...s, startHourOffset: val ?? 0 }))
          }
        />
        <NumberInput
          label="Reservation Duration (hours)"
          min={1}
          max={12}
          value={reservationSettings?.reservationDurationHours}
          onChange={(val) =>
            setReservationSettings((s) => ({ ...s, reservationDurationHours: val ?? 1 }))
          }
        />
        <NumberInput
          label="Max Days In Advance"
          min={1}
          max={60}
          value={reservationSettings?.maxDaysInAdvance}
          onChange={(val) =>
            setReservationSettings((s) => ({ ...s, maxDaysInAdvance: val ?? 1 }))
          }
        />
      </Stack>

      <Divider my="xl" />

      <Stack spacing="sm" mb="xl">
        <Title order={4}>SMTP Settings</Title>
        <Tooltip label="Adres serwera SMTP, np. smtp.gmail.com" withArrow>
          <TextInput
            label="SMTP Host"
            value={smtpSettings.host}
            onChange={(e) =>
              setSmtpSettings((s) => ({ ...s, host: e.target.value }))
            }
          />
        </Tooltip>
        <Tooltip label="Port serwera SMTP, zwykle 587 lub 465" withArrow>
          <NumberInput
            label="SMTP Port"
            min={1}
            max={65535}
            value={smtpSettings.port}
            onChange={(val) =>
              setSmtpSettings((s) => ({ ...s, port: val ?? 0 }))
            }
          />
        </Tooltip>
        <Checkbox
          label="Use Secure (SSL/TLS)"
          checked={smtpSettings.secure}
          onChange={(e) =>
            setSmtpSettings((s) => ({ ...s, secure: e.currentTarget.checked }))
          }
        />
        <Tooltip label="Nazwa użytkownika do logowania do SMTP" withArrow>
          <TextInput
            label="SMTP User"
            value={smtpSettings.user}
            onChange={(e) =>
              setSmtpSettings((s) => ({ ...s, user: e.target.value }))
            }
          />
        </Tooltip>
        <Tooltip label="Hasło do SMTP" withArrow>
          <PasswordInput
            label="SMTP Password"
            value={smtpSettings.pass}
            onChange={(e) =>
              setSmtpSettings((s) => ({ ...s, pass: e.target.value }))
            }
          />
        </Tooltip>
      </Stack>


      <Button fullWidth mt="xl" onClick={saveSettings}>
        Save Settings
      </Button>
      <Button variant="outline"  fullWidth mt="xl" onClick={() => window.history.back()}>
        Back
      </Button>
    </Container>
  );
}
