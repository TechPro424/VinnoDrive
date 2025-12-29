'use client';

import {type DragEvent, useState} from "react";
import styles from "@/app/page.module.css";
import FileComponent from "@/components/FileComponent";
import StorageExceededModal from "@/components/StorageExceededModal";
import {upload} from "@/util/actions";
import type FileObj from "@/util/FileObj";

export type File = {
          name: string,
          deduped: boolean,
          uploader: string,
          date: string,
          size: number,
          ref: string,
          id: string,
    dispSize: number,
    unit: string

}




export default function FileList(props) {
    const [res, setRes] = useState(null);

    const files: File[] = props.files

    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleDrop(event: DragEvent<HTMLElement>) {

        const files = event.dataTransfer.files;
        const formdata = new FormData();

        for (const file of files) formdata.append('files', file);

        const response = await upload(formdata);

        if (response.status === 507) {
            setRes(response);
            setIsModalOpen(true);
        }

    }

    return (
        <main className={styles.main}
              onDrop={(e) => {e.preventDefault(); handleDrop(e)}}
        onDragOver={(e) => e.preventDefault()}>
            <div className={"file file-header"} >
                <p className={"name"}>Name</p>
            <p className={"date"}>Date uploaded</p>
            <p className={"deduped"}>Deduplicated</p>
            <p className={"size"}>File size</p>
            </div>
          {files.map((file) => (
              <FileComponent file={file} key={file.id} bin={props.bin}/>
          ))}
            <StorageExceededModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} respomse={res!} />
      </main>
    );
}