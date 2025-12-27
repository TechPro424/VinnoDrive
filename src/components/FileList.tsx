'use client';

import type {DragEvent} from "react";
import styles from "@/app/page.module.css";
import FileComponent from "@/components/FileComponent";
import {reVal} from "@/util/actions";


async function handleDrop(event: DragEvent<HTMLElement>) {

    const files = event.dataTransfer.files;
    const formdata = new FormData();

    for (const file of files) formdata.append('files', file);


    try {
        const res = await fetch(`http://localhost:3000/api/0/`, {
            method: "POST",
            body: formdata
        })
        if (res.ok) await reVal('/')

    } catch (error) {
        throw error;
    }
}


export default function FileList(props) {
    const files = props.files
    return (
        <main className={styles.main}
              onDrop={(e) => {e.preventDefault(); handleDrop(e)}}
        onDragOver={(e) => e.preventDefault()}>
          {files.map((file) => (
              <FileComponent file={file} key={file.id}/>
          ))}
      </main>
    );
}