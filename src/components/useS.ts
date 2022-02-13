import {useEffect} from "react";
import {useLazyQuery} from "@apollo/client";
import {gql} from "@apollo/client";
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
import {returnKey} from "./useV";
import {useSnapshot, proxy} from "valtio";
import {client} from "../../urql-client";
import {useClient} from "urql";

export const state = proxy({
    loading: false,
    cs: null,
    ps: null,
    ns: null,
    isFirstPage: null,
    init: false,
    verses: null,
    showPopup: false
})

const useS = (props : {
    data: {
        maps: any;
        cs: Surah;
        ps: Surah;
        ns: Surah;
        page: Verse[];
    };
    s: number;
    p: number;
    isFirstPage: boolean;
    user: User;
    maps: any;
}) => {
    const client = useClient()
    const snap = useSnapshot(state)
    const router = useRouter();
    const translationMap: TranslationLanguage[] = props.maps.translationLanguages;
    const audioMap: Audio[] = props.maps.audio;
    const tafseerMap: Tafseer[] = props.maps.tafseers;
    const [user, setUser] = useState(props.user);
    const [s, setS] = useState(props.s)
    const [p, setP] = useState(props.p)

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

    useEffect(() => {
        Cookies.set("user", JSON.stringify(user), {
            expires: 60 * 60 * 24 * 1000
        });
    }, []);

    useEffect(() => {
        if (snap.verses && snap.cs && snap.ps && snap.ns) {
            Cookies.set("user", JSON.stringify(user), {expires: 365});
        }
    }, [user]);

    const WBWQuery = (key : string) => gql `
     query Query {
       page(s: ${s}, p: ${p}){
         id
         words{
           ${key}
         }
       }
     }
    `;

    const fetchWBW = (key: string) => {
        client.query(WBWQuery(key)).toPromise().then(result=>{
            let newVerses = snap.verses;
            newVerses = snap.verses.map((verse, e) => {
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
            })
            state.verses = (newVerses);
        })
    }

    useEffect(() => {
        if (snap.verses) {
            if (!Object.keys(snap.verses[0].words[0] as Word).includes(user.wbwtranslation)) {
                fetchWBW(user.wbwtranslation)
            }
        }
    }, [user.wbwtranslation]);

    useEffect(() => {
        if (snap.verses) {
            if (!Object.keys(snap.verses[0].words[0] as Word).includes(user.rasm)) {
                fetchWBW(user.rasm);
            }
        }
    }, [user.rasm]);

    const PageQuery = (_p:number) => gql`
    query Query{
      page(s: ${s}, p: ${_p}) {
       id
       ${
        [
            ...user.translations,
            ...user.tafseers
        ].map((key) => returnKey(key)).join("\n")
    }
       words {
         ${user.wbwtranslation}
         ${user.rasm}
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

   const LineQuery = (key:string) => gql`
   query Query{
     page(s: ${s}, p: ${p}) {
      id
      ${returnKey(key)}
     }
   }
  `;

    useEffect(() => {
        if (snap.verses) {
            if ([
                ...user.translations,
                ...user.tafseers
            ].some((key) => !Object.keys(snap.verses[0]).includes(key))) {
                const key = [
                    ...user.translations,
                    ...user.tafseers
                ].find((key) => !Object.keys(snap.verses[0]).includes(key));
                client.query(LineQuery(key)).toPromise().then(result=>{
                    snap.verses.forEach((verse, i)=>{
                        state.verses[i][key]=result.data.page[i][key];
                    })
                })
            }
        }
    }, [user.translations, user.tafseers]);

    const SurahQuery = (type: ('next'|'prev'), _s:number) => gql `
    query Query {
      page(s: ${_s} ) {
      id
      ${
        [
            ...user.translations,
            ...user.tafseers
        ].map((key) => returnKey(key)).join("\n")
    }
      words {
        ${user.wbwtranslation}
        ${user.rasm}
        transliteration
      }
      meta{
        tse
        ayah
        surah
        page
      }
      }
      ${_s!==0&&_s!==113?`${type==='next'?'ns':"ps"}: surah(s: ${type==='next'?_s+1:_s-1}){
        id
        title
        titleAr
        count
        startPage
      }`:""}
    }
  `;

    const getSurah = (type: ('next'|'prev'), s:number) => {
        client.query(SurahQuery(type, s)).toPromise().then(result => {
            state.verses = (result.data.page);
            if(type==='next')state.ns = (result.data.ns)
            if(type==='prev')state.ps = (result.data.ps)
            state.loading = false
        })
    }

    const getPage = (p:number) => {
        client.query(PageQuery(p)).toPromise().then(result => {
            state.verses = (result.data.page);
            state.loading = false
        })
    }

    const nextPage = () => {
        state.loading = true;
        if (snap.verses[snap.verses.length - 1].meta.ayah === snap.cs.count) {
            getSurah('next', s+1)
            state.cs = (snap.ns)
            state.ps = (snap.cs)
            state.isFirstPage = (true)
            setS(s + 1)
            setP(snap.ns.startPage)
        } else {
            getPage(p+1)
            state.isFirstPage = (false)
            setP(p + 1)
        }
    }

    const prevPage = () => {
        state.loading = true;
        if (snap.isFirstPage) {
            getSurah('prev', s-1)
            state.ns = (snap.cs)
            state.cs = (snap.ps)
            setS(s - 1)
            setP(snap.ps.startPage)
        } else {
            getPage(p-1)
            if (p - 1 === snap.cs.startPage) 
                state.isFirstPage = (true);
            setP(p - 1)
        }
    }

    useEffect(() => {
        if (snap.isFirstPage===true) {
            router.push(`/${
                s + 1
            }`, undefined, {shallow: true})
        } else if (snap.isFirstPage===false) {
            router.push(`/${
                s + 1
            }?p=${p}`, undefined, {shallow: true})
        }
    }, [p, s])

    return {
        setRasm,
        setAudio,
        setTafseers,
        translationMap,
        user,
        setTranslations,
        setWbwtranslation,
        tafseerMap,
        audioMap,
        getPage,
        nextPage,
        prevPage,
        s,
        setS,
        p,
        setP
    };
};
export default useS;
