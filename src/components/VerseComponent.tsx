import styles from '../../styles/VerseComponent.module.scss'
import React, {useEffect, useState} from 'react'
import { Word, User, TranslationLanguage, Verse, Tafseer, NamoonaTopic, Scalars, Maybe } from '../../utils';
import Link from 'next/link';

const VerseComponent = (props:{highlighted?: (undefined|string),user: User, loc: number[], verse:Verse, translationMap: TranslationLanguage[], tafseerMap: Tafseer[], component: ('s'|'v')}) => {
  const user = props.user;
  const loc = props.loc;
  const verse = props.verse;
  const translationMap = props.translationMap;
  const tafseerMap = props.tafseerMap;
  const [showNotif, setShowNotif] = useState(false)
  const [notif, setNotif] = useState(null)
  const copy = (str: any) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  const rsl = (type: string, key: string) => {
    const link = `https://quranesk.com/${loc[0]+1}/${
      loc[1]+1
    }?${type}=${key}`;
    copy(link);
  };
  const WordDisplay = (props: { nav: [number, number, number] }) => {
    const [s, setS] = useState(false);
    const [audio] = useState(
      typeof Audio !== "undefined" &&
        new Audio(
          `https://words.audios.quranwbw.com/${props.nav[0] + 1}/${(
            props.nav[0] + 1
          )
            .toString()
            .padStart(3, "0")}_${(props.nav[1] + 1)
            .toString()
            .padStart(3, "0")}_${(props.nav[2] + 1)
            .toString()
            .padStart(3, "0")}.mp3`
        )
    );
    const word = (verse?.words[props.nav[2]] as Word) ;
    return (
      <div className={styles.d13} onMouseLeave={() => setS(false)}>
        {s && word[user.wbwtranslation] !== "*" && (
          <div className={styles.d15}>
            <div>
              <h4
                className={
                  Object.keys(word).includes(user.wbwtranslation)
                    ? user.wbwtranslation === "urdu"
                      ? "urdu"
                      : ""
                    : ""
                }
              >
                {Object.keys(word).includes(user.wbwtranslation)
                  ? word[user.wbwtranslation]
                  : "Loading..."}
              </h4>
            </div>
          </div>
        )}
        <div
          className={styles.d14}
          onClick={() => {
            setS(true);
            if (typeof audio !== "undefined")
              (audio as HTMLAudioElement).play();
          }}
          onMouseEnter={() => setS(true)}
        >
          <h1 className={user.rasm}>
            {typeof word[user.rasm] !== "undefined" ? word[user.rasm] : "."}
          </h1>
        </div>
        {s && (
          <div className={styles.d16}>
            <div>
              <h4>{word.transliteration}</h4>
            </div>
          </div>
        )}
      </div>
    );
  };
  useEffect(()=>{
if(showNotif){
  setTimeout(()=>setShowNotif(false), 4000)
}
  }, [showNotif])
  return (
    <div className='verse'>
    <div className={styles.d11}>
    <div className={styles.d17}>
              <h4>{loc.map((n:number) => n + 1).join(":")}</h4>
            </div> 
      <div className={styles.d12}>
        <div className={styles.d42}>
        { (
          <>
            {" "}
            {verse.words.map((w:any, i:any) => (
              <WordDisplay nav={[loc[0], loc[1], i]} key={`${loc[0]+1}-${loc[1]+1}-${i+1}`} />
            ))}
          </>
        ) }
        </div>
        { (
        <h3 className={styles.d28}>
          {verse.meta.tse[0] !== "+" && (
            <span className={styles.d30}>{verse.meta.tse[0]}</span>
          )}
          <span>
          {verse.words.map((w, i, arr) => `${(w as Word).transliteration}${i===arr.length-1?'':' '}`)}
          </span>
          {verse.meta.tse[1] !== "+" && (
            <span className={styles.d30}>{verse.meta.tse[1]}</span>
          )}
        </h3>
      )}
      <div className={styles.d44}>
        <div>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="share"
              onClick={() => {
                copy(`https://quranesk.com/${loc[0]+1}/${loc[1]+1}`);
              setNotif('Link copied!')
                setShowNotif(true)
                }
              
              }
              style={{marginRight: '5px', transform: 'translateY(-0px)'}}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="copy "
          onClick={() => {
            copy(
              verse.words.map((w:any) => (w )[user.rasm]).join(" ") 
            );
            setNotif('Arabic copied!')
            setShowNotif(true)
            
          }}
          style={{height: '30px', width:'30px'}}
        >
          <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
        </svg>
        </div>
        {showNotif&&<h3 id={styles.notif}>{notif}</h3>}
        <Link href={props.component==="v"?`/${verse.meta.surah}?p=${verse.meta.page}`:`/${verse.meta.surah}/${verse.meta.ayah}`}>
          <div id={props.component==='v'?styles.d100:styles.d101}>
            <h3>GO TO {props.component==='v'?"PAGE":"VERSE"}</h3>
          </div>
        </Link>
      </div>
      </div>
    </div>{(props.component==='v'?(user.translations.length>=1||user.tafseers.length>=1):(user.surahTranslation||user.surahTafseer))&&
    <div className={styles.d26}>
      {(props.component==='v'?user.translations:(props.user.surahTranslation?[props.user.surahTranslation]:[])).map((key:any) => (
        <div className={styles.d27} id={props.highlighted&&props.highlighted===key?'highlighted-text':''} key={key}>
          <div
            className={styles.d41}
            style={{
              flexDirection:
                key.substr(0, 2) === "ur" || key.substr(0, 2) === "fa"
                  ? "row-reverse"
                  : "row",
            }}
          >
            <h1
              className={
                key.substr(0, 2) === "ur" || key.substr(0, 2) === "fa"
                  ? key.substr(0, 2) === "ur"
                    ? "urdu"
                    : "farsi"
                  : ""
              }
              style={{fontSize: key.substr(0, 2) === "ur" || key.substr(0, 2) === "fa"
              ? key.substr(0, 2) === "ur"
                ? "1.5rem"
                : "1.2rem"
              : ""}}
            >
              {
                (translationMap)
                  .map((m:any) => m.translations)
                  .flat(1)
                  .find((translation:any) => translation.key === key).name
              }
            </h1>
            <div style={{display: 'flex'}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="share"
              onClick={() => {
                rsl("t", key);
                  setNotif('Link copied!')
                  setShowNotif(true)}
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            {Object.keys(verse).includes(key) 
             && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="copy "
                onClick={() => {
                  copy((verse )[key]);
                  setNotif('Text copied!')
            setShowNotif(true)
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
            </div>
            
          </div>
          <p
className={
  key.substr(0, 2) === "ur" || key.substr(0, 2) === "fa"
    ? key.substr(0, 2) === "ur"
      ? "urdu"
      : "farsi"
    : "latin"
}
style={{fontSize: key.substr(0, 2) === "ur" || key.substr(0, 2) === "fa"
? key.substr(0, 2) === "ur"
  ? "1.5rem"
  : "1.2rem"
: ""}}
          >
            {Object.keys(verse).includes(key) 
            
              ? (verse )[key]
              : "Loading..."}
          </p>
        </div>
      ))}
      {(props.component==='v'?user.tafseers:(user.surahTafseer?[user.surahTafseer]:[])).map(
        (key:string) =>
          Object.keys(verse).includes(key) &&(key!=='khorramdelfa'?
          ((verse as Verse)[key] as Array<Maybe<Scalars["String"]>>)[0] !== null && (
            key!=='namoonaur'?
            <div className={styles.d27} id={props.highlighted&&props.highlighted===key?'highlighted-text':''}>
              <div className={styles.d41}>
              <h1>
                  {`${
                    (tafseerMap as any).find(
                      (tafseer: any) => tafseer.key === key
                    ).name
                  }, ${+(verse as any)[key][0].split("-")[0] + 1}:${
                    +(verse as any )[key][0].split("-")[1] + 1
                  }${
                    (verse as any)[key][0].split("-")[1] !==
                    (verse as any)[key][0].split("-")[2]
                      ? `-${+(verse as any)[key][0].split("-")[2] + 1}`
                      : ""
                  }`}
                </h1>
                <div style={{display: 'flex'}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="share"
                  onClick={() => {
                    rsl("c", key);
                    setNotif('Link copied!')
                 setShowNotif(true)}
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                
                {Object.keys(verse).includes(key) &&
                 (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="copy "
                    onClick={() => {
                      copy((verse as any)[key][1]);
                      setNotif('Text copied!')
            setShowNotif(true)
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
                </div>
              </div>
              <p className='latin'>
                {Object.keys(verse).includes(key)            
                  ? ((verse as any)[key][1].split('\n')).map(
                      (para: string, i:number) => (
                        <div key={i}>
                          {para}
                        </div>
                      )
                    )
                  : "Loading"}
              </p>
            </div>
            :(
              <div className={styles.d27} id={props.highlighted&&props.highlighted===key?'highlighted-text':''}>
              <div className={styles.d41}>
              <h1 className='urdu'>
                 {tafseerMap.find(tafseer=>tafseer.key===key)?.name}
                </h1>
                <div>
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="share"
                  onClick={() => {
                    setNotif('Link copied!')
                    setShowNotif(true)
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                </div>
              </div>
              <div id={styles.d18}>
              {Object.keys(verse).includes(key)            
                  ? (verse[key] as NamoonaTopic[]).map((topic, i)=>{
                    return(
                      <a key={i} href={`/tafseerenamoona?s=${loc[0]}&v=${loc[1]}&id=${topic.link}`} rel="noreferrer" target='_blank'>
                        <div id={styles.d19} key={i}>
                          <div id={styles.d20}>
                            {topic.range[0]!==-1&&topic.range[0]!==topic.range[1]&&
                            <div id={styles.d21}>
                              <h4>{topic.range[1]+1}-{topic.range[0]+1}</h4>  
                            </div>}
                          <h2 className='urdu'>{topic.title}</h2> 
                          </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        </div> 
                      </a>      
                    )
                  })
                  : "Loading"}
              </div>
            </div>
            )
          ):
          (verse[key]!==""&&
          <div className={styles.d27} id={props.highlighted&&props.highlighted===key?'highlighted-text':''}>
              <div className={styles.d41}>
                 <h1 className='farsi'>
                  {
                    (tafseerMap as any).find(
                      (tafseer: any) => tafseer.key === key
                    ).name
                  }
                </h1>
                <div style={{display: 'flex'}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="share"
                  onClick={() => rsl("c", key)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                
                {Object.keys(verse).includes(key) &&
                 (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="copy "
                    onClick={() => {
                      copy((verse )[key]);
                      setNotif('Text copied!')
                      setShowNotif(true)
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}</div>
              </div>
              <p className='farsi'>
                {Object.keys(verse).includes(key)            
                  ? verse[key]
                  : "Loading"}
              </p>
            </div>)
          )
      )}
    </div>}
    </div>
  );
};
export default VerseComponent