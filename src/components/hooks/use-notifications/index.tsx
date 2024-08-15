import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Subject, Subscription } from "rxjs";

export type UseNotificationsProps = {
  hubUrl: string;
  debugConnection?: boolean;
};

export type UseNotificationsReturnValue = [boolean, boolean, () => void, (topic: string, onNotified: (notification: Notification) => void) => Subscription];

export type Notification = {
  timestamp: Date;
  title: string;
  body: string;
};

export type Stream = {
  topic: string; // notifications in the stream will be about this topic
  reference: string; // i don't understand how references will work at the moment
  subject: Subject<Notification>; // an RxJS subject used for multicasting notifications
};

/*
* The useNotifications hook manages a SignalR connection to a SignalR hub.
* It is also responsible for subscribing and unsubscribing to hub topics.
*/
function useNotifications({ hubUrl, debugConnection = false }: UseNotificationsProps) : UseNotificationsReturnValue {
  const [hub, setHub] = useState<HubConnection>();
  const [isReady, setReady] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(false);
  const [streams, setStreams] = useState<Map<string, Stream>>(new Map<string, Stream>());

  useEffect(() => {
    buildHub();
  }, []);

  useEffect(() => {
    configureHubListeners();
  }, [hub]);

  function buildHub() {
    const hubBuilder = new HubConnectionBuilder();
    
    // Configure the hub URL and connect to it using WebSockets.
    hubBuilder.withUrl(hubUrl, {
      skipNegotiation: true, // Without this setting, the client can't connect to the hub. I don't know yet why.
      transport: HttpTransportType.WebSockets
    });

    // Configure automatic reconnections.
    // By default, the client will attempt to reconnect 4 times at most.
    // Each reconnection attempt will be delayed by 0, 2, 10, and 30 seconds respectively.
    hubBuilder.withAutomaticReconnect();

    // Configure the client to send heartbeat messages to the hub every 15 seconds.
    hubBuilder.withKeepAliveInterval(15 * 1000);

    // Configure the client to disconnect from the hub if the latter hasn't sent a message in 30 seconds.
    hubBuilder.withServerTimeout(30 * 1000);

    // Configure console logging if required.
    // Display debug logs or higher. See https://learn.microsoft.com/en-us/javascript/api/%40microsoft/signalr/loglevel?view=signalr-js-latest.
    if(debugConnection) {
      hubBuilder.configureLogging(LogLevel.Debug);
    }

    // Finally build the hub.
    const newHub = hubBuilder.build();
    setHub(newHub);
  }

  function configureHubListeners() {
    if(!hub){
      return;
    }

    hub.on("ReceiveNotification", handleNotification);

    setReady(true);
  }

  async function connect() {
    if(!isReady || !hub) {
      return;
    }

    await hub.start();

    setConnected(true);
  }

  function subscribe(topic: string, onNotified: (notification: Notification) => void) {
    // find an existing stream
    let existingStream = streams.get(topic);

    // create a stream for a topic if it doesn't exist yet
    if(!existingStream) {
      const newStream: Stream = {
        topic,
        reference: nanoid(),
        subject: new Subject<Notification>()
      };
      streams.set(topic, newStream);
      existingStream = newStream;
    }

    // append a stream listener
    var subscription = existingStream.subject.subscribe({
      next: onNotified,
      error: () => {},
      complete: () => {}
    });

    return subscription;
  }

  function handleNotification(topic: string, timestamp: Date, title: string, body: string) {
    // find an existing stream
    const existingStream = streams.get(topic);

    // ensure the stream exists
    if(!existingStream) {
      return;
    }

    // create the notification object
    const notification: Notification = {
      timestamp,
      title,
      body
    };

    // broadcast the notification to stream subscribers
    existingStream.subject.next(notification);
  }

  return [isReady, isConnected, connect, subscribe];
}

export default useNotifications;