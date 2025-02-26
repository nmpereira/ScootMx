import { FormFieldProps } from "@/app/(tabs)/create";
import messages from "@/app/(tabs)/messages";
import { ScooterCardProps } from "@/components/ScooterCard";
import { router } from "expo-router";
import {
  Client as RNClient,
  Account as RNAccount,
  Avatars as RNAvatars,
  Storage as RNStorage,
  Databases as RNDatabases,
  ID,
  Query,
} from "react-native-appwrite";
import {
  Client as WebClient,
  Account as WebAccount,
  Avatars as WebAvatars,
  Storage as WebStorage,
  Databases as WebDatabases,
  Models,
} from "appwrite";
import { Platform } from "react-native";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.scootmx",
  projectId: "67a395f800226d8e8d4d",
  storageId: "67a3ce250001b5063150",
  databaseId: "67a3ce0e00309511ea75",
  userCollectionId: "67a3ce500022d7c3a3dd",
  vehicleCollectionId: "67a517120011f7f6dd1a",
  messagesCollectionId: "67b17849001499db151d",
};

export const client = Platform.OS === "web" ? new WebClient() : new RNClient();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);
// .setPlatform(appwriteConfig.platform);

export const account =
  Platform.OS === "web"
    ? new WebAccount(client as WebClient)
    : new RNAccount(client as RNClient);
export const storage =
  Platform.OS === "web"
    ? new WebStorage(client as WebClient)
    : new RNStorage(client as RNClient);
export const avatars =
  Platform.OS === "web"
    ? new WebAvatars(client as WebClient)
    : new RNAvatars(client as RNClient);
export const databases =
  Platform.OS === "web"
    ? new WebDatabases(client as WebClient)
    : new RNDatabases(client as RNClient);

// Register user
export async function createUser({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  try {
    const uniqueId = ID.unique();

    const newAccount = await account.create(
      uniqueId,
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

// Sign In
export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// get user by id
export async function getUser(id: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      id
    );

    return user;
  } catch (error) {
    throw new Error(error as string);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

// Create listing
export async function createListing(
  props: FormFieldProps & { images: string[] }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const newListing = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vehicleCollectionId,
      ID.unique(),
      {
        ...props,
        seller: currentUser.$id,
      }
    );

    return newListing;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getVehicleListings() {
  try {
    const listings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vehicleCollectionId
    );

    return listings;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getVehicleListingById(id: string) {
  try {
    const listing = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vehicleCollectionId,
      id
    );

    return listing;
  } catch (error) {
    throw new Error(error as string);
  }
}

// messages page, get just the messages that are related to the current user
export async function getMessages(otherUser: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.or([
          Query.and([
            Query.equal("userFrom", currentUser.$id),
            Query.equal("userTo", otherUser),
          ]),
          Query.and([
            Query.equal("userFrom", otherUser),
            Query.equal("userTo", currentUser.$id),
          ]),
        ]),
        Query.orderDesc("$createdAt"),
        Query.limit(25),
      ]
    );

    messages.documents.reverse();

    return {
      documents: messages.documents,
      total: messages.total,
      currentUser,
    };
  } catch (error) {
    throw new Error(error as string);
  }
}

// send a message
export async function sendMessage({
  message,
  userTo,
}: {
  message: string;
  userTo: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        userFrom: currentUser.$id,
        userTo,
        messagebody: message,
        // ISO 8601 format
        timeSent: new Date().toISOString(),
      }
    );

    return newMessage;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getChatPreviews() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    // Get the list of chat partner IDs
    const hasChatsWith: string[] = currentUser.hasChatsWith || [];

    if (hasChatsWith.length === 0) {
      return [];
    }

    // Retrieve user details for each chat partner
    const usersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", hasChatsWith)]
    );
    const chatUsers = usersResponse.documents;

    if (chatUsers.length === 0) {
      return [];
    }

    // For each chat partner, get the latest message in the conversation.
    const chatPreviews = await Promise.all(
      chatUsers.map(async (chatUser: any) => {
        const messagesResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.messagesCollectionId,
          [
            Query.or([
              Query.and([
                Query.equal("userFrom", chatUser.$id),
                Query.equal("userTo", currentUser.$id),
              ]),
              Query.and([
                Query.equal("userFrom", currentUser.$id),
                Query.equal("userTo", chatUser.$id),
              ]),
            ]),
            // Order messages by creation date descending so the latest comes first
            Query.orderDesc("timeSent"),
            Query.limit(1),
          ]
        );

        return { user: chatUser, latestMessage: messagesResponse.documents[0] };
      })
    );

    chatPreviews.sort((a, b) => {
      if (!a.latestMessage) return -1;
      if (!b.latestMessage) return 1;

      return (
        new Date(b.latestMessage.timeSent).getTime() -
        new Date(a.latestMessage.timeSent).getTime()
      );
    });

    return chatPreviews;
  } catch (error) {
    throw new Error(error as string);
  }
}

// startChat
export async function startChat({
  userTo,
  listingId,
}: {
  userTo: string;
  listingId: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    // check if the current user has already started a chat with the userTo
    const currentUserChatList = currentUser.hasChatsWith || [];
    if (currentUserChatList.includes(userTo)) {
      router.navigate(`/chats/${userTo}`);
      return;
    }

    const startChat = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        userFrom: currentUser.$id,
        userTo: userTo,
        messagebody: `Hi there! 👋, I'm interested in your ad`,
        timeSent: new Date().toISOString(),
      }
    );

    currentUserChatList.push(userTo);

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      {
        hasChatsWith: currentUserChatList,
      }
    );

    // update the userTo's chat list
    const userToData = await getUser(userTo);

    const userToChatList = userToData.hasChatsWith || [];
    userToChatList.push(currentUser.$id);

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userTo,
      {
        hasChatsWith: userToChatList,
      }
    );

    router.navigate(`/chats/${userTo}`);
  } catch (error) {
    throw new Error(error as string);
  }
}
