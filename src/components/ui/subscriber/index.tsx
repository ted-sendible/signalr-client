import { Button, Card, CardContent, Chip, Stack, TextField, Typography } from "@mui/material";
import useNotifications, { Notification, Subscriber as SubscriberType } from "../../hooks/use-notifications";
import { useEffect, useState } from "react";
import NotificationItem from "../notification-item";

export type SubscriberProps = {
  name: string;
  hubUrl?: string;
};

function Subscriber({ name, hubUrl = "wss://localhost:8080/notifications" }: SubscriberProps) {
  const [isReady, isConnected, connect, subscribe] = useNotifications({
    hubUrl
  });
  const [topic, setTopic] = useState<string>("");
  const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastNotification, setLastNotification] = useState<Notification>();

  useEffect(() => {
    if(lastNotification){
      pushNotification(lastNotification);
    }
  }, [lastNotification]);

  function handleSubscribe() {
    if(isConnected && topic){
      var newSubscriber = subscribe(topic, setLastNotification);
      setSubscribers([...subscribers, newSubscriber!]);
      setTopic("");
    }
  }

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
                <TextField id="topic" label="Topic" sx={{ minWidth: "80%" }} value={topic} onChange={e => setTopic(e.target.value)} disabled={!isConnected} />
                <Button variant="contained" onClick={handleSubscribe} disabled={!isConnected}>Subscribe</Button>
              </>
            ) : (
              <>
                <TextField id="hubUrl" label="Hub URL" sx={{ minWidth: "80%" }} defaultValue={hubUrl} disabled />
                <Button variant="contained" color="success" onClick={connect} disabled={!isReady}>Connect</Button>
              </>
            )}
          </Stack>
          <Stack direction="row" gap={1}>
            {subscribers.length > 0 ? subscribers.map((subscriber, i) => (
                <Chip key={i} label={subscriber.topic} color="warning" onDelete={() => {
                  subscriber.unsubscribe();
                  const tempSubscribers = [...subscribers];
                  tempSubscribers.splice(subscribers.indexOf(subscriber), 1);
                  setSubscribers(tempSubscribers);
                }} />
            )) : (
              <Typography align="center">No subscribed topics.</Typography>
            )}
          </Stack>
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent sx={{ maxHeight: "50vh", overflowY: "scroll" }}>
              {notifications.length > 0 ? notifications.map((notification, id) => (
                <NotificationItem notification={notification} id={id} />
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
