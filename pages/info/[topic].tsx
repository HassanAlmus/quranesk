import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import styles from "../../styles/topic.module.scss";
import Head from "next/head";
import {gql, useQuery, useClient} from "urql"

const TopicQuery = gql `
  query Query($topic: String!) {
    text(topic: $topic)
  }
`;

const Topic = () => {
    const client = useClient()
    const router = useRouter();
    const [
        {
            data
        }
    ] = useQuery({
        query: TopicQuery,
        variables: {
            topic: router.query.topic
        }
    });
    const [loading, setLoading] = useState(true)
    const [stateText, setText] = useState(undefined);

    useEffect(() => {
        if (data) {
            setText(data.text)
        }
    }, [data])

    const link = (topic : string) => {
        router.push(`/info/${topic}`, undefined, {shallow: true});
        setLoading(true)
        client.query(TopicQuery, {topic: topic}).toPromise().then(result => {
            setText(result.data.text)
            setLoading(false)
        })
    }
    return (
        <div className={
            styles.d1
        }>
            <Head>
                <title>{
                    `Quranesk.com | ${
                        router.query.topic
                    }`
                }</title>
            </Head>
            <nav className={
                styles.d2
            }>
                <Link passHref={true}
                    href="/">
                    <div className={
                        styles.d5
                    }>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" className="arrow-left">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                        </svg>
                    </div>
                </Link>
                <div className={
                        styles.d4
                    }
                    onClick={
                        () => link("about")
                }>
                    <h2 id={
                        router.query.topic === "about" ? "highlighted" : ""
                    }>
                        About
                    </h2>
                </div>
                <div className={
                        styles.d4
                    }
                    onClick={
                        () => link("contact")
                }>
                    <h2 id={
                        router.query.topic === "contact" ? "highlighted" : ""
                    }>
                        Contact
                    </h2>
                </div>
                <div className={
                        styles.d4
                    }
                    onClick={
                        () => link("contribute")
                }>
                    <h2 id={
                        router.query.topic === "contribute" ? "highlighted" : ""
                    }>
                        Contribute
                    </h2>
                </div>
                <div className={
                        styles.d4
                    }
                    onClick={
                        () => link("credits")
                }>
                    <h2 id={
                        router.query.topic === "credits" ? "highlighted" : ""
                    }>
                        Credits
                    </h2>
                </div>
            </nav>
            <div className={
                styles.d3
            }>
                {
                loading && stateText === undefined ? (
                    <h1>Loading...</h1>
                ) : (
                  <p className="latin">
<div dangerouslySetInnerHTML={
                        {__html: stateText}
                    }/>
                  </p>
                )
            } </div>
        </div>
    );
};

export default Topic;
