'use client';

import {useRef, useState} from "react";
import StorageExceededModal from "@/components/StorageExceededModal";
import {upload} from "@/util/actions";


export default function NavButton() {
    const [res, setRes] = useState(null);

    const [dropdown, setDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event) => {
        const files = event.target?.files;
        if (files.length === 0) return setDropdown(false);
        const formdata = new FormData();

        for (const file of files) {
            formdata.append('files', file);
        }


        const response = await upload(formdata);

        if (event.target) event.target.value = '';
        setDropdown(false);


        if (response.status === 507) {
            setRes(response);
            setIsModalOpen(true);
        }
    }

    return (
        <>
       <div className="dropdown">
                <input name="File upload" type="file" ref={fileInputRef} onChange={handleFileChange} multiple={true}/>
           <input name="Folder upload" type="file" ref={folderInputRef} onChange={handleFileChange} multiple={true} {...({ webkitdirectory: '', directory: '' } as any)}/>
                <button type="button" onClick={ () => setDropdown(!dropdown) } value={"+ New"}>+ New</button>
                <div id="myDropdown" className={`dropdown-content${dropdown ? " show": ""}` }>
                    <div id={"new_folder"} className={"element"}>New folder</div>
                    <div id={"file_upload"} className={"element"} onClick={() => fileInputRef.current?.click()}>File upload</div>
                    <div className={"element"}  onClick={() => folderInputRef.current?.click()}>Folder upload</div>
                </div>
            </div>
            <StorageExceededModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} respomse={res!}/>
        </>
    );
}