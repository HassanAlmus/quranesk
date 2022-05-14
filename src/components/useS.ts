import {useEffect, useRef} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {useState} from "react";
import {
    User,
    Audio,
    Tafseer,
    TranslationLanguage,
    Word,
    RecitersList
} from "../../utils";
import {returnKey} from "./useV";
import {useSnapshot, proxy} from "valtio";
import {useClient, gql} from "urql";
import edit from "./edit";
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
            endPage
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
            endPage
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
                endPage
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
        ${
        _user.surahTranslation ? returnKey(_user.surahTranslation) : ""
    }
        ${
        _user.surahTafseer ? returnKey(_user.surahTafseer) : ""
    }
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

const list = {
    "AmerAlKadhimi": "Amer Al Kadhimi",
    "MaythamAlTammar": "Maytham Al Tammar",
    "AhmedAlDabagh": "Ahmed Al Dabagh",
    "ShahriarParhizgar": "Shahriar Parhizgar",
    "QassemRedheii": "Qassem Redheii",
    "JawadBanohiTusi": "Jawad Banohi Tusi",
    "MahdiSiafZadeh": "Mahdi Siaf Zadeh",
    "MustafaAlSarraf": "Mustafa Al Sarraf",
    "MuhammadAliAlDehdeshti": "Muhammad Ali Al Dehdeshti",
    "MuhammadHosseinSaidian": "Muhammad Hossein Saidian",
    "AbdulKabeerHaidari": "Abdul Kabeer Haidari",
    "KarimMansouri": "Karim Mansouri"
}

