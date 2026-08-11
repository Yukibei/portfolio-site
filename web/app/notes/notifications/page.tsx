import Notifications from "@/components/notes/glass/pages/Notifications";
import { getAllNotes, getSeries } from "@/content/notes";

export default function NotificationsPage() {
  return <Notifications notes={getAllNotes()} series={getSeries()} />;
}
