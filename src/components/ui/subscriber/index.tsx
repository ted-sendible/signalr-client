import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import useNotifications from "../../hooks/use-notifications";
import { useEffect } from "react";

export type SubscriberProps = {
  name: string;
  hubUrl?: string;
};

function Subscriber({ name, hubUrl = "wss://localhost:8080/notifications" }: SubscriberProps) {
  const [isReady, isConnected, connect] = useNotifications({
    hubUrl,
    // onNotify: (message: string) => { console.log(message); }
  })

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardContent>
        <Stack gap={1}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {name}
          </Typography>
          <Stack direction="row" gap={1}>
            {isConnected ? (
              <>
                <TextField id="topic" label="Topic" sx={{ minWidth: "80%" }} disabled={!isConnected} />
                <Button variant="contained" disabled={!isConnected}>Subscribe</Button>
              </>
            ) : (
              <>
                <TextField id="hubUrl" label="Hub URL" sx={{ minWidth: "80%" }} defaultValue={hubUrl} disabled />
                <Button variant="contained" color="success" onClick={connect} disabled={!isReady}>Connect</Button>
              </>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Subscriber;
