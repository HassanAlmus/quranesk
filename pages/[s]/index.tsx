import {GetServerSideProps} from "next";
import React, {useEffect} from "react";
import Head from "next/head";
import dynamic from 'next/dynamic';
import styles from "../../styles/s.module.scss";
import VerseComponent from '../../src/components/VerseComponent';
import Loader from '../../src/components/Loader';
import {User, Surah, Verse} from '../../utils';
import edit from '../../src/components/edit';
import maps from '../../src/data/maps';
import {returnKey} from '../../src/components/useV';
import useS from "../../src/components/useS";
import Link from "next/link";
import Image from "next/image";
import {useSnapshot } from "valtio";
import {state} from '../../src/components/useS'
import {client, ssrCache} from '../../urql-client'
import { useQuery, gql} from "urql";
import surahlist from '../../src/data/surahs.json'
const Popup = dynamic(() => import ('../../src/components/popup'));


export const returnQuery = (s : number, p:(undefined|number), user : User) => {
    return gql `
    query Query {
        cs: surah(s: ${
        (s - 1).toString()
    }){
            id
            titleAr
            title
            count
            startPage
        }
        ps: surah(s: ${
        (s - 1 !== 0 ? s - 2 : s - 1).toString()
    }){
            id
            titleAr
            title
            count
            startPage
        }
        ns: surah(s: ${
        (s - 1 !== 113 ? s : s - 1).toString()
    }){
                id
                titleAr
                title
                count
                startPage
            }
        page(s: ${
        (s - 1).toString()
    }${p?`, p:${p}`:""}) {
            id
            ${
        (user.translations.map((t) => `${t}\n`)).toString()
    }
            ${
        (user.tafseers.map((t) => `${
            returnKey(t)
        }\n`)).toString()
    }
            words {
            ${
        user.rasm.split("-")[0]
    }
            ${
        user.wbwtranslation
    }
            transliteration
            }
            meta {
                tse
                ayah
                surah
                page
            }
        }
    }
`;
};


