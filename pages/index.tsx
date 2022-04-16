import React, {useEffect, useState, useRef} from "react";
import styles from "../styles/index.module.scss";
import Image from "next/image";
import Select from "react-select";
import Link from "next/link";
import Head from 'next/head'
import Loader from '../src/components/Loader'
import surahs from '../src/data/surahinfo.json'
import {state as state2} from "../src/components/useV";

const Logo = (props : {
    name: string
}) => (
    <div style={
        {
            position: "relative",
            height: 50,
            width: 100
        }
    }>
        <Image src={
                `/${
                    props.name
                }.png`
            }
            layout="fill"
            objectFit="contain"
            alt={props.name}
            title={props.name}/>
    </div>
)

const Index = () => {
    const [ss, setSs] = useState < null | {
        value: number;
        label: string
    } > (null);
    const [sv, setSv] = useState < null | {
        value: number;
        label: number
    } > (null);
    const [sm, setSm] = useState(false);
    const [loading, setLoading] = useState(false)
    const myRef = useRef()
    useEffect(() => {
        (myRef.current as any).scrollIntoView();
        state2.reset()
    }, [])
    return (
        <>
            <div ref={myRef}></div>
            <Head>
                <title>The Holy Quran | Quranesk.com</title>
                <meta property="og:title" content="The Holy Quran | Quranesk.com"/>
                <meta name="keywords" content="Shia Quran, Shia Quran Online, Shia Translation, Shia Quran Translation Online, Quranesk, quranesk.om, Quran, Qur'an, Koran, Coran, Islam, Bible, Shia, Shi'a, Shiite, Shi'ite, Schiite, Translation, Tafseer, Agha Puya, Ahmed Ali, Ali Muhammad Fazil Chinoy, Muhammad Sarwar, Abdullah Yusufali, علامہ جوادی, Allama Jawadi, Allama, Zeeshan, Haider, Jawadi, احمد على, Muhammad Hussein Najafi, محمد حسين نجفى, जीशान हैदर जवेदी, Abdulbakî Gölpınarl, Ağabala Mehdiyev, Dürdanə Cəfərli - leader.ir/az, Vasim Mammadaliyev, Ziya Bunyadov, Abu Rida Muhammad ibn Ahmad ibn Rassoul, Dr.G.H. ABOLQASEMI FAKHRI, Абдулмуҳаммад Оятӣ, AbdolMohammad Ayati, Mohammad Foolavand, Naser Makarem Shirazi, Elahi Ghomshei, Gharaati, Hossein Ansarian, Shahriyar Pargizagar, Karim Mansouri, Mohd. Hossein Sabzali, Hannaneh Khalafi, Hossein Saeediyan, Rafidhi, quran.com"></meta>
            </Head>
            {
            loading ? <div className='hsloading'><Loader/></div> : <body className={
                styles.body
            }>
                <div className={
                    styles.d1
                }>
                    <div className={
                        styles.d2
                    }>
                        <div className={
                            styles.d3
                        }>
                            <div className={
                                    styles.d4
                                }
                                style={
                                    {opacity: 1}
                            }>
                                <Image src="/quran.png"
                                    height={150}
                                    width={250}
                                    alt="quran"/>
                            </div>
                            <div className={
                                    styles.d5
                                }
                                style={
                                    {opacity: 1}
                            }>
                                <h1>
                                    THE HOLY QURAN
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={
                    styles.d7
                }>
                    <div className={
                        styles.d8
                    }>
                        <h3 className={
                            styles.e
                        }>Read verse by verse</h3>
                        <div className={
                            styles.d9
                        }>
                            <div style={
                                    {marginBottom: ".25rem"}
                                }
                                className={
                                    styles.d10
                            }>
                                <h3>Surah</h3>
                                <Select classNamePrefix="d100"
                                    options={
                                        surahs.map((s : any, i : number) => {
                                            return {
                                                value: i + 1,
                                                label: `${
                                                    i + 1
                                                }. ${
                                                    s.title
                                                }`
                                            };
                                        })
                                    }
                                    onChange={setSs}
                                    menuPortalTarget={
                                        typeof window === "undefined" ? null : document.querySelector("body")
                                    }/>
                            </div>
                            <div style={
                                    {marginBottom: ".25rem"}
                                }
                                className={
                                    styles.d10
                            }>
                                {
                                ss && (
                                    <>
                                        <h3>Verse</h3>
                                        <Select classNamePrefix="d101"
                                            options={
                                                Array.from(Array(surahs[ss.value - 1].count).keys()).map((n) => {
                                                    return {
                                                        value: n + 1,
                                                        label: n + 1
                                                    };
                                                })
                                            }
                                            onChange={setSv}
                                            menuPortalTarget={
                                                typeof window === "undefined" ? null : document.querySelector("body")
                                            }/>
                                    </>
                                )
                            } </div>
                        </div>
                        <Link passHref={true}
                            href={
                                ss ? `/${
                                    ss.value
                                }/${
                                    sv ? sv.value : "1"
                                }` : ``
                        }>
                            <div className={
                                    ss ? styles.d17 : styles.d18
                                }
                                /* onClick={
                                    () => setLoading(true)
                            } */
                            >
                                <h2>GO</h2>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="announcement">
                    <h3>Built using</h3>
                    <div className="logo-container"> {
                        [
                            'nextjs',
                            'reactjs',
                            'gql',
                            'apollo',
                            'urql',
                            'ts',
                            'valtio',
                            'sass'
                        ].map(name =>< Logo key={name} name = {
                            name
                        } />)
                    } </div>
                </div>
                <h3 className={
                    styles.e2
                }>Read page by page</h3>
                <div className={
                    styles.d11
                }>
                    {
                    surahs.filter((s : any, i : number, arr : any) => i >= 0 && i <= (sm ? arr.length - 1 : 35)).map((s : any, i : number) => (
                        <div className={
                                styles.d15
                            }
                            key={i}>
                            <Link passHref={true}
                                href={
                                    `/${
                                        i + 1
                                    }/`
                            }>
                                <div className={
                                        styles.d16
                                    }
                                    /* onClick={
                                        () => setLoading(true)
                                } */
                                >
                                    <h1 style={
                                        {fontFamily: 'cinzel-bold'}
                                    }>
                                        {
                                        i + 1
                                    }</h1>
                                </div>
                            </Link>
                            <Link passHref={true}
                                href={
                                    `/${
                                        i + 1
                                    }/`
                            }>
                                <div className={
                                        styles.d19
                                    }
                                    /* onClick={
                                        () => setLoading(true)
                                } */
                                >
                                    <div className={
                                        styles.d12
                                    }>
                                        <div className={
                                            styles.d13
                                        }>
                                            <div className={
                                                styles.d14
                                            }>
                                                <h2> {
                                                    s.title.split(" (")[1].substring(0, s.title.split(" (")[1].length - 1)
                                                } </h2>
                                                <h3 style={
                                                    {fontFamily: 'cinzel-regular'}
                                                }>
                                                    {
                                                    s.title.split(" (")[0]
                                                }</h3>
                                            </div>
                                            <h1 className="uthmani">
                                                {
                                                s.titleAr
                                            }</h1>
                                        </div>
                                    </div>
                                    <div className={
                                        styles.d20
                                    }>
                                        <div className={
                                            styles.d21
                                        }>
                                            <h2>
                                                <span>{
                                                    s.count
                                                }
                                                    {" "}</span>
                                                verses
                                            </h2>
                                        </div>
                                        <div className={
                                            styles.d22
                                        }>
                                            <h2>{
                                                s.place
                                            }</h2>
                                        </div>
                                    </div>
                                    <div className={
                                        styles.d24
                                    }>
                                        {
                                        s.juz.length === 1 ? (
                                            <div className={
                                                styles.d23
                                            }>
                                                <h2>{
                                                    `Juz ${ + (s.juz[0] ?. index as string)
                                                    }`
                                                }</h2>
                                            </div>
                                        ) : (s.juz.map((j : any, i : number) => (
                                            <div className={
                                                    styles.d23
                                                }
                                                key={i}>
                                                <h2> {
                                                    `Juz ${ + (j ?. index as string)
                                                    }: ${
                                                        j ?. verse.start
                                                    }-${
                                                        j ?. verse.end
                                                    }`
                                                } </h2>
                                            </div>
                                        )))
                                    } </div>
                                </div>
                            </Link>
                        </div>
                    ))
                } </div>
                <div className={
                        styles.d30
                    }
                    onClick={
                        () => setSm(!sm)
                }>
                    <div className={
                        styles.d31
                    }>
                        <h2>{
                            sm ? "Show Less" : "Show More"
                        }</h2>
                    </div>
                </div>
                <div className={
                    styles.d26
                }>
                    <div className={
                        styles.d27
                    }>
                        <div className={
                            styles.d29
                        }>
                            <Image src="/book-pile.png"
                                height={400}
                                width={300}
                                alt="Book Pile"/>
                        </div>
                        <div className={
                            styles.d28
                        }>
                            <a className='a' href="https://al-islam.org" target="_blank" rel="noreferrer">
                                <h1>al-islam.org</h1>
                            </a>
                            <h3>Islamic Books {"&"}
                                Resources on a Variety of Topics</h3>
                        </div>
                    </div>
                    <div className={
                        styles.d27
                    }>
                        <div className={
                            styles.d29
                        }>
                            <Image src="/book-pile.jpg"
                                height={400}
                                width={300}
                                alt="Vintage Book Pile"/>
                        </div>
                        <div className={
                            styles.d28
                        }>
                            <a className='a' href="https://thaqalayn.net" target="_blank" rel="noreferrer">
                                <h1>thaqalayn.net</h1>
                            </a>
                            <h3>Sunan {"&"}
                                Hadeeths of the Prophet and the Imams</h3>
                        </div>
                    </div>
                </div>
                <footer>
                    <div className={
                        styles.d25
                    }>
                        <nav>
                            <h1>Navigate</h1>
                            <Link passHref={true}
                                href="/info/about">
                                <div>
                                    <h2>About</h2>
                                </div>
                            </Link>
                            <Link passHref={true}
                                href="/info/contact">
                                <div>
                                    <h2>Contact</h2>
                                </div>
                            </Link>
                            <Link passHref={true}
                                href="/info/contribute">
                                <div>
                                    <h2>Contribute</h2>
                                </div>
                            </Link>
                            <Link passHref={true}
                                href="/info/credits">
                                <div>
                                    <h2>Credits</h2>
                                </div>
                            </Link>
                        </nav>
                        <nav>
                            <h1>Useful Links</h1>
                            <div>
                                <a className='a' href="https://al-islam.org" target="_blank" rel="noreferrer">
                                    al-islam.org
                                </a>
                            </div>
                            <div>
                                <a className='a' href="https://thaqalayn.net" target="_blank" rel="noreferrer">
                                    thaqalayn.net
                                </a>
                            </div>
                        </nav>
                        <p className="latin">
                            <br></br>© 2022
                            <a className='a' href="https://quranesk.com">quranesk.com</a>. All
                                                                                                                                                                              Rights Reserved.
                        </p>
                    </div>
                </footer>
            </body>
        } </>
    );
};

export default Index;
