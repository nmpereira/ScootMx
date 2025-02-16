import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

interface AvatarComponentProps {
  name: string;
  imageUrl: string;
}

const AvatarComponent = (props:AvatarComponentProps) => {
  const { name, imageUrl } = props;

  return (
    <Avatar size="md">
      <AvatarFallbackText>{name}</AvatarFallbackText>
      {/* <AvatarImage
        source={{
          uri: imageUrl,
        }}
      /> */}
      {/* <AvatarBadge /> */}
    </Avatar>
  );
};

export default AvatarComponent;
