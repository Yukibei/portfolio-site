import Profile from "@/components/notes/glass/pages/Profile";
import { getAllNotes } from "@/content/notes";

export default function ProfilePage() {
  return <Profile notes={getAllNotes()} />;
}
