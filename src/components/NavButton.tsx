'use client';

import {useRef, useState} from "react";
import {reVal} from "@/util/actions";


export default function NavButton() {
    const [dropdown, setDropdown] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event) => {
        const files = event.target?.files;
        if (files.length === 0) return setDropdown(false);
        const formdata = new FormData();

        for (const file of files) {
            formdata.append('files', file);
        }

        try {
            const res = await fetch(`http://localhost:3000/api/0/`, {
                method: "POST",
                body: formdata
            })
            if (res.ok) await reVal('/')
        }
        catch (error) {
            throw error;
        }
        setDropdown(false);
    }

    return (
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
    );
}