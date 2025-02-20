import { ChatPreview } from "@/components/ChatPage";

import { client } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";

export const subscribeToChannel = async ({
  channels,
  setMessages,
  setChatList,
  user,
}: {
  channels: string[];
  setMessages?: React.Dispatch<React.SetStateAction<Models.Document[]>>;
  setChatList?: React.Dispatch<React.SetStateAction<ChatPreview[]>>;
  user: Models.Document;
}) => {
  return client.subscribe(
    channels,

    ({
      events,
      payload,
      channels,
    }: {
      events: string[];
      payload: Models.Document;
      channels: string[];
    }) => {
      if (events.includes("databases.*.collections.*.documents.*.create")) {
        console.log("A MESSAGE WAS CREATED", payload);
        // setMessages((prevState) => [payload, ...prevState]);
        // set to the end of the list
        setMessages && setMessages((prevState) => [...prevState, payload]);
        setChatList &&
          setChatList((prevState) => {
            const newChatList = prevState.map((chat) => {
              //   get non-current user from payload, its either userFrom or userTo
              const otherUser =
                payload.userFrom.$id === user.$id
                  ? payload.userTo
                  : payload.userFrom;

                // update the chat for the other user
                if (chat.user.$id === otherUser.$id) {
                    return {
                        ...chat,
                        latestMessage: payload,
                    };
                    }
                    return chat;
                }
            );
            return newChatList;
          });
      }

      //   if (
      //     events.includes("databases.*.collections.*.documents.*.delete") &&
      //     setMessages
      //   ) {
      //     console.log("A MESSAGE WAS DELETED!!!");
      //     // setMessages(prevState => prevState.filter(message => message.$id !== payload.$id))
      //   }
    }
  );
};
