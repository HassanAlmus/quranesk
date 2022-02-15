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
import {returnKey} from "./useV";
import {useSnapshot, proxy} from "valtio";
import {useClient, gql} from "urql";
import edit, { defaultUser } from "./edit";
import maps from '../data/maps'

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

const state = proxy({
    init: false
})

const useS = (props) => {
    const snap = useSnapshot(state)
    const client = useClient()
    const router = useRouter();
    const translationMap: TranslationLanguage[] = maps.translationLanguages;
    const audioMap: Audio[] = maps.audio;
    const tafseerMap: Tafseer[] = maps.tafseers;
    const [user, setUser] = useState(edit(router.query, Cookies.get('user')));
    const [s, setS] = useState(props.s)
    const [p, setP] = useState(props.p)
    const [cs, setCs] = useState(props.data.cs)
    const [ps, setPs] = useState(props.data.ps)
    const [ns, setNs] = useState(props.data.ns)
    const [isFirstPage, setIsFirstPage] = useState(props.isFirstPage)
    const [verses, setVerses] = useState(props.data.page)
    const [showPopup, setShowPopup] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
    const NewPageQuery = () => gql`
    query Query {
      page(s: ${props.s.toString()}, p: ${props.p.toString()}) {
       id
       ${
        [
            ...user.translations,
            ...user.tafseers
        ].filter(t=>t!==('enqarai')).map((key) => returnKey(key)).join("\n")
    }
       words {
         ${user.wbwtranslation!==defaultUser.translations[0]?user.wbwtranslation:""}
       } 
      }
    }
   `
   client.query(NewPageQuery()).toPromise().then(result=>{
    [
        ...user.translations,
        ...user.tafseers
    ].filter(t=>t!==('enqarai')).forEach((key)=>{
        const newVerses = props.data.page
        newVerses.forEach((verse, i)=>{
            newVerses[i][key]=result.data.page[i][key]
            verse.words.forEach((word, e)=>{
                newVerses[i].words[e][user.wbwtranslation]=result.data.page[i].words[e][user.wbwtranslation]
            })
        })
        setVerses(newVerses)
        state.init=true
    })
   })
    }, [])

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
        if (verses && cs && ps && ns) {
            Cookies.set("user", JSON.stringify(user), {expires: 365});
        }
    }, [user]);  

    const WBWQuery = (key : string) => gql `
     query Query {
       page(s: ${s.toString()}, p: ${p.toString()}){
         id
         words{
           ${key}
         }
       }
     }
    `;

    const fetchWBW = (key: string) => {
        client.query(WBWQuery(key)).toPromise().then(result=>{
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
        if (verses) {
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

    const PageQuery = (_p:number) => gql`
    query Query{
      page(s: ${s.toString()}, p: ${_p.toString()}) {
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
     page(s: ${s.toString()}, p: ${p.toString()}) {
      id
      ${returnKey(key)}
     }
   }
  `;

    useEffect(() => {
        if (verses&&snap.init) {
            if ([
                ...user.translations,
                ...user.tafseers
            ].some((key) => !Object.keys(verses[0]).includes(key))) {
                const key = [
                    ...user.translations,
                    ...user.tafseers
                ].find((key) => !Object.keys(verses[0]).includes(key));
                client.query(LineQuery(key)).toPromise().then(result=>{
                    let newVerses = verses
                    newVerses.forEach((verse, i)=>{
                        newVerses[i][key]=result.data.page[i][key];
                    })
                    setVerses(newVerses)
                })
            }
        }
    }, [user.translations, user.tafseers]);

    const SurahQuery = (type: ('next'|'prev'), _s:number) => gql `
    query Query {
      page(s: ${_s.toString()} ) {
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
            setVerses(result.data.page);
            if(type==='next')setNs(result.data.ns)
            if(type==='prev')setPs(result.data.ps)
            setLoading(false)
        })
    }

    const getPage = (p:number) => {
        client.query(PageQuery(p)).toPromise().then(result => {
            setVerses(result.data.page);
            setLoading(false)
        })
    }

    const nextPage = () => {
        setLoading(true);
        if (verses[verses.length - 1].meta.ayah === cs.count) {
            getSurah('next', s+1)
            setCs(ns)
            setPs(cs)
            setIsFirstPage(true)
            setS(s + 1)
            setP(ns.startPage)
        } else {
            getPage(p+1)
            setIsFirstPage(false)
            setP(p + 1)
        }
    }

    const prevPage = () => {
        setLoading(true);
        if (isFirstPage) {
            getSurah('prev', s-1)
            setNs(cs)
            setCs(ps)
            setS(s - 1)
            setP(ps.startPage)
        } else {
            getPage(p-1)
            if (p - 1 === cs.startPage) {
            setIsFirstPage(true);
        }
            setP(p - 1)
        }
    }

    useEffect(() => {
        if (isFirstPage===true) {
            router.push(`/${
                s + 1
            }`, undefined, {shallow: true})
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
        cs,
        isFirstPage,
verses,
ps, ns,loading, showPopup, setShowPopup
    };
};
export default useS;
