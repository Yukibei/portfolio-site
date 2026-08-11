import type { ReactNode } from "react";
import styles from "./Panel.module.css";

type PanelProps = {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
};

/** 侧栏玻璃面板：rgba(240,250,255,.10) + blur(12px)，无边框无投影 */
export default function Panel({ title, hint, children }: PanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {hint !== undefined && <span className={styles.hint}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/** 可内部滚动的列表容器，滚动条隐藏 */
export function PanelList({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}

export function PanelEmpty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

export { styles as panelStyles };
