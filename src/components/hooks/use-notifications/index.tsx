import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export type UseNotificationsProps = {
  hubUrl: string;
  onNotify: (message: string) => void;
  debugConnection?: boolean;
};

export type UseNotificationsReturnValue = [boolean, boolean, () => void];

/*
* The useNotifications hook manages a SignalR connection to a SignalR hub.
* It is also responsible for subscribing and unsubscribing to hub topics.
*/
function useNotifications({ hubUrl, debugConnection = false, onNotify }: UseNotificationsProps) : UseNotificationsReturnValue {
  const [hub, setHub] = useState<HubConnection>();
  const [isReady, setReady] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(false);

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

    hub.on("ReceiveMessage", onNotify);

    setReady(true);
  }

  async function connect() {
    if(!isReady || !hub) {
      return;
    }

    await hub.start();

    setConnected(true);
  }

  return [isReady, isConnected, connect];
}

export default useNotifications;