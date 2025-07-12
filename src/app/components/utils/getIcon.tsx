import { FaDiscord } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function getIcon(icon: string) {
  if (icon === "discord") {
    return <FaDiscord />;
  } else {
    return <MdEmail />;
  }
}
