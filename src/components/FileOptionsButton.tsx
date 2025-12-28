'use client';

import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSession} from "next-auth/react";
import {useState} from "react";
import {moveToBin, rename} from "@/util/actions";
import RenameModal from "@/components/RenameModal";

interface FileOptionsProps {
    file_id: string,
    file_name: string,
}

export default function FileOptionsButton({file_id, file_name}: FileOptionsProps) {
    const [dropdown, setDropdown] = useState(false);
    const session = useSession().data;

    const handleDelete = async () => {
        await moveToBin(file_id)
        setDropdown(false)
    }

    const handleDownload = async () => {
        if (!session?.user?.id) return;
        window.open(`/api/${session.user.id}/download/${file_id}`, '_blank');
        setDropdown(false);
    }

    const handleRename = async (name: string) => {
        await rename(file_id, name);
    // Your rename logic here
  };

    const [isModalOpen, setIsModalOpen] = useState(false);





    return (
       <div className="options-dropdown">
                <FontAwesomeIcon className={"options dropBtn"} onClick={ () => setDropdown(!dropdown) } icon={faEllipsisVertical}/>

                <div id="myDropdown" className={`options-dropdown-content${dropdown ? " show": ""}` }>
                    <div id={"download"} className={"element"} onClick={handleDownload}>Download</div>
                    <div id={"rename"} className={"element"} onClick={() => {setIsModalOpen(true); setDropdown(false)}}>Rename</div>
                    <div id={"share"} className={"element"}>Share</div>
                    <div id={"delete"} className={"element"} onClick={handleDelete}>Move to bin</div>
                </div>
           
                <RenameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRename={handleRename} currentName={file_name} />
            </div>
    );



}