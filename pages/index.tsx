import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>BlockFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bem-vindo ao projeto <a href="https://blockfi.vercel.app">BlockFi!</a>
        </h1>

        <div className={styles.grid}>
          <a href="/sobre" className={styles.card}>
            <h3>Documentação &rarr;</h3>
            <p>Veja aqui, como o projeto foi concebido para funcionamento.</p>
          </a>

          <a href="/login" className={styles.card}>
            <h3>Login &rarr;</h3>
            <p>Identifique-se para acesso ao sistema!</p>
          </a>

          <a
            href="/registro" className={styles.card}
          >
            <h3>Registro &rarr;</h3>
            <p>Registre-se aqui para começar a acessar o sistema.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hospedado por{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}