'use client';

import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {reVal} from "@/util/actions";


export default function FileOptionsButton(props) {
    const [dropdown, setDropdown] = useState(false);

    const handleDelete = async () => {
        const res = await fetch(`http://localhost:3000/api/0/`, {
            method: "DELETE",
            body: JSON.stringify({file_id: props.file_id}),
        })
        if (res.ok) await reVal('/')
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