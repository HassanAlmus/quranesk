import styles from './Footer.module.css'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        Made with <Image src="/netliheart.svg" alt="Netlify Logo" className={styles.logo} /> for you
      </footer>
    </>
  )
}
