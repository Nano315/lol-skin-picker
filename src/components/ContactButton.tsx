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
    <button className="contact-btn btn btn-ghost" onClick={handleContact}>
      Contact
    </button>
  );
}
