import { Container, Stack } from "@mui/material";
import Navbar from "./components/ui/navbar";
import Subscriber from "./components/ui/subscriber";

function App() {
  return (
    <Stack gap={5}>
      <Navbar />
      <Container>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Subscriber name="Subscriber 1" />
          <Subscriber name="Subscriber 2" />
        </Stack>
      </Container>
    </Stack>
  );
}

export default App;