const useS = (props) => {
    const myRef = useRef();
    const snap = useSnapshot(state)
    const client = useClient()
    const router = useRouter();
    const translationMap: TranslationLanguage[] = maps.translationLanguages;
    const audioMap: Audio[] = maps.audio;
    const tafseerMap: Tafseer[] = maps.tafseers;
    const surahAudioMap: string[] = maps.surahAudio;
    const [user, setUser] = useState < User > (edit(router.query, Cookies.get('user')));
    const [s, setS] = useState(props.s)
    const [p, setP] = useState(props.p)
    const [cs, setCs] = useState(props.data.cs)
    const [ps, setPs] = useState(props.data.ps)
    const [ns, setNs] = useState(props.data.ns)
    const [isFirstPage, setIsFirstPage] = useState < ('none' | true | false) > ('none')
    const [verses, setVerses] = useState(props.data.page)
    const [showPopup, setShowPopup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingSurah, setLoadingSurah] = useState(false)
    const [surahAudioIndex, setSurahAudioIndex] = useState(props.s)
    const [showAudio, setShowAudio] = useState(false)

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
    const setSurahAudio = (v : any) => setUser({
        ...user,
        surahAudio: v.includes(' ') ? v : list[v]
    });

    useEffect(() => {
        (myRef.current as any).scrollIntoView()
    }, [p, s])

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

    const SurahQuery = (type : ('next' | 'prev'), _s : number) => gql `
    query Query {
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
        endPage
      }` : "surah(s:1){title}"
    }
    }
  `;
    const PageQuery = (_s : (null | number), _p : number) => gql `
    query Query{
      page(s: ${
        _s.toString()
    }, p: ${
        _p.toString()
    }) {
       id
       ${
        user.surahTranslation ? returnKey(user.surahTranslation) : ""
    }
       ${
        user.surahTafseer ? returnKey(user.surahTafseer) : ""
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

    const getPage = (p : number) => {
        client.query(PageQuery(s, p)).toPromise().then(result => {
            setVerses(result.data.page);
            setLoading(false)
            state.loadedVerses = true
        })
    }

    useEffect(() => {
        (myRef.current as any).scrollIntoView();
        if (window.location.href.split('?p=')[1] !== undefined && Number(window.location.href.split('?p=')[1]) !== cs.startPage) {
            setIsFirstPage(false)
            setLoading(true)
            const queryp = Number(window.location.href.split('?p=')[1]);
            setP(queryp);
            getPage(queryp)
            state.init = true
            if (queryp === cs.endPage) {
                client.query(PageQuery(s + 1, ns.startPage)).toPromise()
                client.query(SurahQuery('next', s)).toPromise()
            } else {
                client.query(PageQuery(s, queryp + 1)).toPromise()
            } client.query(PageQuery(s, queryp - 1)).toPromise()
        } else {
            state.init = true;
            state.loadedVerses = true;
            if (cs.count === props.data.page[props.data.page.length - 1].meta.ayah) {
                client.query(PageQuery(s + 1, ns.startPage)).toPromise();
                client.query(SurahQuery('next', props.s + 1)).toPromise();
            } else {
                client.query(PageQuery(s, p + 1)).toPromise();
            };
            client.query(PageQuery(s - 1, ps.startPage)).toPromise();
            client.query(PageQuery(s, p)).toPromise();
        }
    }, [])

    const getSurah = (type : ('next' | 'prev'), s : number) => {
        client.query(SurahQuery(type, s)).toPromise().then(result => {
            if (type === 'next') {
                setNs(result.data.ns)
                if (result.data.ns && ns.startPage === ns.endPage) {
                    client.query(PageQuery(s + 1, result.data.ns.startPage)).toPromise()
                }
            }
            if (type === 'prev') {
                setPs(result.data.ps)
                if (result.data.ps) 
                    client.query(PageQuery(s - 1, result.data.ps.startPage)).toPromise()
                
            }
            setLoadingSurah(false)
        })
        client.query(PageQuery(s, (type === 'next' ? ns : ps).startPage)).toPromise().then(result => {
            setVerses(result.data.page);
            setLoading(false)
        })
    }

    const nextPage = () => {
        setLoading(true);
        if (verses[verses.length - 1].meta.ayah === cs.count) {
            setLoadingSurah(true)
            router.push(`/${
                s + 2
            }`, undefined, {shallow: true})
            getSurah('next', s + 1)
            if (ns.startPage === ns.endPage) {
                client.query(SurahQuery('next', s + 1)).toPromise()
            } else {
                client.query(PageQuery(s + 1, ns.startPage + 1)).toPromise()
            }
            setCs(ns)
            setPs(cs)
            setIsFirstPage(true)
            setS(s + 1)
            setP(ns.startPage)
        } else {
            router.push(`/${
                s + 1
            }?p=${
                p + 1
            }`, undefined, {shallow: true})
            getPage(p + 1)
            setIsFirstPage(false)
            if (p + 1 === cs.endPage) {
                client.query(SurahQuery('next', s)).toPromise()
                client.query(PageQuery(s + 1, ns.startPage)).toPromise()
            } else {
                client.query(PageQuery(s, p + 2)).toPromise()
            }
            setP(p + 1)
        }
    }

    const prevPage = () => {
        setLoading(true);
        if (isFirstPage) {
            setLoadingSurah(true)
            router.push(`/${
                s
            }`, undefined, {shallow: true})
            getSurah('prev', s - 1)
            client.query(PageQuery(s - 1, ps.startPage + 1)).toPromise()
            setNs(cs)
            setCs(ps)
            setS(s - 1)
            setP(ps.startPage)
        } else {
            router.push(`/${
                s + 1
            }?p=${
                p - 1
            }`, undefined, {shallow: true})
            getPage(p - 1)
            if (p - 2 >= cs.startPage) {
                client.query(PageQuery(s, p - 2)).toPromise();
            } else if (p - 2 < cs.startPage) {
                client.query(SurahQuery('prev', s - 1)).toPromise()
                client.query(PageQuery(s - 1, ps.startPage)).toPromise()
            }
            if (p - 1 === cs.startPage) {
                setIsFirstPage(true);
            }
            setP(p - 1)
        }
    }

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
            if (verses.some((verse) => !Object.keys(verse).includes(user.surahTranslation) || !Object.keys(verse).includes(user.surahTafseer))) {
                const key = [user.surahTranslation, user.surahTafseer].find((key) => !Object.keys(verses[0]).includes(key));
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
        myRef,
        loadingSurah,
        surahAudioIndex,
        showAudio,
        setShowAudio,
        setSurahAudioIndex,
        surahAudioMap,
        setSurahAudio
    };
};
export default useS;
