'use server';

import {dispSize, fetchData} from "@/util/actions";

export default async function StorageComponent() {
    const data = await fetchData();
    const udata: {initialSize: number, actualSize: number} = await data.udata;

    const dispUsed = await dispSize(udata.actualSize);
    const dispInitial = await dispSize(udata.initialSize);
    const saved = udata.initialSize - udata.actualSize;
    const dispSaved = await dispSize(saved);

    return (
        <>
            <div id="progressbar">
                <div style={{ width: `${(udata.actualSize/1000000)*100}%`}}></div>
            </div>
            <p className={"storage"}>{dispUsed} of 10 MB used</p>
            <p className={"storage"}>Original size: {dispInitial}</p>
            <p className={"storage"}>Space saved: {dispSaved} ({ ((saved/udata.initialSize) * 100).toFixed(2)  }%)</p>
        </>
    );
}