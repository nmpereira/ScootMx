import { Alert, Platform } from "react-native";

interface AlertMessageProps {
  error?: Error;
  message?: string;
}

const AlertMessage = ({ error, message }: AlertMessageProps) => {
  if (Platform.OS === "web") {
    return alert(message || (error as Error).message);
  } else {
    return Alert.alert("Error", message || (error as Error).message);
  }
};

export default AlertMessage;
