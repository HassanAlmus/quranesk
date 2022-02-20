import Head from "next/head";
import "../styles/mixins.scss";
import "../styles/globals.scss";
import "../styles/this.scss";
import {useEffect} from "react";
import {Provider} from "urql"
import {client} from '../urql-client'
import Script from 'next/script'
import { useRouter } from "next/router";
import * as gtag from "../lib/ga/gtag";


export default function App({Component, pageProps}) {
    useEffect(() => document.documentElement.lang = 'en-us', [])
    const router = useRouter();
    useEffect(() => {
      const handleRouteChange = (url) => {
        gtag.pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }, [router.events]);
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/logo.png"/>
                <meta property="og:image" content="https://cdn.discordapp.com/attachments/719941252090691705/825624790953754624/logo.png"/>
                <meta name="theme-color" content="#007B80"></meta>
                <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/logo.png"></link>
                <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/logo.png"></link>
                <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/logo.png"></link>
                <link rel="apple-touch-icon-precomposed" href="/logo.png"></link>
                <link rel="shortcut icon" href="/logo.png"></link>
            </Head>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=G-26ZWR4QT9E`}
            />
            <Script
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-26ZWR4QT9E');
                `,
                }}
            />
            <Provider value={client}>
                <Component {...pageProps}/>
            </Provider>
        </>
    );
}
