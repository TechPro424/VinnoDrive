'use client';

import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {getUser, moveToBin, reVal} from "@/util/actions";


export default function FileOptionsButton(props) {
    const [dropdown, setDropdown] = useState(false);

    const handleDelete = async () => {
        await moveToBin(props.file_id)
        setDropdown(false)
    }



    return (
       <div className="dropdown">
                <FontAwesomeIcon className={"options dropBtn"} onClick={ () => setDropdown(!dropdown) } icon={faEllipsisVertical}/>


                <div id="myDropdown" className={`options-dropdown-content${dropdown ? " show": ""}` }>
                    <div id={"download"} className={"element"}>Download</div>
                    <div id={"rename"} className={"element"}>Rename</div>
                    <div id={"share"} className={"element"}>Share</div>
                    <div id={"delete"} className={"element"} onClick={handleDelete}>Move to bin</div>
                </div>
            </div>
    );



}