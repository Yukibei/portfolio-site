import type { WorkProject } from "@/content/work";
import MediaFrame from "./MediaFrame";
import styles from "./WorkDetails.module.css";

type WorkDetailsProps = {
  project: WorkProject;
};

export default function WorkDetails({ project }: WorkDetailsProps) {
  const cover = project.media.find((item) => item.role === "cover") ?? project.media.at(0);
  const gallery = project.media.filter((item) => item !== cover);

  const story = [
    { label: "挑战", text: project.problem },
    { label: "方案", text: project.solution },
    { label: "我的角色", text: project.role },
  ];

  return (
    <article className={styles.root}>
      {cover ? <MediaFrame media={cover} className={styles.cover} /> : null}

      <header className={styles.header}>
        <span className={styles.kicker}>{`${project.category} · ${project.year}`}</span>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.subtitle}>
          {project.zhTitle}
          <span className={styles.status}>{project.status}</span>
        </p>
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.tags} aria-label="技术栈">
          {project.stack.map((item) => (
            <span className={styles.tag} key={item}>{item}</span>
          ))}
        </div>
      </header>

      {project.metrics.length > 0 ? (
        <dl className={styles.metrics} aria-label="核心指标">
          {project.metrics.map((metric) => (
            <div className={styles.metric} key={metric.label}>
              <dt className={styles.metricLabel}>{metric.label}</dt>
              <dd className={styles.metricValue}>{metric.value}</dd>
              <dd className={styles.metricVerify}>{metric.verify}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <section className={styles.story} aria-label="项目背景">
        {story.map((item) => (
          <div className={styles.storyItem} key={item.label}>
            <span className={styles.storyLabel}>{item.label}</span>
            <p className={styles.storyText}>{item.text}</p>
          </div>
        ))}
      </section>

      {project.decisions.length > 0 ? (
        <section aria-label="关键决策">
          <h3 className={styles.sectionTitle}>关键决策</h3>
          <div className={styles.decisions}>
            {project.decisions.map((decision) => (
              <div className={styles.decision} key={decision.title}>
                <h4 className={styles.decisionTitle}>{decision.title}</h4>
                <p className={styles.decisionChoice}>{decision.choice}</p>
                <p className={styles.decisionInsteadOf}>{`而不是 ${decision.insteadOf}`}</p>
                <p className={styles.decisionWhy}>{decision.why}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section aria-label="项目截图">
          <h3 className={styles.sectionTitle}>项目画面</h3>
          <div className={styles.gallery}>
            {gallery.map((item) => (
              <MediaFrame media={item} key={item.src} />
            ))}
          </div>
        </section>
      ) : null}

      {project.links.length > 0 ? (
        <nav className={styles.links} aria-label="项目链接">
          {project.links.map((link) => (
            <a
              className={styles.link}
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </article>
  );
}
