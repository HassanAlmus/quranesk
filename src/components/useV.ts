import {useEffect} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {useState} from "react";
import maps from "../data/maps";
import {
    User,
    Surah,
    Verse,
    Audio,
    Tafseer,
    TranslationLanguage,
    Word
} from "../../utils";
import {useSnapshot, proxy} from "valtio";
import {useQuery, gql, useClient} from 'urql'

export const state = proxy({
    loaded: false,
    cs: null,
    ps: null,
    verse: null,
    translationMap: null,
    tafseerMap: null,
    audioMap: null
})

export const returnKey = (key : string) : string => key === "namoonaur" ? "namoonaur{\ntitle\nrange\nlink\n}" : key;

const useV = (props : {
    data: {
        cs: Surah,
        ps: Surah,
        verse: Verse
    },
    s: number,
    v: number,
    maps: any,
    urqlState: any,
    user: User
}) => {
    const client = useClient()
    const snap = useSnapshot(state)
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [audio, setAudio2] = useState("");
    const [loc, setLoc] = useState([props.s, props.v])
    const [user, setUser] = useState < User > (props.user)

    useEffect(() => {
        if (user.audio) {
            setPlaying(false);
            setAudio2(`${
                maps.audio.find((e : any) => e.key === user.audio) ?. url
            }${
                (loc[0] + 1).toString().padStart(3, "0")
            }${
                (loc[1] + 1).toString().padStart(3, "0")
            }.mp3`);
        }
    }, [snap]);

    const returnCondition = () => loc[0] + 1 === snap.verse.meta.surah && loc[1] + 1 === snap.verse.meta.ayah;

    const setTranslations = (v : any) => setUser({
        ...user,
        translations: v
    });
    const setTafseers = (v : any) => setUser({
        ...user,
        tafseers: v
    });
    const setWbwtranslation = (v : any) => setUser({
        ...user,
        wbwtranslation: v
    });
    const setAudio = (v : any) => setUser({
        ...user,
        audio: v
    });
    const setRasm = (v : any) => setUser({
        ...user,
        rasm: v
    });
    const setAutoplay = (v : any) => setUser({
        ...user,
        autoplay: v
    });

    useEffect(() => {
        Cookies.set("user", JSON.stringify(user), {
            expires: 60 * 60 * 24 * 1000
        });
    }, []);

    useEffect(() => {
        if (snap.verse && snap.cs && snap.ps) {
            Cookies.set("user", JSON.stringify(user), {expires: 365});
        }
    }, [user]);

    const WBWQuery = (t : string) => gql `
     query Query {
       verse(s: ${
        loc[0].toString()
    }, v: ${
        loc[1].toString()
    }){
         id
         words{
           ${
        t === "r" ? user.rasm : user.wbwtranslation
    }
         }
       }
     }
    `;

    const LineQuery = (key : string) => gql `
    query Query {
      verse(s: ${
        (+ (router.query.s as string) - 1).toString()
    }, v: ${
        (+ (router.query.s as string) - 1).toString()
    }){
        id
        ${
        returnKey(key)
    }
      }
    }
   `;

    const VerseQuery = () => gql `
   query Query {
     cs: surah(s: ${
        loc[0].toString()
    }){
       id
       titleAr
       title
       count
     }
     ps: surah(s: ${
        (loc[0] !== 0 ? loc[0] - 1 : 0).toString()
    }){
       id
       count
     }
     verse(s: ${
        loc[0].toString()
    }, v: ${
        loc[1].toString()
    }) {
      id
      ${
        [
            ...user.translations,
            ...user.tafseers
        ].map((key) => returnKey(key)).join("\n")
    }
      words {
        ${
        user.wbwtranslation
    }
        ${
        user.rasm
    }
        transliteration
      }
      meta{
        tse
        ayah
        surah
      }
     }
   }
  `;

    useEffect(() => {
        if (snap.verse) {
            if (!Object.keys(snap.verse.words[0] as Word).includes(user.wbwtranslation)) {
                client.query(WBWQuery("w")).toPromise().then(result => {
                    if (result.error) {
                        console.log(result.error)
                    } else {
                        state.verse = ({
                            ... snap.verse,
                            words: snap.verse.words.map(
                                (w : any, i : number) => {
                                    let nw = {
                                        ...w
                                    };
                                    nw[user.wbwtranslation] = result.data.verse.words[i][user.wbwtranslation];
                                    return nw;
                                }
                            )
                        });
                    }
                })
            }
        }
    }, [user.wbwtranslation]);

    useEffect(() => {
        if (snap.verse) {
            if (!Object.keys(snap.verse.words[0] as Word).includes(user.rasm)) {
                client.query(WBWQuery("r")).toPromise().then(result => {
                    state.verse = ({
                        ... snap.verse,
                        words: snap.verse.words.map(
                            (w : any, i : number) => {
                                let nw = {
                                    ...w
                                };
                                nw[user.rasm] = result.data.verse.words[i][user.rasm];
                                return nw;
                            }
                        )
                    });
                })
            }
        }
    }, [user.rasm]);

    useEffect(() => {
        if (snap.verse) {
            const key = [
                ...user.translations,
                ...user.tafseers
            ].find((key) => !Object.keys(snap.verse).includes(key))as string
            if (key) {
                client.query(LineQuery(key)).toPromise().then(result => {
                    let newVerse = JSON.parse(JSON.stringify(snap.verse));
                    newVerse[key] = result.data.verse[key];
                    state.verse = (newVerse);
                })
            }
        }
    }, [user.translations, user.tafseers]);

    useEffect(() => {
        if (snap.verse) {
            router.push(`/${
                loc[0] + 1
            }/${
                loc[1] + 1
            }`, undefined, {shallow: true});
            client.query(VerseQuery()).toPromise().then(result => {
                state.verse = (result.data.verse);
                state.cs = (result.data.cs);
                state.ps = (result.data.ps);
            })
        }
        setAudio2(`${
            maps.audio.find((e : any) => e.key === user.audio) ?. url
        }${
            (loc[0] + 1).toString().padStart(3, "0")
        }${
            (loc[1] + 1).toString().padStart(3, "0")
        }.mp3`);
    }, [loc]);

    return {
        setRasm,
        setAudio,
        setTafseers,
        showPopup,
        setShowPopup,
        setTranslations,
        setWbwtranslation,
        returnCondition,
        playing,
        audio,
        setPlaying,
        setAutoplay,
        setAudio2,
        loc,
        setLoc,
        user,
        setUser
    };
};
export default useV;
