import Favorites from "@/components/notes/glass/pages/Favorites";
import { getAllNotes } from "@/content/notes";

export default function FavoritesPage() {
  return <Favorites notes={getAllNotes()} />;
}
