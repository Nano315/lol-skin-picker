import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";

const DISCORD_URL = "https://discord.com/users/315900478065999873";
const CONTACT_EMAIL = "valentin3135@gmail.com";

export default function ContactButton() {
  const handleContact = () => {
    if (DISCORD_URL && DISCORD_URL.startsWith("http")) {
      window.lcu.openExternal(DISCORD_URL);
    } else if (CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleContact}
      icon={<MessageCircle className="h-3.5 w-3.5" aria-hidden />}
    >
      Contact
    </Button>
  );
}
