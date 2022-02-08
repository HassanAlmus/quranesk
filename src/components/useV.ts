import { useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import maps from "../data/maps";
import {
  User,
  Surah,
  Verse,
  Audio,
  Tafseer,
  TranslationLanguage,
  Word,
} from "../../utils";

export const returnKey = (key: string): string =>
  key === "namoonaur" ? "namoonaur{\ntitle\nrange\nlink\n}" : key;

const useV = (props: {
  data: {
    maps: any;
    cs: Surah;
    ps: Surah;
    verse: Verse;
  };
  s: number;
  v: number;
  user: User;
}) => {
  const router = useRouter();
  const translationMap: TranslationLanguage[] =
    props.data.maps.translationLanguages;
  const audioMap: Audio[] = props.data.maps.audio;
  const tafseerMap: Tafseer[] = props.data.maps.tafseers;
  const [loc, setLoc] = useState([props.s, props.v]);
  const [user, setUser] = useState(props.user);
  const [verse, setVerse] = useState<Verse>(props.data.verse);
  const [cs, setCs] = useState<Surah>(props.data.cs);
  const [ps, setPs] = useState<Surah>(props.data.ps);
  const [showPopup, setShowPopup] = useState(false);

  const setTranslations = (v: any) =>
    setUser({
      ...user,
      translations: v,
    });
  const setTafseers = (v: any) =>
    setUser({
      ...user,
      tafseers: v,
    });
  const setWbwtranslation = (v: any) =>
    setUser({
      ...user,
      wbwtranslation: v,
    });
  const setAudio = (v: any) =>
    setUser({
      ...user,
      audio: v,
    });
  const setRasm = (v: any) =>
    setUser({
      ...user,
      rasm: v,
    });
  const setAutoplay = (v: any) =>
    setUser({
      ...user,
      autoplay: v,
    });

  const [audio, setAudio2] = useState(
    `${maps.audio.find((e: any) => e.key === user.audio)?.url}${(loc[0] + 1)
      .toString()
      .padStart(3, "0")}${(loc[1] + 1).toString().padStart(3, "0")}.mp3`
  );

  const [playing, setPlaying] = useState(false);

  const returnCondition = () =>
    loc[0] + 1 === verse.meta.surah && loc[1] + 1 === verse.meta.ayah;

  useEffect(() => {
    Cookies.set("user", JSON.stringify(user), {
      expires: 60 * 60 * 24 * 1000,
    });
  }, []);

  useEffect(() => {
    if (verse && cs && ps) {
      Cookies.set("user", JSON.stringify(user), { expires: 365 });
    }
  }, [user]);

  const WBWQuery = (key: string) => gql`
     query Query ($s: Int!, $v: Int!){
       verse(s: $s, v: $v){
         id
         words{
           ${key}
         }
       }
     }
    `;

  const [getWBW, WBWData] = useLazyQuery(WBWQuery(user.wbwtranslation), {
    variables: {
      s: loc[0],
      v: loc[1],
    },
  });

  useEffect(() => {
    if (verse) {
      if (!Object.keys(verse.words[0] as Word).includes(user.wbwtranslation)) {
        getWBW();
      }
    }
  }, [user.wbwtranslation]);

  useEffect(() => {
    if (WBWData.error)
      console.log(JSON.stringify(WBWData.error), user.wbwtranslation);

    if (WBWData.data && WBWData.data.verse && verse) {
      setVerse({
        ...verse,
        words: verse.words.map((w: any, i: number) => {
          let nw = {
            ...w,
          };
          nw[user.wbwtranslation] =
            WBWData.data.verse.words[i][user.wbwtranslation];
          return nw;
        }),
      });
    }
  }, [WBWData]);

  useEffect(() => {
    setPlaying(false);
    setAudio2(
      `${maps.audio.find((e: any) => e.key === user.audio)?.url}${(loc[0] + 1)
        .toString()
        .padStart(3, "0")}${(loc[1] + 1).toString().padStart(3, "0")}.mp3`
    );
  }, [user.audio]);

  const [getRasm, rasmData] = useLazyQuery(WBWQuery(user.rasm), {
    variables: {
      s: loc[0],
      v: loc[1],
    },
  });

  useEffect(() => {
    if (verse) {
      if (!Object.keys(verse.words[0] as Word).includes(user.rasm)) {
        getRasm();
      }
    }
  }, [user.rasm]);

  useEffect(() => {
    if (verse) {
      if (rasmData.error)
        console.log(JSON.stringify(rasmData.error), user.rasm);
      if (
        rasmData.data &&
        rasmData.data.verse &&
        verse &&
        verse.meta.ayah === loc[1] + 1
      ) {
        setVerse({
          ...verse,
          words: verse.words.map((w: any, i: number) => {
            let nw = {
              ...w,
            };
            nw[user.rasm] = rasmData.data.verse.words[i][user.rasm];
            return nw;
          }),
        });
      }
    }
  }, [rasmData]);

  const LineQuery = (key: string) => gql`
     query Query ($s: Int!, $v: Int!){
       verse(s: $s, v: $v){
         id
         ${returnKey(key)}
       }
     }
    `;

  const [getLine, lineData] = useLazyQuery(
    LineQuery(
      [...user.tafseers, ...user.translations].find(
        (key) =>
          !Object.keys(
            verse
              ? verse
              : {
                  s: "s",
                }
          ).includes(key)
      ) as string
    ),
    {
      variables: {
        s: +(router.query.s as string) - 1,
        v: +(router.query.v as string) - 1,
      },
    }
  );

  useEffect(() => {
    if (verse) {
      if (
        [...user.translations, ...user.tafseers].some(
          (key) => !Object.keys(verse).includes(key)
        )
      ) {
        getLine();
      }
    }
  }, [user.translations, user.tafseers]);

  useEffect(() => {
    if (lineData.error) console.log(JSON.stringify(lineData.error));

    if (lineData.data && lineData.data.verse) {
      const key = [...user.translations, ...user.tafseers].find(
        (key) => !Object.keys(verse).includes(key)
      ) as string;
      let newVerse = JSON.parse(JSON.stringify(verse));
      verse[key] = lineData.data.verse[key];
      setVerse(newVerse);
    }
  }, [lineData]);

  const VerseQuery = (keys: string[], r: string, w: string) => gql`
    query Query($s: Int!, $v: Int!, $s2: Int!){
      cs: surah(s: $s){
        id
        titleAr
        title
        count
      }
      ps: surah(s: $s2){
        id
        count
      }
      verse(s: $s, v: $v) {
       id
       ${keys.map((key) => returnKey(key)).join("\n")}
       words {
         ${w}
         ${r}
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

  const [getVerse, verseData] = useLazyQuery(
    VerseQuery(
      [...user.translations, ...user.tafseers],
      user.rasm,
      user.wbwtranslation
    ),
    {
      variables: {
        s: loc[0],
        v: loc[1],
        s2: loc[0] !== 0 ? loc[0] - 1 : 0,
      },
    }
  );

  useEffect(() => {
    if (verseData.error) console.log(JSON.stringify(verseData.error));

    if (verseData.data && verseData.called && verseData.data.verse) {
      setVerse(verseData.data.verse);
      setCs(verseData.data.cs);
      setPs(verseData.data.ps);
    }
  }, [verseData]);

  useEffect(() => {
    if (verse) {
      router.push(`/${loc[0] + 1}/${loc[1] + 1}`, undefined, { shallow: true });
      getVerse();
    }
    setAudio2(
      `${maps.audio.find((e: any) => e.key === user.audio)?.url}${(loc[0] + 1)
        .toString()
        .padStart(3, "0")}${(loc[1] + 1).toString().padStart(3, "0")}.mp3`
    );
  }, [loc]);

  const [initialState, setInitialState] = useState(null)
  
/*
  useEffect(()=>{
   console.log(initialState)
  }, [initialState])

  useEffect(() => {
     const fetch = async () => {
      let user: User;
      user = edit(router.query, Cookies.getJSON('user'), true);
      const Query = returnQuery(Number(router.query.s), Number(router.query.v), user);
      const res = await request(`${
          process.env.NEXT_PUBLIC_API_URL
      }/api/graphql`, Query);
      const data = res
      setInitialState(data)
      console.log(data)
    } 
    fetch()
  }, [])
 */

  return {
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
    initialState
  };
};
export default useV;
