import styles from "./Footer.module.scss";

export default function Footbar() {
  return (
    <footer className={styles.footer}>
      <div>
        <p className={styles.license}>
          Created with love by{" "}
          <a href="https://github.com/glass-ships" target="_blank" rel="noopener noreferrer">
            Glass Ships &copy; {new Date().getFullYear()}
          </a>
        </p>
      </div>
    </footer>
  );
}
