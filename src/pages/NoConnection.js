import { Button, Center, Stack, Text } from '@mantine/core';
import { useAuthContext } from '../context/authContext.js';


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
