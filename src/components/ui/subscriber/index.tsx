import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import useNotifications, { Notification } from "../../hooks/use-notifications";
import { useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";

export type SubscriberProps = {
  name: string;
  hubUrl?: string;
};

function Subscriber({ name, hubUrl = "wss://localhost:8080/notifications" }: SubscriberProps) {
  const [isReady, isConnected, connect, subscribe] = useNotifications({
    hubUrl,
    // onNotify: (message: string) => { console.log(message); }
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastNotification, setLastNotification] = useState<Notification>();

  useEffect(() => {
    if(isConnected){
      subscribe("system", setLastNotification);
    }
  }, [isConnected]);

  useEffect(() => {
    if(lastNotification){
      pushNotification(lastNotification);
    }
  }, [lastNotification]);

  function pushNotification(notification: Notification) {
    console.log(notifications);
    setNotifications([notification, ...notifications]);
  }

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
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              {notifications.length > 0 ? notifications.map((notification, i) => (
                <Accordion key={`notification-${i}`}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`notification-${i}-body`}
                    id={`notification-${i}-title`}
                  >
                    {notification.title}
                  </AccordionSummary>
                  <AccordionDetails>
                    {notification.body}
                  </AccordionDetails>
                </Accordion>
              )) : (
                <Typography align="center">No notifications.</Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Subscriber;
