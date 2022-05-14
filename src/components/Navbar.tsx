import styles from "../../styles/v.module.scss";
import {Surah} from "../../utils";
import Link from "next/link";
import Image from "next/image";

const Navbar = ({cs, setShowPopup} : {
    cs: Surah;
    setShowPopup: any
}) => (
    <div id={
        styles.d50
    }>
        <div className={
            styles.d2
        }>
            <div className={
                styles.d3
            }>
                <Link passHref={true}
                    href="/">
                    <Image alt="logo" src="/logo.png"
                        height={40}
                        width={40}/>
                </Link>
            </div>
            <div className={
                styles.d4
            }>
                <div className={
                    styles.d6
                }>
                    <h3> {
                        cs.title.split(" (")[1].substring(0, cs.title.split(" (")[1].length - 1)
                    } </h3>
                    <h4>{
                        cs.title.split(" (")[0]
                    }</h4>
                    <h2 className="uthmani">
                        {
                        cs.titleAr
                    }</h2>
                </div>
            </div>
            <div className={
                    styles.d5
                }
                onClick={
                    () => setShowPopup(true)
            }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    className={"settings"}
                    viewBox="0 0 24 24"
                    stroke="#01335E">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
        </div>
    </div>
);
export default Navbar;
