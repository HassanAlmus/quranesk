import {useEffect} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {useState} from "react";
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
import {gql, useClient} from 'urql'
import maps from '../data/maps'
import edit from "./edit";

//YA ABALFAZL

export const state = proxy({
    init: false,
    cs: null,
    ps: null,
    verse: null,
    reset: () => {
        state.verse=null;
        state.ps=null;
        state.cs=null;
        state.init=false;
    }
})

export const returnKey = (key : string) : string => key === "namoonaur" ? "namoonaur{\ntitle\nrange\nlink\n}" : key;

const returnQuery = (s : number, v : number, user : User) => {
    return gql `
    query Query {
        cs: surah(s: ${
        (s - 1).toString()
    }){
            id
            titleAr
            title
            count
        }
        ps: surah(s: ${
        (s - 1 !== 0 ? s - 2 : s - 1).toString()
    }){
            id
            count
        }
        verse(s: ${
        (s - 1).toString()
    }, v: ${
        (v - 1).toString()
    }) {
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

const useV = () => {
    const client = useClient()
    const snap = useSnapshot(state)
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [audio, setAudio2] = useState("");
    const [loc, setLoc] = useState([undefined, undefined])
    const [user, setUser] = useState < User > (edit(router.query, Cookies.get('user')))

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

    useEffect(()=>{
        if(!snap.init&&router.query.v!==undefined&& router.query.s!==undefined){
            client.query(returnQuery(Number(router.query.s), Number(router.query.v), user)).toPromise().then(result=>{
                if(result.error){
                    console.log(result.error)
                }
                state.verse=result.data.verse
                state.ps=result.data.ps
                state.cs=result.data.cs
                setLoc([Number(router.query.s)-1, Number(router.query.v)-1])
                state.init=true;
        })
        client.query(VerseQuery(Number(router.query.s)-1, Number(router.query.v))).toPromise()
        setAudio2(`${
            maps.audio.find((e : any) => e.key === user.audio) ?. url
        }${
            (loc[0] + 1).toString().padStart(3, "0")
        }${
            (loc[1] + 1).toString().padStart(3, "0")
        }.mp3`)
    }
        }, [router.query])

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

    const VerseQuery = (s, v) => gql `
   query Query {
     cs: surah(s: ${
        s.toString()
    }){
       id
       titleAr
       title
       count
     }
     ps: surah(s: ${
        (s !== 0 ? s - 1 : 0).toString()
    }){
       id
       count
     }
     verse(s: ${
        s.toString()
    }, v: ${
        v.toString()
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
        page
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
        if (snap.verse&&snap.init) {
            router.push(`/${
                loc[0] + 1
            }/${
                loc[1] + 1
            }`, undefined, {shallow: true});
            client.query(VerseQuery(loc[0], loc[1])).toPromise().then(result => {
                state.verse = (result.data.verse);
                state.cs = (result.data.cs);
                state.ps = (result.data.ps);
            })
            client.query(VerseQuery(loc[0], loc[1]+1)).toPromise()
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
