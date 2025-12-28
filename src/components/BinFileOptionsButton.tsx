'use client';

import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {deleteFileAction, moveToBin} from "@/util/actions";
import DeleteModal from "@/components/DeleteModal";

interface FileOptionsProps {
    file_id: string,
    file_name: string,
}

export default function FileOptionsButton({file_id, file_name}: FileOptionsProps) {
    const [dropdown, setDropdown] = useState(false);

    const handleRestore = async () => {
        await moveToBin(file_id, true)
        setDropdown(false)
    }

    const handleDelete = async () => {
        await deleteFileAction(file_id)
    // Your rename logic here
  };

    const [isModalOpen, setIsModalOpen] = useState(false);





    return (
       <div className="options-dropdown">
                <FontAwesomeIcon className={"options dropBtn"} onClick={ () => setDropdown(!dropdown) } icon={faEllipsisVertical}/>

                <div id="myDropdown" className={`options-dropdown-content${dropdown ? " show": ""}` } style={{minWidth: '8em', minHeight: '4em'}}>
                    <div id={"rename"} className={"element"} onClick={() => {setIsModalOpen(true); setDropdown(false)}}>Delete</div>
                    <div id={"delete"} className={"element"} onClick={handleRestore}>Restore</div>
                </div>
           
                <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDelete={handleDelete} fileName={file_name} />
            </div>
    );



}