const V = (props : {
    data: {
        maps: any,
        cs: Surah,
        ps: Surah,
        ns: Surah,
        page: Verse[]
    },
    s: number,
    p: number,
    maps: any,
    isFirstPage: boolean,
    user: User
}) => {
    const {
        tafseerMap,
        audioMap,
        translationMap,
        setTafseers,
        setWbwtranslation,
        user,
        setRasm,
        setTranslations,
        nextPage,
        prevPage,   
        s,
        setP,
        p,
        setS
    } = useS(props)

    const snap = useSnapshot(state);

    const [{ data, error}] = useQuery({
        query: returnQuery(props.s+1, props.p, user)
      });

      useEffect(() => {
        if (error) 
            console.log(error)
        
        if (data !== undefined) {
            state.verses=data.page;
            state.cs=data.cs;
            state.ps=data.ps;
            state.ns=data.ns;
            state.isFirstPage=props.isFirstPage;
            state.init=true;
        }
    }, [data])

    if(snap.init)
    {return (
        <div id={
            styles.d1
        }>
                    <Head>
            <title> {
                `${s+1}. ${
                    snap.cs.title.split(" (")[1].substring(0, snap.cs.title.split(" (")[1].length - 1)
                } (${
                    snap.cs.title.split(" (")[0]
                })${snap.isFirstPage?"":` - P${p}`}`
            }</title>
            <meta property="og:title"
                content={
                    `${s+1}. ${
                        snap.cs.title.split(" (")[1].substring(0, snap.cs.title.split(" (")[1].length - 1)
                    } (${
                        snap.cs.title.split(" (")[0]
                    })${snap.isFirstPage?"":` - P${p}`}`
            }></meta>
            <meta name="keywords"
                content={
                    `${
                        snap.cs.title
                    }, ${
                        snap.cs.titleAr
                    }`
            }></meta>
            <meta name="description"
                content={
                    `Verses ${snap.verses[0].meta.ayah}-${snap.verses[snap.verses.length-1].meta.ayah}`
            }></meta>
            <meta name="og:description"
                content={
                    `Verses ${snap.verses[0].meta.ayah}-${snap.verses[snap.verses.length-1].meta.ayah}`
            }></meta>
        </Head>
            {
            snap.showPopup && <Popup setTranslations={
                    (v : any) => setTranslations(v)
                }
                v={false}
                tafseerMap={tafseerMap}
                audioMap={audioMap}
                translationMap={translationMap}
                setTafseers={
                    (v : any) => setTafseers(v)
                }
                setWbwtranslation={
                    (v : any) => setWbwtranslation(v)
                }
                user={user}
                setRasm={
                    (v : any) => setRasm(v)
                }
                setShowPopup={
                    (v : any) => state.showPopup=(v)
                }/>
        }
            {
            snap.isFirstPage && <div id={
                styles.d4
            }>
                <div id={
                    styles.d5
                }>
                    <h2 id={
                        styles.english
                    }>
                        {
                        snap.cs.title.split(" (")[0]
                    }</h2>
                    <h1 id={
                        styles.transliteration
                    }>
                        {
                        snap.cs.title.split(" (")[1].slice(0, -1)
                    }</h1>
                    <h2 id={
                            styles.arabic
                        }
                        className="uthmani">
                        {
                        snap.cs.titleAr
                    }</h2>
                </div>
            </div>
        }
            <div id={
                styles.d11
            }>
                <div className={
                    styles.home
                }>
                    <Link passHref={true}
                        href="/">
                        <Image alt="logo" src="/logo.png"
                            height={40}
                            width={40}/>
                    </Link>
                </div>
                <div className={
                    styles.d4_
                }>
                    <div className={
                        styles.d6_
                    }>
                        {snap.isFirstPage?<h4 style={{color:'whitesmoke'}}>P{p}</h4>:<><h3>{s+1}. {
                            snap.cs.title.split(" (")[1].substring(0, snap.cs.title.split(" (")[1].length - 1)
                        } </h3>
                        <h3 id={styles.translation}>{
                            snap.cs.title.split(" (")[0]
                        }</h3>
                        {<h3 id={styles.p}>P{snap.isFirstPage?snap.cs.startPage:p}</h3>}
                        </>}
                    </div>
                </div>
                <div className={
                        styles.d5
                    }
                    onClick={
                        () => state.showPopup=(true)
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        className={"settings"}
                        viewBox="0 0 24 24"
                        stroke="#01335E">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
            </div>
            {
            snap.loading ? <div style={
                {
                    position: 'fixed',
                    top: '50vh'
                }
            }><Loader/></div> : <div id={
                styles.d30
            }>
                {
                snap.verses.map((verse, i) =>< VerseComponent user = {
                    user
                }
                loc = {
                    [
                        verse.meta.surah - 1,
                        verse.meta.ayah - 1
                    ]
                }
                verse = {
                    verse
                }
                key = {
                    i
                }
                translationMap = {
                    translationMap
                }
                tafseerMap = {
                    tafseerMap
                } />)
            } </div>
        }
            {
            snap.loading === false && <div id={
                styles.d31
            }>
                {
                s !== 0 && <div id={
                        styles.d32
                    }
                    className="s first"
                    onClick={
                        () => {
                            prevPage()
                        }
                }>
                    <h1>‹ {
                        snap.verses[0].meta.ayah === 1 ? `${s}. ${
                            snap.ps.title.split(' (')[1].slice(0, -1)
                        }` : `P${
                            p - 1
                        }`
                    }</h1>
                </div>
            }
                {
                s !== 113 && <div id={
                        styles.d33
                    }
                    className="s second"
                    onClick={
                        () => {
                            nextPage()
                        }
                }>
                    <h1>{
                        snap.verses[snap.verses.length - 1].meta.ayah === snap.cs.count ? `${
                            s + 2
                        }. ${
                            snap.ns.title.split(' (')[1].slice(0, -1)
                        }` : `P${
                            p + 1
                        }`
                    }
                       {` ›`}</h1>
                </div>
            } </div>
        } </div>
    )}else{
        return (
            <div style={
            {
                position: 'fixed',
                top: '50vh',
                right: '50vw'
            }
        }><Loader/></div>)
    }
};

//ya allah

export const getServerSideProps: GetServerSideProps = async function ({params, req, query}) {
    let user: User;
    user = edit(query, req, false);
    const Query = returnQuery(Number(params ?. s), typeof query.p === 'undefined'?undefined:Number(query.p), user);
    await client.query(Query).toPromise();
    return {
        props: {
            s: Number(params ?. s) - 1,
            p: typeof query.p === 'undefined'?surahlist[Number(params ?. s) - 1].startPage:Number(query.p),
            isFirstPage: typeof query.p === 'undefined',
            maps,
            user,
            urqlState: ssrCache.extractData()
        }
    };
};

export default V
