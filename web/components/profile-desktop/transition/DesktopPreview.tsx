import { DESKTOP_BACKGROUND, projects } from "../data";

export default function DesktopPreview() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundImage: `url(${DESKTOP_BACKGROUND})`, backgroundPosition: "center", backgroundSize: "cover" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 38%, rgba(0,0,0,.72) 100%)" }} />
      {projects.map((project) => (
        <div key={project.label} style={{ position: "absolute", left: `${project.anchorX}%`, top: `${project.anchorY}%`, width: 42, transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <img src={project.thumbnail} alt="" draggable={false} style={{ display: "block", width: 34, height: 34, margin: "0 auto", borderRadius: 5, border: "1px solid rgba(255,255,255,.35)", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,.18)" }} />
          <span style={{ display: "block", marginTop: 3, overflow: "hidden", color: "white", fontFamily: "Inter, sans-serif", fontSize: 4.5, lineHeight: 1.1, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.label}</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: "50%", bottom: 10, display: "flex", gap: 4, padding: 4, border: "1px solid rgba(255,255,255,.24)", borderRadius: 9, background: "rgba(255,255,255,.12)", backdropFilter: "blur(4px)", transform: "translateX(-50%)" }}>
        {Array.from({ length: 5 }, (_, index) => <span key={index} style={{ width: 12, height: 12, borderRadius: 4, background: `rgba(255,255,255,${.9 - index * .11})` }} />)}
      </div>
    </div>
  );
}
