import { Expo, ExpoPushMessage, ExpoPushErrorReceipt } from "expo-server-sdk";

export const sendPushNotifications = async (
  expoTokens: string[],
  messageToDeliver: Omit<ExpoPushMessage, "to" | "sound">
) => {
  // Create a new Expo SDK client optionally providing an access token if you have enabled push security
  //TODO: implement an accessToken process.env.EXPO_ACCESS_TOKEN
  let expo = new Expo({ accessToken: undefined });
  let messages: ExpoPushMessage[] = [];
  for (let pushToken of expoTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: pushToken,
      sound: "default",
      ...messageToDeliver,
    });
  }
  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  console.log({ chunks }, chunks[0]);
  let tickets: any[] = [];
  const sendNotifications = async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    return receiptIdChunks;
  };

  const getReceipts = async (receiptIdChunks: any) => {
    let finalReceipts;
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        finalReceipts = receipts;
        for (let receiptId in receipts) {
          let { status, details } = receipts[receiptId];
          if (status === "ok") {
            continue;
          } else if (status === "error") {
            let { message } = receipts[receiptId] as ExpoPushErrorReceipt;
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && (details as any).error) {
              console.error(`The error code is ${(details as any).error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return finalReceipts;
  };

  let promise1Resolved = await sendNotifications();
  let promise2Resolved = await getReceipts(promise1Resolved);

  return promise2Resolved;
};
