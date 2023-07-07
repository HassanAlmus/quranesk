import dynamic from "next/dynamic";
import Head from "next/head";
import ReactAudioPlayer from "react-audio-player";
import { useSnapshot } from "valtio";
import Loader from "../../src/components/Loader";
import Navbar from "../../src/components/Navbar";
import VerseComponent from "../../src/components/VerseComponent";
import useV, { state } from "../../src/components/useV";
import maps from "../../src/data/maps";
import styles from "../../styles/v.module.scss";
import { Surah, User, Verse } from "../../utils";

const Popup = dynamic(() => import("../../src/components/popup"));

const V = (props: {
  data: {
    cs: Surah;
    ps: Surah;
    verse: Verse;
  };
  s: number;
  v: number;
  urqlState: any;
  user: User;
}) => {
  const {
    setRasm,
    setVerseAudio,
    setTafseers,
    showPopup,
    setShowPopup,
    setTranslations,
    setWbwtranslation,
    returnCondition,
    audio,
    setPlaying,
    setAutoplay,
    loc,
    setLoc,
    user,
    nextVerse,
    prevVerse,
    myRef,
  } = useV();

  const snap = useSnapshot(state);

  const translationMap = maps.translationLanguages;
  const tafseerMap = maps.tafseers;
  const audioMap = maps.audio;

  if (snap.init) {
    return (
      <>
        <div ref={myRef}></div>
        <Head>
          <title>
            {" "}
            {`[${loc[0] + 1}:${loc[1] + 1}] ${snap.cs.title
              .split(" (")[1]
              .substring(0, snap.cs.title.split(" (")[1].length - 1)} (${
              snap.cs.title.split(" (")[0]
            })`}
          </title>
          <meta
            property="og:title"
            content={`[${loc[0] + 1}:${loc[1] + 1}] ${snap.cs.title
              .split(" (")[1]
              .substring(0, snap.cs.title.split(" (")[1].length - 1)} (${
              snap.cs.title.split(" (")[0]
            })`}
          ></meta>
          <meta
            name="keywords"
            content={`${snap.cs.title}, ${
              snap.cs.titleAr
            }, ${snap.verse.words.map((w: any) => `${w?.transliteration}, `)}${
              loc[0] + 1
            }:${loc[1] + 1}`}
          ></meta>
          <meta
            name="description"
            content={
              snap.verse[
                Object.keys(snap.verse).filter(
                  (key) =>
                    key !== "__typename" &&
                    key !== "id" &&
                    key !== "words" &&
                    key !== "meta"
                )[0]
              ] as string
            }
          ></meta>
          <meta
            name="og:description"
            content={
              snap.verse[
                Object.keys(snap.verse).filter(
                  (key) =>
                    key !== "__typename" &&
                    key !== "id" &&
                    key !== "words" &&
                    key !== "meta"
                )[0]
              ] as string
            }
          ></meta>
        </Head>
        {returnCondition() ? (
          <>
            <Navbar
              cs={snap.cs}
              setShowPopup={(v: boolean) => setShowPopup(v)}
            />
            <div id={styles.d200}>
              <div className={styles.d9}>
                <VerseComponent
                  user={user}
                  loc={loc}
                  component="v"
                  verse={snap.verse}
                  translationMap={translationMap}
                  tafseerMap={tafseerMap}
                  highlighted={snap.highlighted}
                />
              </div>
            </div>
            {showPopup && (
              <Popup
                setTranslations={(v: any) => setTranslations(v)}
                v={true}
                loc={loc}
                tafseerMap={tafseerMap}
                audioMap={audioMap}
                translationMap={translationMap}
                setTafseers={(v: any) => setTafseers(v)}
                setWbwtranslation={(v: any) => setWbwtranslation(v)}
                user={user}
                setRasm={(v: any) => setRasm(v)}
                setAudio={(v: any) => setVerseAudio(v)}
                setShowPopup={(v: any) => setShowPopup(v)}
              />
            )}
            {
              <div className={styles.d34}>
                <ReactAudioPlayer
                  src={audio}
                  autoPlay={user.autoplay}
                  controls
                  onEnded={() => {
                    if (!user.autoplay) {
                      setPlaying(false);
                    }
                    if (user.autoplay) {
                      if (!(loc[0] === 113 && loc[1] === 6)) {
                        setLoc(
                          loc[1] + 1 === snap.cs.count
                            ? [loc[0] + 1, 0]
                            : [loc[0], loc[1] + 1]
                        );
                      }
                    }
                  }}
                />

                <div id={styles.d100}>
                  <div
                    className={user.autoplay ? styles.d41 : styles.d39}
                    onClick={() => setAutoplay(!user.autoplay)}
                  >
                    <h1>AUTO</h1>
                  </div>
                  <div className={styles.d35} onClick={() => prevVerse()}>
                    <h1>ˆ</h1>
                  </div>
                  <h2> {loc[1] + 1}</h2>
                  <div className={styles.d36} onClick={() => nextVerse()}>
                    <h1>ˇ</h1>
                  </div>
                </div>
              </div>
            }{" "}
          </>
        ) : (
          <div className="hsloading">
            <Loader />
          </div>
        )}{" "}
      </>
    );
  } else {
    return (
      <div className="hsloading">
        <Loader />
      </div>
    );
  }
};

export default V;
