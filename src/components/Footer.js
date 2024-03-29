import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        Made with
        <Image
          src="/netliheart.svg"
          alt="Netlify Logo"
          className={styles.logo}
        />
        for you
      </footer>
    </>
  );
}
