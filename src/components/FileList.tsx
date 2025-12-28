'use client';

import type {DragEvent} from "react";
import styles from "@/app/page.module.css";
import FileComponent from "@/components/FileComponent";
import {upload} from "@/util/actions";


async function handleDrop(event: DragEvent<HTMLElement>) {

    const files = event.dataTransfer.files;
    const formdata = new FormData();

    for (const file of files) formdata.append('files', file);

    await upload(formdata);

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