import Queue from "@/components/notes/glass/pages/Queue";
import { getAllNotes } from "@/content/notes";

export default function QueuePage() {
  return <Queue notes={getAllNotes()} />;
}
