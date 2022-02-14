import Head from "next/head";
import "../styles/mixins.scss";
import "../styles/globals.scss";
import "../styles/this.scss";
import {useEffect} from "react";
import {Provider} from "urql"
import {client, ssrCache} from '../urql-client'

export default function App({Component, pageProps}) {
    useEffect(() => document.documentElement.lang = 'en-us', [])
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
            <Provider value={client}>
                <Component {...pageProps}/>
            </Provider>
        </>
    );
}
