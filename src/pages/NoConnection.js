import { Button, Center, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/authContext.js';

const apiURL = 'https://api.justcode.uk/v1';


export default function NoConnectionPage() {
  const { checkAuthStatus} = useAuthContext();
  const checkConnection = async () =>{
    checkAuthStatus();
     window.location.href = '/';

  }

  return (
    <Center style={{ height: '100vh' }}>
      <Stack>
        <Text align="center" size="xl" fw={600}>
          Connection to the server failed.
        </Text>
        <Button onClick={() => checkConnection()} fullWidth>
          Try again
        </Button>
      </Stack>
    </Center>
  );
}
