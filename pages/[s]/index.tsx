import React, {useEffect} from "react";
import Head from "next/head";
import styles from "../../styles/s.module.scss";
import VerseComponent from '../../src/components/VerseComponent';
import Loader from '../../src/components/Loader';
import {Surah, Verse} from '../../utils';
import useS from "../../src/components/useS";
import Link from "next/link";
import Image from "next/image";
import {client2} from '../../urql-client';
import {gql} from "urql";
import {useSnapshot} from "valtio";
import {state} from "../../src/components/useS";
import {state as state2} from '../../src/components/useV';
import Popup from "../../src/components/popup";
import ReactAudioPlayer from 'react-audio-player';
import surahs from '../../src/data/surahinfo.json';

const S = (props : {
    isFirstPage: boolean,
    p: number,
    s: number,
    data: {
        cs: Surah,
        ps: Surah,
        ns: Surah,
        page: Verse[]
    }
}) => {
        const snap = useSnapshot(state);
        const {
            tafseerMap,
            audioMap,
            translationMap,
            setTafseer,
            setWbwtranslation,
            user,
            setRasm,
            setTranslation,
            nextPage,
            prevPage,
            s,
            p,
            cs,
            isFirstPage,
            verses,
            ps,
            ns,
            loading,
            showPopup,
            setShowPopup,
            myRef,
            loadingSurah,
            surahAudioIndex,
            setSurahAudioIndex,
            showAudio,
            setShowAudio,
            surahAudioMap,
            setSurahAudio
        } = useS(props);
        useEffect(() => state2.reset(), []);

        const SurahAudio = () => (showAudio ? <div id={
            styles.d40
        }>
            <div id={
                styles.d34
            }>
                <div id={
                    styles.d35
                }>
                    <div id={styles.d43}>
                        <h2>{
                            user.surahAudio
                        }</h2>
                        <h3>{
                            surahAudioIndex + 1
                        }. {
                            surahs[surahAudioIndex].title
                        }</h3>
                    </div>
                    <div id={
                        styles.d36
                    }>
                        <div className={
                                styles.c37
                            }
                            onClick={
                                () => {
                                    if (surahAudioIndex > 0) {
                                        setSurahAudioIndex(surahAudioIndex - 1)
                                    }
                                }
                        }>
                            <h1>‹</h1>
                        </div>
                        <h1 id={
                            styles.d38
                        }>
                            {
                            surahAudioIndex + 1
                        }</h1>
                        <div className={
                                styles.c37
                            }
                            onClick={
                                () => {
                                    if (surahAudioIndex < 113) {
                                        setSurahAudioIndex(surahAudioIndex + 1)
                                    }
                                }
                        }>
                            <h1>›</h1>
                        </div>
                    </div>

                </div>
                <div id={
                    styles.d42
                }>
                    <div id={
                            styles.d41
                        }
                        onClick={
                            () => setShowAudio(false)
                    }>
                        <h1>✖</h1>
                    </div>
                    <ReactAudioPlayer controls
                        src={
                            surahs[surahAudioIndex].reciters[user.surahAudio.split(' ').join('')]
                        }/>

                </div>
            </div>
        </div> : <div id={
                styles.d39
            }
            onClick={
                () => setShowAudio(true)
        }>
            <h2>
                Audio ♪
            </h2>
        </div>)

        const BodyFirstPageBanner = () => (isFirstPage && (
            <div id={
                styles.d4
            }>
                <div id={
                    styles.d5
                }>
                    <h2 id={
                        styles.english
                    }>
                        {
                        cs.title.split(" (")[0]
                    }</h2>
                    <h1 id={
                        styles.transliteration
                    }>
                        {
                        `${
                            s + 1
                        }. ${
                            cs.title.split(" (")[1].slice(0, -1)
                        }`
                    }</h1>
                    <h2 id={
                            styles.arabic
                        }
                        className="uthmani">
                        {
                        cs.titleAr
                    }</h2>
                </div>
            </div>
        ));

        const BodyBanner = () => (
            <div id={
                styles.d11
            }>
                <div className="cursor">
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
                        {
                        isFirstPage ? (
                            <h4 style={
                                {color: 'whitesmoke'}
                            }>P{p}</h4>
                        ) : (
                            <>
                                <h3>{
                                    s + 1
                                }. {
                                    cs.title.split(" (")[1].substring(0, cs.title.split(" (")[1].length - 1)
                                } </h3>
                                <h3 id={
                                    styles.translation
                                }>
                                    {
                                    cs.title.split(" (")[0]
                                }</h3>
                                <h3 id={
                                    styles.p
                                }>
                                    P {
                                    isFirstPage ? cs.startPage : p
                                } </h3>
                            </>
                        )
                    } </div>
                </div>
                <div className={
                        styles.d5
                    }
                    onClick={
                        () => setShowPopup(true)
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
        );

        const BodyVerses = () => (loading ? <div className="hsloading"><Loader/></div> : <div id={
            styles.d200
        }>
            <div id={
                styles.d30
            }>
                {
                verses.map((verse, i) =><> <VerseComponent user={user}
                    loc={
                        [
                            verse.meta.surah - 1,
                            verse.meta.ayah - 1
                        ]
                    }
                    verse={verse}
                    key={i}
                    translationMap={translationMap}
                    tafseerMap={tafseerMap}
                    component='s'/>
            </>
                )
            } </div>
        </div>
    )

    const BodyPageNav = () => (loadingSurah === false && (
        <div id={
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
                    verses[0].meta.ayah === 1 ? `${s}. ${
                        ps.title.split(' (')[1].slice(0, -1)
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
                    verses[verses.length - 1].meta.ayah === cs.count ? `${
                        s + 2
                    }. ${
                        ns.title.split(' (')[1].slice(0, -1)
                    }` : `P${
                        p + 1
                    }`
                }
                    {` ›`}</h1>
            </div>
        } </div>
    ))

    const Body = () => (snap.init && (
        <> {
            showPopup && (
                <Popup setTranslations={
                        (v : any) => setTranslation(v)
                    }
                    v={false}
                    tafseerMap={tafseerMap}
                    audioMap={audioMap}
                    translationMap={translationMap}
                    surahAudioMap={surahAudioMap}
                    setTafseers={
                        (v : any) => setTafseer(v)
                    }
                    setWbwtranslation={
                        (v : any) => setWbwtranslation(v)
                    }
                    user={user}
                    setRasm={
                        (v : any) => setRasm(v)
                    }
                    setShowPopup={
                        (v : any) => setShowPopup(v)
                    }
                    setSurahAudio={
                        (v : any) => setSurahAudio(v)
                    }/>
            )
        }
            <BodyFirstPageBanner/>
            <BodyBanner/>
            <BodyVerses/>
            <BodyPageNav/>
        </>
    ))
    return (<>
        <div ref={myRef}></div>
        <Head>
            <title> {
                `${
                    s + 1
                }. ${
                    cs.title.split(" (")[1].substring(0, cs.title.split(" (")[1].length - 1).replace("'", "&apos;")
                } (${
                    cs.title.split(" (")[0]
                })${
                    isFirstPage ? "" : ` - P${p}`
            }`
                                                            }</title>
            <meta property="og:title"
                content={
                    `${
                        s + 1
                    }. ${
                        cs.title.split(" (")[1].substring(0, cs.title.split(" (")[1].length - 1).replace("'", "&apos;")
                    } (${
                        cs.title.split(" (")[0]
                    })${
                        isFirstPage ? "" : ` - P${p}`
                    }`
            }></meta>
            <meta name="keywords"
                content={
                    `${
                        cs.title
                    }, ${
                        cs.titleAr
                    }`
            }></meta>
            <meta name="description"
                content={
                    `Verses ${
                        verses[0].meta.ayah
                    }-${
                        verses[verses.length - 1].meta.ayah
                    }`
            }></meta>
            <meta name="og:description"
                content={
                    `Verses ${
                        verses[0].meta.ayah
                    }-${
                        verses[verses.length - 1].meta.ayah
                    }`
            }></meta>
        </Head>
        <SurahAudio/>
        <Body/>
    </>
);;;;;
};

export async function getStaticPaths() {
    return {
        paths: Array.from(Array(114).keys()).map((_s) => {
            return {
                params: {
                    s: (_s + 1).toString()
                }
            }
        }),
        fallback: false
    };
};

const returnQuery = (s : number) => {
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
            endPage
        }
        ps: surah(s: ${
        (s - 1 !== 0 ? s - 2 : s - 1).toString()
    }){
            id
            titleAr
            title
            count
            startPage
            endPage
        }
        ns: surah(s: ${
        (s - 1 !== 113 ? s : s - 1).toString()
    }){
                id
                titleAr
                title
                count
                startPage
                endPage
            }
        page(s: ${
        (s - 1).toString()
    } ){
            id
            puyaen
            chinoyen
            namoonaur{
                title
                range 
                link
            }
            khorramdelfa
            enahmedali
            enqarai
            ensarwar
            enchinoy
            enyusufali
            trgolpinarli
            urahmedali
            urnajafi
            urjawadi
            azmammadaliyev
            tjayati
            frfakhri
            hijawadi
            faansarian
            famakarem
            fagharaati
            faghomshei
            fafoolavand
            azmehdiyev
            ruzeynalov
            ursafdar
            famoezzi
            fasadeqi
            famojtabavi
            fabahrampour
            faayati
            fakhorramdel
            fakhorramshahi
            words {
            english
            uthmani
            indopak
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

export async function getStaticProps({params}) {
    let data;
    await client2.query(returnQuery(Number(params.s))).toPromise().then((result => {
        if (result.error) 
            console.log(result.error);
        


        data = result.data;
    }))
    return {
        props: {
            s: Number(params.s) - 1,
            data,
            p: data.cs.startPage,
            isFirstPage: true
        }
    };
};

export default S
