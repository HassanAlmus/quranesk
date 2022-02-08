import {GetServerSideProps} from "next";
import React from "react";
import Head from "next/head";
import dynamic from 'next/dynamic';
import styles from "../../styles/v.module.scss";
import VerseComponent from '../../src/components/VerseComponent';
import Loader from '../../src/components/Loader';
import {User, Surah, Verse} from '../../utils';
import edit from '../../src/components/edit';
import maps from '../../src/data/maps';
import useV from '../../src/components/useV';
import Navbar from '../../src/components/Navbar';
import {returnKey} from '../../src/components/useV';
import ReactAudioPlayer from 'react-audio-player';
import { gql } from "@apollo/client";
import client from "../../apollo-client";

const Popup = dynamic(() => import ('../../src/components/popup'));

const V = (props : {
    data: {
        maps: any,
        cs: Surah,
        ps: Surah,
        verse: Verse
    },
    s: number,
    v: number,
    user: User
}) => {
    const {
        setRasm,
        setAudio,
        cs,
        setTafseers,
        ps,
        loc,
        setLoc,
        showPopup,
        setShowPopup,
        verse,
        translationMap,
        user,
        setTranslations,
        setWbwtranslation,
        tafseerMap,
        audioMap,
        returnCondition,
        playing,
        audio,
        setPlaying,
        setAutoplay,
    } = useV(props);

    return (<div className={
        styles.d1
    }>
        <Head>
            <title> {
                `[${
                    loc[0] + 1
                }:${
                    loc[1] + 1
                }] ${
                    cs.title.split(" (")[1].substring(0, cs.title.split(" (")[1].length - 1)
                } (${
                    cs.title.split(" (")[0]
                })`
            }</title>
            <meta property="og:title"
                content={
                    `[${
                        loc[0] + 1
                    }:${
                        loc[1] + 1
                    }] ${
                        cs.title.split(" (")[1].substring(0, cs.title.split(" (")[1].length - 1)
                    } (${
                        cs.title.split(" (")[0]
                    })`
            }></meta>
            <meta name="keywords"
                content={
                    `${
                        cs.title
                    }, ${
                        cs.titleAr
                    }, ${
                        verse.words.map((w : any) => `${
                            w ?. transliteration
                        }, `)
                    }${
                        loc[0] + 1
                    }:${
                        loc[1] + 1
                    }, Quranesk, quranesk.om, Quran, Qur'an, Koran, Coran, Islam, Bible, Shia, Shi'a, Shiite, Shi'ite, Schiite, Translation, Tafseer, Agha Puya, Ahmed Ali, Ali Muhammad Fazil Chinoy, Muhammad Sarwar, Abdullah Yusufali, علامہ جوادی, Allama Jawadi, Allama, Zeeshan, Haider, Jawadi, احمد على, Muhammad Hussein Najafi, محمد حسين نجفى, जीशान हैदर जवेदी, Abdulbakî Gölpınarl, Ağabala Mehdiyev, Dürdanə Cəfərli - leader.ir/az, Vasim Mammadaliyev, Ziya Bunyadov, Abu Rida Muhammad ibn Ahmad ibn Rassoul, Dr.G.H. ABOLQASEMI FAKHRI, Абдулмуҳаммад Оятӣ, AbdolMohammad Ayati, Mohammad Foolavand, Naser Makarem Shirazi, Elahi Ghomshei, Gharaati, Hossein Ansarian, Shahriyar Pargizagar, Karim Mansouri, Mohd. Hossein Sabzali, Hannaneh Khalafi, Hossein Saeediyan, Rafidhi, quran.com`
            }></meta>
            <meta name="description"
                content={
                    (props).data.verse[Object.keys(props.data.verse).filter(key => key !== '__typename' && key !== 'id' && key !== 'words' && key !== 'meta')[0]] as string
            }></meta>
            <meta name="og:description"
                content={
                    (props).data.verse[Object.keys(props.data.verse).filter(key => key !== '__typename' && key !== 'id' && key !== 'words' && key !== 'meta')[0]] as string
            }></meta>
        </Head>
        {
        returnCondition() ? <>
            <Navbar cs={cs}
                setShowPopup={
                    (v : boolean) => setShowPopup(v)
                }/>
            <div className={
                styles.d9
            }><VerseComponent user={user}
                    loc={loc}
                    verse={verse}
                    translationMap={translationMap}
                    tafseerMap={tafseerMap}/></div>
            {
            showPopup && <Popup setTranslations={
                    (v : any) => setTranslations(v)
                }
                v={true}
                loc={loc}
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
                setAudio={
                    (v : any) => setAudio(v)
                }

                setShowPopup={
                    (v : any) => setShowPopup(v)
                }/>
        }
            {
            (<div className={
                styles.d40
            }>
                <div className={
                    styles.d34
                }>
                    <ReactAudioPlayer src={audio}
                        autoPlay={
                            user.autoplay
                        }
                        controls
                        onEnded={
                            () => {
                                if (!user.autoplay) 
                                    setPlaying(false)

                                

                                if (user.autoplay) {
                                    if (!(loc[0] === 113 && loc[1] === 6)) {
                                        setLoc(loc[1] + 1 === cs.count ? [
                                            loc[0] + 1,
                                            0
                                        ] : [
                                            loc[0], loc[1] + 1
                                        ]);
                                    }
                                }
                            }
                        }/>
                    <div id={
                        styles.d100
                    }>
                        <div className={
                                user.autoplay ? styles.d41 : styles.d39
                            }
                            onClick={
                                () => setAutoplay(!user.autoplay)
                        }>
                            <h1>AUTO</h1>
                        </div>
                        <div className={
                                styles.d35
                            }
                            onClick={
                                () => {
                                    if (!(loc[0] === 0 && loc[1] === 0)) {
                                        setLoc(loc[1] === 0 ? [
                                            loc[0] - 1,
                                            ps.count - 1
                                        ] : [
                                            loc[0], loc[1] - 1
                                        ]);
                                    }
                                }
                        }>
                            <h1>ˆ</h1>
                        </div>
                        <h2> {
                            loc[1] + 1
                        }</h2>
                        <div className={
                                styles.d36
                            }
                            onClick={
                                () => {
                                    if (!(loc[0] === 113 && loc[1] === 6)) {
                                        setLoc(loc[1] + 1 === cs.count ? [
                                            loc[0] + 1,
                                            0
                                        ] : [
                                            loc[0], loc[1] + 1
                                        ]);
                                    }
                                }
                        }>
                            <h1>ˇ</h1>
                        </div>
                    </div>
                </div>
            </div>)
        } </> : <div style={
            {
                position: 'fixed',
                top: '50vh'
            }
        }><Loader/></div>
    } </div>)
};

export const returnQuery = (s : number, v : number, user : User) => {
    return gql `
    query Query {
        cs: surah(s: ${
        s - 1
    }){
            id
            titleAr
            title
            count
        }
        ps: surah(s: ${
        s - 1 !== 0 ? s - 2 : s - 1
    }){
            id
            count
        }
        verse(s: ${
        s - 1
    }, v: ${
        v - 1
    }) {
            id
            ${
        user.translations.map((t) => `${t}\n`)
    }
            ${
        user.tafseers.map((t) => `${
            returnKey(t)
        }\n`)
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
            }
        }
    }
`;
};

 export const getServerSideProps: GetServerSideProps = async function ({params, req, query}) {
    let user: User;
    user = edit(query, req, false);
    const Query = returnQuery(Number(params ?. s), Number(params ?. v), user);
    const { data } = await client.query({
        query: Query,
      });

    return {
        props: {
            s: Number(params ?. s) - 1,
            v: Number(params ?. v) - 1,
            data: {
                ... data,
                maps
            },
            user
        }
    }; 
}; 
 
export default V
