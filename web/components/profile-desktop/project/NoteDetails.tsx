import type { AuthorNote } from "../data";
import styles from "./NoteDetails.module.css";

type NoteDetailsProps = {
  label: string;
  thumbnail: string;
  note: AuthorNote;
};

export default function NoteDetails({ label, thumbnail, note }: NoteDetailsProps) {
  return (
    <article className={styles.root}>
      <img className={styles.cover} src={thumbnail} alt={label} />

      <header className={styles.header}>
        <span className={styles.kicker}>{note.kicker}</span>
        <h2 className={styles.title}>{label}</h2>
        <p className={styles.summary}>{note.summary}</p>
        <div className={styles.tags} aria-label="项目标签">
          {note.tags.map((tag) => (
            <span className={styles.tag} key={tag}>{tag}</span>
          ))}
        </div>
      </header>

      <section className={styles.story} aria-label="项目介绍">
        {note.details.map((paragraph, index) => (
          <div className={styles.storyItem} key={paragraph}>
            <span className={styles.storyIndex}>{String(index + 1).padStart(2, "0")}</span>
            <p className={styles.storyText}>{paragraph}</p>
          </div>
        ))}
      </section>

      <section aria-label="联系作者">
        <div className={styles.contactHeader}>
          <h3 className={styles.contactTitle}>保持联系</h3>
          <p className={styles.contactHint}>技术交流 · 项目合作 · 开源分享</p>
        </div>
        <dl className={styles.contacts}>
          {note.contacts.map((contact) => (
            <div className={styles.contact} key={contact.label}>
              <dt className={styles.contactLabel}>{contact.label}</dt>
              <dd className={styles.contactValue}>
                {contact.href ? (
                  <a className={styles.contactLink} href={contact.href}>{contact.value}</a>
                ) : contact.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
