import {useEffect, useRef} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {useState} from "react";
import {
    User,
    Audio,
    Tafseer,
    TranslationLanguage,
    Word
} from "../../utils";
import {returnKey} from "./useV";
import {useSnapshot, proxy} from "valtio";
import {useClient, gql, useQuery} from "urql";
import edit, {defaultUser} from "./edit";
import maps from '../data/maps'

export const returnQuery = (s : number, p : (undefined | number), _user : User) => {
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
            reciters {
                ${
        _user.surahAudio
    }
            }
        }
        ps: surah(s: ${
        (s - 1 !== 0 ? s - 2 : s - 1).toString()
    }){
            id
            titleAr
            title
            count
            startPage
            reciters {
              ${
        _user.surahAudio
    }
            }
        }
        ns: surah(s: ${
        (s - 1 !== 113 ? s : s - 1).toString()
    }){
                id
                titleAr
                title
                count
                startPage
                reciters {
                  ${
        _user.surahAudio
    }
                }
            }
        page(s: ${
        (s - 1).toString()
    }${
        p ? `, p:${p}` : ""
    }) {
        ${_user.surahTranslation?returnKey(_user.surahTranslation):""}
        ${_user.surahTafseer?returnKey(_user.surahTafseer):""}
            words {
            ${
        _user.rasm.split("-")[0]
    }
            ${
        _user.wbwtranslation
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

export const state = proxy({loadedVerses: false, verses: null, init: false})

const useS = (props) => {
    const myRef = useRef();
    const snap = useSnapshot(state)
    const client = useClient()
    const router = useRouter();
    const translationMap: TranslationLanguage[] = maps.translationLanguages;
    const audioMap: Audio[] = maps.audio;
    const tafseerMap: Tafseer[] = maps.tafseers;
    const [user, setUser] = useState<User>(edit(router.query, Cookies.get('user')));
    const [s, setS] = useState(props.s)
    const [p, setP] = useState(props.p)
    const [cs, setCs] = useState(props.data.cs)
    const [ps, setPs] = useState(props.data.ps)
    const [ns, setNs] = useState(props.data.ns)
    const [isFirstPage, setIsFirstPage] = useState<('none'|true|false)>('none')
    const [verses, setVerses] = useState(props.data.page)
    const [showPopup, setShowPopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const PageQuery = (_p : number) => gql `
    query Query{
      page(s: ${
        s.toString()
    }, p: ${
        _p.toString()
    }) {
       id
       ${user.surahTranslation?returnKey(user.surahTranslation):""}
       ${user.surahTafseer?returnKey(user.surahTafseer):""}
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
        if (isFirstPage !== 'none') {
            router.push(`/${
                s + 1
            }${
                isFirstPage ? "" : `?p=${p}`
            }`, undefined, {shallow: true})
        }
    }, [p, s])

    const getPage = (p : number) => {
        client.query(PageQuery(p)).toPromise().then(result => {
            setVerses(result.data.page);
            setLoading(false)
            state.loadedVerses = true
        })
    }

    useEffect(() => {
        (myRef.current as any).scrollIntoView()
        const NewPageQuery = () => gql `
        query Query {
          page(s: ${
            props.s.toString()
        }, p: ${
            props.p.toString()
        }) {
           id
           ${user.surahTranslation?returnKey(user.surahTranslation):""}
           ${user.surahTafseer?returnKey(user.surahTafseer):""}
           words {
             ${
            user.wbwtranslation !== defaultUser.translations[0] ? user.wbwtranslation : ""
        }
           } 
          }
        }
       `
        if (window.location.href.split('?p=')[1] !== undefined && Number(window.location.href.split('?p=')[1]) !== cs.startPage) {
            setIsFirstPage(false)
            setLoading(true)
            setP(Number(window.location.href.split('?p=')[1]));
            getPage(Number(window.location.href.split('?p=')[1]))
            state.init = true
        } else {
            router.push(`/${
                s + 1
            }`, undefined, {shallow: true})
            state.init = true;
            if(user.wbwtranslation!==defaultUser.wbwtranslation||user.surahTafseer!==null||user.surahTranslation!==defaultUser.surahTranslation){
                client.query(NewPageQuery()).toPromise().then(result => {
                    [user.surahTranslation, user.surahTranslation].forEach((key) => {
                        const newVerses = props.data.page
                        newVerses.forEach((verse, i) => {
                            newVerses[i][key] = result.data.page[i][key]
                            verse.words.forEach((word, e) => {
                                newVerses[i].words[e][user.wbwtranslation] = result.data.page[i].words[e][user.wbwtranslation]
                            })
                        })
                        setVerses(newVerses)
                        state.loadedVerses = true
                    })
                })
            }else{
                state.loadedVerses=true
            }
        }
    }, [])

    const setTranslation = (v : any) => setUser({
        ...user,
        surahTranslation: v
    });
    const setTafseer = (v : any) => setUser({
        ...user,
        surahTafseer: v
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

    useEffect(() => {
        Cookies.set("user", JSON.stringify(user), {
            expires: 60 * 60 * 24 * 1000
        });
    }, []);

    useEffect(() => {
        if (verses && cs && ps && ns) {
            Cookies.set("user", JSON.stringify(user), {expires: 365});
        }
    }, [user]);

    const WBWQuery = (key : string) => gql `
     query Query {
       page(s: ${
        s.toString()
    }, p: ${
        p.toString()
    }){
         id
         words{
           ${key}
         }
       }
     }
    `;

    const fetchWBW = (key : string) => {
        client.query(WBWQuery(key)).toPromise().then(result => {
            setVerses(verses.map((verse, e) => {
                return {
                    ...verse,
                    words: verse.words.map(
                        (w : any, i : number) => {
                            let nw = {
                                ...w
                            };
                            nw[key] = result.data.page[e].words[i][key];
                            return nw;
                        }
                    )
                }
            }));
        })
    }

    useEffect(() => {
        if (snap.loadedVerses) {
            if (!Object.keys(verses[0].words[0] as Word).includes(user.wbwtranslation)) {
                fetchWBW(user.wbwtranslation)
            }
        }
    }, [user.wbwtranslation]);

    useEffect(() => {
        if (verses) {
            if (!Object.keys(verses[0].words[0] as Word).includes(user.rasm)) {
                fetchWBW(user.rasm);
            }
        }
    }, [user.rasm]);

    const LineQuery = (key : string) => gql `
    query Query{
        page(s: ${
            s.toString()
        }, p: ${
            p.toString()
        }) {
        id
        ${
            returnKey(key)
        }
        }
    }
    `;

    useEffect(() => {
        if (verses && snap.loadedVerses) {
            console.log('should fetch')
            if (verses.some((verse)=>!Object.keys(verse).includes(user.surahTranslation)||!Object.keys(verse).includes(user.surahTafseer))) {
                console.log('gon fetch')
                const key = [
                    user.surahTranslation,
                    user.surahTafseer
                ].find((key) => !Object.keys(verses[0]).includes(key));
                client.query(LineQuery(key)).toPromise().then(result => {
                    setVerses(verses.map((verse, i) => {
                        let newVerse = verse
                        newVerse[key] = result.data.page[i][key]
                        return newVerse
                    }))
                })
            }
        }
    }, [user.surahTranslation, user.surahTafseer]);

    const SurahQuery = (type : ('next' | 'prev'), _s : number) => gql `
    query Query {
      page(s: ${
        _s.toString()
    } ) {
      id
      ${user.surahTranslation?returnKey(user.surahTranslation):""}
      ${user.surahTafseer?returnKey(user.surahTafseer):""}
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
      ${
        _s !== 0 && _s !== 113 ? `${
            type === 'next' ? 'ns' : "ps"
        }: surah(s: ${
            type === 'next' ? _s + 1 : _s - 1
        }){
        id
        title
        titleAr
        count
        startPage
      }` : ""
    }
    }
  `;

    const getSurah = (type : ('next' | 'prev'), s : number) => {
        client.query(SurahQuery(type, s)).toPromise().then(result => {
            setVerses(result.data.page);
            if (type === 'next') 
                setNs(result.data.ns)
            if (type === 'prev') 
                setPs(result.data.ps)
                setLoading(false)
        })
    }

    const nextPage = () => {
        setLoading(true);
        if (verses[verses.length - 1].meta.ayah === cs.count) {
            getSurah('next', s + 1)
            setCs(ns)
            setPs(cs)
            setIsFirstPage(true)
            setS(s + 1)
            setP(ns.startPage)
        } else {
            getPage(p + 1)
            setIsFirstPage(false)
            setP(p + 1)
        }
    }

    const prevPage = () => {
        setLoading(true);
        if (isFirstPage) {
            getSurah('prev', s - 1)
            setNs(cs)
            setCs(ps)
            setS(s - 1)
            setP(ps.startPage)
        } else {
            getPage(p - 1)
            if (p - 1 === cs.startPage) {
                setIsFirstPage(true);
            }
            setP(p - 1)
        }
    }

    return {
        setRasm,
        setAudio,
        setTafseer,
        translationMap,
        user,
        setTranslation,
        setWbwtranslation,
        tafseerMap,
        audioMap,
        getPage,
        nextPage,
        prevPage,
        s,
        setS,
        p,
        cs,
        isFirstPage,
        verses,
        ps,
        ns,
        loading,
        showPopup,
        setShowPopup, 
        myRef
    };
};
export default useS;
