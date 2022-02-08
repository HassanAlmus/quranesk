import { useState} from "react";
import { User} from "../../utils";
import styles from '../../styles/audio.module.scss'
import ReactPlayer from 'react-player/lazy'

const A = (props : {
    user: User,
    audioType: ('surah' | 'verse'),
    currentSurah: number,
    currentVerse: [number, number]
}) => {
    const [currentSurah, setCurrentSurah] = useState(props.currentSurah)
    const [currentVerse, setCurrentVerse] = useState(props.currentVerse)
    const [playing, setPlaying] = useState(false)

    return (
        <div id={
            styles.d1
        }>
{/*             <div id={
                styles.d2
            }>
                <h2>{
                    props.audioType === "surah" ? props.user.surahAudio : props.user.audio
                }
                    <span>{
                        props.audioType === "surah" ? "" : `${
                            currentVerse[0] + 1
                        }:${
                            currentVerse[1] + 1
                        }`
                    }</span>
                </h2>
            </div> */}

            <button onClick={()=>setPlaying(!playing)}>{playing?"stop":"play"}</button>
            <ReactPlayer playing={playing} url="https://shiavoice.com/media/quran/krim_mensuri/telawe/gzywgiwk7606.mp3"/>
        </div>
        
    )
}

export default A
