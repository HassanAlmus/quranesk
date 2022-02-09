import {GetServerSideProps} from "next";
import React from "react";
import styles from "../styles/tafseerenamoona.module.scss";
import Head from "next/head";
import {NamoonaTopic} from "../utils";
import { gql } from "@apollo/client"
import client from "../apollo-client";

const returnQuery = (s : number, link : string) => {
    return gql `
        query Query {
            namoonaTopic(s: ${s}, link: "${link}"){
                range
                title
                text
            }
        }
    `;
};

const TafseereNamoona = (props : {
    link: string,
    s: number,
    v: number,
    data: {
        namoonaTopic: NamoonaTopic
    }
}) => {
    return (<>
        <Head>
            <title> {
                `تفسير نمونه - ${
                    props.data.namoonaTopic.title
                }`
            }</title>
            <meta property="og:title"
                content={
                    `تفسير نمونه - ${
                        props.data.namoonaTopic.title
                    }`
            }></meta>
            <meta name="description"
                content={
                    props.data.namoonaTopic.text
            }></meta>
            <meta name="og:description"
                content={
                    props.data.namoonaTopic.text
            }></meta>
        </Head>
        <div id={
            styles.d1
        }>
            <div id={
                styles.d2
            }>
                <div id={
                    styles.d3
                }>
                    <h1 className='urdu'> {
                        props.data.namoonaTopic.title
                    }</h1>
                    <div id={
                        styles.d4
                    }>
                        <h4> {
                            props.data.namoonaTopic.range[0] !== -1 && props.data.namoonaTopic.range[0] !== props.data.namoonaTopic.range[1] ? `${
                                props.data.namoonaTopic.range[1] + 1
                            }-${
                                props.data.namoonaTopic.range[0] + 1
                            }` : (props.data.namoonaTopic.range[0] === -1 ? `Surah ${
                                props.s + 1
                            }` : (props.data.namoonaTopic.range[0] === props.data.namoonaTopic.range[1] ? props.data.namoonaTopic.range[1] + 1 : props.data.namoonaTopic.range.map((n) => n + 1).join('-')))
                        } </h4>
                    </div>
                </div>
                <div id={styles.d5}>
                    {props.data.namoonaTopic.text.split('\n').map((t, i)=><p key={i} className='urdu'>{t}</p>)}
                </div>
                
            </div>
        </div>
    </>);
};

export const getServerSideProps: GetServerSideProps = async function ({query}) {
    const Query = returnQuery(Number(query ?. s), (query ?. id as string));

    const { data } = await client.query({
        query: Query,
      });

    return {
        props: {
            s: Number(query ?. s),
            v: Number(query ?. v),
            link: (query ?. id as string),
            data
        }
    };
};

export default TafseereNamoona
