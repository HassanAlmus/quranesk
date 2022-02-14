import {GetServerSideProps} from "next";
import React, {useEffect, useState} from "react";
import styles from "../styles/tafseerenamoona.module.scss";
import Head from "next/head";
import {NamoonaTopic} from "../utils";
import { gql, useClient} from "urql"
import { useSnapshot, proxy } from "valtio"
import {useRouter} from "next/router";
import Loader from '../src/components/Loader';

const returnQuery = (link : string) => {
    return gql`
        query Query {
            namoonaTopic(link: "${link}"){
                range
                title
                text
            }
        }
    `;
};

const state = proxy({
    init: false,
    data: null,
    s: null,
    v: null
})

const TafseereNamoona = () => {
    const snap = useSnapshot(state);
    const client = useClient();
    const router = useRouter();

    useEffect(()=>{
      if(router.query.s&&router.query.v&&router.query.id){
          console.log(Number(router.query.s)-1, router.query.id as string)
          client.query(returnQuery(router.query.id as string)).toPromise().then(result=>{
            if(result.error) console.log(result.error);
            console.log(result.data)
            state.data=result.data
            state.s=Number(router.query.s)-1
            state.v=Number(router.query.v)-1
            state.init=true
          })
      }
    }, [router.query])

    return (snap.init?<>
        <Head>
            <title> {
                `تفسير نمونه - ${
                    snap.data.namoonaTopic.title
                }`
            }</title>
            <meta property="og:title"
                content={
                    `تفسير نمونه - ${
                        snap.data.namoonaTopic.title
                    }`
            }></meta>
            <meta name="description"
                content={
                    snap.data.namoonaTopic.text
            }></meta>
            <meta name="og:description"
                content={
                    snap.data.namoonaTopic.text
            }></meta>
        </Head>
        <div id={
            styles.d1
        }>
            <div id={
                styles.d2
            }>
                <div id={
                    styles.d3
                }>
                    <h1 className='urdu'> {
                        snap.data.namoonaTopic.title
                    }</h1>
                    <div id={
                        styles.d4
                    }>
                        <h4> {
                            snap.data.namoonaTopic.range[0] !== -1 && snap.data.namoonaTopic.range[0] !== snap.data.namoonaTopic.range[1] ? `${
                                snap.data.namoonaTopic.range[1] + 1
                            }-${
                                snap.data.namoonaTopic.range[0] + 1
                            }` : (snap.data.namoonaTopic.range[0] === -1 ? `Surah ${
                                snap.s + 1
                            }` : (snap.data.namoonaTopic.range[0] === snap.data.namoonaTopic.range[1] ? snap.data.namoonaTopic.range[1] + 1 : snap.data.namoonaTopic.range.map((n) => n + 1).join('-')))
                        } </h4>
                    </div>
                </div>
                <div id={styles.d5}>
                    {snap.data.namoonaTopic.text.split('\n').map((t, i)=><p key={i} className='urdu'>{t}</p>)}
                </div>
                
            </div>
        </div>
    </>:<div style={
            {
                position: 'fixed',
                top: '50vh',
                right: '50vw'
            }
        }><Loader/></div>);
};

export default TafseereNamoona
