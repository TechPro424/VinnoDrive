'use server';

import {dispSize, fetchData} from "@/util/actions";

export default async function StorageComponent() {
    const data = await fetchData();
    const udata: {initialSize: number, actualSize: number} = data.udata;

    const dispUsed = await dispSize(udata.actualSize);
    const dispInitial = await dispSize(udata.initialSize);
    const saved = udata.initialSize - udata.actualSize;
    const dispSaved = await dispSize(saved);
    const limit = parseInt(process.env.MAX_STORAGE_IN_BYTES!)
    const dispLimit = dispSize(limit);

    return (
        <>
            <div id="progressbar">
                <div style={{ width: `${(udata.actualSize/limit)*100}%`}}></div>
            </div>
            <p className={"storage"}>{dispUsed} of {dispLimit} used</p>
            <p className={"storage"}>Original size: {dispInitial}</p>
            <p className={"storage"}>Space saved: {udata.initialSize ? `${dispSaved} (${ ((saved/udata.initialSize) * 100).toFixed(2)  }%)` : "N/A"}</p>
        </>
    );
}