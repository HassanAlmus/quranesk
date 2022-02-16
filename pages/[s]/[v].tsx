import {GetServerSideProps} from "next";
import React, {useEffect} from "react";
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
import {client, ssrCache} from '../../urql-client'
import { useQuery, gql} from "urql";
import { useSnapshot, proxy} from "valtio"
import { state } from "../../src/components/useV";
import { edit2 } from "../../src/components/edit";
import Link from 'next/link'

const Popup = dynamic(() => import ('../../src/components/Popup'));

const V = (props : {
    data: {
        cs: Surah,
        ps: Surah,
        verse: Verse
    },
    s: number,
    v: number,
    urqlState: any,
    user: User
}) => {

    const {
        setRasm,
        setAudio,
        setTafseers,
        showPopup,
        setShowPopup,
        setTranslations,
        setWbwtranslation,
        returnCondition,
        audio,
        setPlaying,
        setAutoplay,
        setAudio2,
        loc, setLoc,
        user
    } = useV();

    const snap = useSnapshot(state)

    if(snap.init){
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
                        snap.cs.title.split(" (")[1].substring(0, snap.cs.title.split(" (")[1].length - 1)
                    } (${
                        snap.cs.title.split(" (")[0]
                    })`
                }</title>
                <meta property="og:title"
                    content={
                        `[${
                            loc[0] + 1
                        }:${
                            loc[1] + 1
                        }] ${
                            snap.cs.title.split(" (")[1].substring(0, snap.cs.title.split(" (")[1].length - 1)
                        } (${
                            snap.cs.title.split(" (")[0]
                        })`
                }></meta>
                <meta name="keywords"
                    content={
                        `${
                            snap.cs.title
                        }, ${
                            snap.cs.titleAr
                        }, ${
                            snap.verse.words.map((w : any) => `${
                                w ?. transliteration
                            }, `)
                        }${
                            loc[0] + 1
                        }:${
                            loc[1] + 1
                        }`
                }></meta>
                <meta name="description"
                    content={
                        snap.verse[Object.keys(snap.verse).filter(key => key !== '__typename' && key !== 'id' && key !== 'words' && key !== 'meta')[0]] as string
                }></meta>
                <meta name="og:description"
                    content={
                        snap.verse[Object.keys(snap.verse).filter(key => key !== '__typename' && key !== 'id' && key !== 'words' && key !== 'meta')[0]] as string
                }></meta>
            </Head>
            {
            returnCondition() ? <>
                <Navbar cs={snap.cs}
                    setShowPopup={
                        (v : boolean) => setShowPopup(v)
                    }/>
                <div className={
                    styles.d9
                }><VerseComponent user={user}
                        loc={loc}
                        component='v'
                        verse={snap.verse}
                        translationMap={snap.translationMap}
                        tafseerMap={snap.tafseerMap}/></div>
                {
                showPopup && <Popup setTranslations={
                        (v : any) => setTranslations(v)
                    }
                    v={true}
                    loc={loc}
                    tafseerMap={snap.tafseerMap}
                    audioMap={snap.audioMap}
                    translationMap={snap.translationMap}
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
                                            setLoc(loc[1] + 1 === snap.cs.count ? [
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
                                                snap.ps.count - 1
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
                                            setLoc(loc[1] + 1 === snap.cs.count ? [
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
    }else{
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

/* export async function getServerSideProps({req, params, query}) {
      const user = edit2(query, req);
      let data;
      await client.query(returnQuery(Number(params.s), Number(params.v), user)).toPromise().then(result=>{
          data=result.data
      })
      return {props: {s: Number(params.s)-1, v: Number(params.v)-1, data, user}}
}
 */
export default V
