import Image from "next/image";
import styles from "../../styles/v.module.scss";
import { Tafseer, TranslationLanguage } from "../../utils";

const Popup = (props: any) => {
  return (
    <div className={styles.d18} onClick={() => props.setShowPopup(false)}>
      <div className={styles.d19} onClick={(e) => e.stopPropagation()}>
        <div className={styles.d29} onClick={() => props.setShowPopup(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#FFFFFF"
            className="arrow-left"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        </div>
        {!props.v && (
          <h3 id={styles.d105}>
            In order to view more than one translation/tafseer simultaneously,
            navigate to specific verse.
          </h3>
        )}
        {!props.v && (
          <>
            <h1>Surah Audio</h1>
            <select
              onChange={(e) => {
                props.setSurahAudio(e.target.value);
              }}
              className={styles.d25}
            >
              {props.surahAudioMap.map((reciter) => {
                return (
                  <option
                    key={reciter}
                    selected={reciter === props.user.surahAudio ? true : false}
                    value={reciter.split(" ").join("")}
                  >
                    {reciter}
                  </option>
                );
              })}{" "}
            </select>
          </>
        )}
        <h2>Commentaries</h2>
        <div className={styles.d22}>
          {props.tafseerMap.map((tafseer: Tafseer, key: number) => {
            return (
              <label key={key} className={styles.d23}>
                <input
                  className={styles.d24}
                  type="checkbox"
                  checked={
                    props.v
                      ? props.user.tafseers.includes(tafseer.key)
                      : props.user.surahTafseer === tafseer.key
                  }
                  onChange={(event) => {
                    if (props.v) {
                      if (props.user.tafseers.includes(tafseer.key)) {
                        props.setTafseers(
                          props.user.tafseers.filter(
                            (key2: any) => key2 !== tafseer.key
                          )
                        );
                      } else {
                        props.setTafseers([
                          ...props.user.tafseers,
                          tafseer.key,
                        ]);
                      }
                    } else {
                      if (props.user.surahTafseer === tafseer.key) {
                        props.setTafseers(null);
                      } else {
                        props.setTafseers(tafseer.key);
                      }
                    }
                  }}
                />
                <h4
                  className={
                    tafseer.key === "namoonaur"
                      ? "urdu"
                      : tafseer.key === "khorramdelfa"
                      ? "farsi"
                      : ""
                  }
                >
                  {tafseer.name}
                </h4>
              </label>
            );
          })}{" "}
        </div>
        <h2>Word Translation</h2>
        <select
          value={props.user.wbwtranslation}
          onChange={(e) => {
            props.setWbwtranslation(e.target.value);
          }}
          className={styles.d25}
        >
          {[
            "English",
            "Urdu",
            "Hindi",
            "Turkish",
            "Bangla",
            "Indonesian",
            "German",
            "Russian",
            "Ingush",
          ].map((language) => {
            return (
              <option key={language} value={language.toLowerCase()}>
                {language}
              </option>
            );
          })}{" "}
        </select>
        <h2>Arabic Word Type</h2>
        <select
          value={props.user.rasm}
          onChange={(e) => {
            props.setRasm(e.target.value);
          }}
          className={styles.d25}
        >
          {[
            ["Uthman Hafs", "uthmani"],
            ["Indopak", "indopak"],
          ].map((rasmItem, i) => {
            return (
              <option key={i} value={rasmItem[1]}>
                {rasmItem[0]}
              </option>
            );
          })}{" "}
        </select>
        {props.v && (
          <>
            <h2>Verse Audio</h2>
            <select
              value={props.user.audio}
              onChange={(ev) => {
                props.setAudio(ev.target.value);
              }}
              className={styles.d25}
            >
              {props.audioMap.map((ae: any) => {
                return (
                  <option key={ae.key} value={ae.key}>
                    {`${ae.name} (${ae.type})`}
                  </option>
                );
              })}{" "}
            </select>
          </>
        )}
        <h2>Translations</h2>
        {(props.translationMap as TranslationLanguage[]).map(
          (translationLanguage) => {
            const t = translationLanguage;
            return (
              <div key={translationLanguage.name} className={styles.d20}>
                <div>
                  <div className={styles.d21}>
                    <Image src={`/${t.img}`} height={30} width={30} />
                    <h3
                      style={{ marginLeft: ".5rem" }}
                      className={
                        t.name === "Urdu" || t.name === "Farsi"
                          ? t.name === "Urdu"
                            ? "urdu"
                            : "farsi"
                          : ""
                      }
                    >
                      {t.name2}{" "}
                    </h3>
                  </div>
                  <div className={styles.d22}>
                    {t.translations.map((tr, i) => {
                      return (
                        <label key={i} className={styles.d23}>
                          <input
                            className={styles.d24}
                            type="checkbox"
                            checked={
                              props.v
                                ? props.user.translations.includes(tr.key)
                                : props.user.surahTranslation === tr.key
                            }
                            onChange={async () => {
                              if (props.v) {
                                if (props.user.translations.includes(tr.key)) {
                                  props.setTranslations(
                                    props.user.translations.filter(
                                      (ft: any) => ft !== tr.key
                                    )
                                  );
                                } else {
                                  props.setTranslations([
                                    tr.key,
                                    ...props.user.translations,
                                  ]);
                                }
                              } else {
                                if (props.user.surahTranslation === tr.key) {
                                  console.log("cancel");
                                  props.setTranslations(null);
                                } else {
                                  props.setTranslations(tr.key);
                                }
                              }
                            }}
                          />
                          <h4
                            className={
                              t.name === "Urdu" || t.name === "Farsi"
                                ? "urdu"
                                : ""
                            }
                          >
                            {tr.name}{" "}
                          </h4>
                        </label>
                      );
                    })}{" "}
                  </div>
                </div>
              </div>
            );
          }
        )}{" "}
      </div>
    </div>
  );
};

export default Popup;
