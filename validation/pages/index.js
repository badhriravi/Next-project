import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Login from '../component/login'
import regexValidator from '../component/regexValidator'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Forget Password</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login></Login>
      

      
    </div>
  )
}
