import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";

interface AvatarComponentProps {
  name: string;
  imageUrl: string;
  size?: "sm" | "md" | "lg";
}

const AvatarComponent = (props: AvatarComponentProps) => {
  const { name, imageUrl, size = "md" } = props;

  return (
    <Avatar size={size}>
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
