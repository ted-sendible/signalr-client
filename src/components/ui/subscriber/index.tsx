import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export type SubscriberProps = {
  name: string;
};

function Subscriber({ name }: SubscriberProps) {
  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardContent>
        <Stack gap={1}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {name}
          </Typography>
          <Stack direction="row" gap={1}>
            <TextField id="topic" label="Topic" sx={{ minWidth: "80%" }} />
            <Button variant="contained">Subscribe</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Subscriber;
