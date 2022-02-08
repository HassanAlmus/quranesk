import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/topic.module.scss";
import Head from "next/head";
import { useQuery, gql, useLazyQuery } from "@apollo/client";

const TopicQuery = gql`
  query Query($topic: String!) {
    text(topic: $topic)
  }
`;

const Topic = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(TopicQuery, {variables: {topic: router.query.topic}});

  if (error) {
    console.error(error);
    return null;
  }

  const [getText, textData] = useLazyQuery(TopicQuery, {
    variables: { topic: router.query.topic },
  });

  useEffect(() => {
    getText();
  }, [router.query.topic]);

  useEffect(() => {
    if (textData.data && textData.data.text) {
      setText(textData.data.text);
    }
  }, [textData]);

  const [stateText, setText] = useState(data ? data.text : "");
  const link = (topic: string) =>
    router.push(`/info/${topic}`, undefined, { shallow: true });
    
  return (
    <div className={styles.d1}>
      <Head>
        <title>{`Quranesk.com | ${router.query.topic}`}</title>
      </Head>
      <nav className={styles.d2}>
        <Link href="/">
          <div className={styles.d5}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#FFFFFF"
              className="arrow-left"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
          </div>
        </Link>
        <div className={styles.d4} onClick={() => link("about")}>
          <h2 id={router.query.topic === "about" ? "highlighted" : ""}>
            About
          </h2>
        </div>
        <div className={styles.d4} onClick={() => link("contact")}>
          <h2 id={router.query.topic === "contact" ? "highlighted" : ""}>
            Contact
          </h2>
        </div>
        <div className={styles.d4} onClick={() => link("contribute")}>
          <h2 id={router.query.topic === "contribute" ? "highlighted" : ""}>
            Contribute
          </h2>
        </div>
        <div className={styles.d4} onClick={() => link("credits")}>
          <h2 id={router.query.topic === "credits" ? "highlighted" : ""}>
            Credits
          </h2>
        </div>
      </nav>
      <div className={styles.d3}>
        {textData.loading && textData.data === undefined ? (
          <h1>Loading...</h1>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: stateText }} />
        )}
      </div>
    </div>
  );
};

export default Topic;
