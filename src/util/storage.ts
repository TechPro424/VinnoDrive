import {createHash} from "node:crypto";
import fs from 'node:fs/promises';
import path from 'node:path';
import {nanoid} from "nanoid";

export async function initStorage(id: string) {
    const storagedir = path.join(process.cwd(), 'storage', id, 'files');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');
    const bindir = path.join(process.cwd(), 'storage', id, 'bin');

    try {
        await fs.access(storagedir);
    } catch (error) {
        await fs.mkdir(storagedir, {recursive: true});
        await fs.mkdir(metadir, {recursive: true});
        await fs.mkdir(bindir, {recursive: true});
        await fs.writeFile(`${metadir}/user.json`, JSON.stringify({initialSize: 0, actualSize: 0}), {encoding: 'utf8', flush: true});
        await fs.writeFile(`${metadir}/files.json`, JSON.stringify({}), {encoding: 'utf8', flush: true});
        await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([]), {encoding: 'utf8', flush: true});
        await fs.writeFile(`${metadir}/bin.json`, JSON.stringify({}), {encoding: 'utf8', flush: true});

        return {files: [], udata: {initialSize: 0, actualSize: 0}};
    }
}

export async function getUserStorageData(id: string, bin: boolean = false) {
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');

    const initResult = await initStorage(id);
    if (initResult) return initResult;

    const metafile = bin ? 'bin' : 'files';
    const mdata = JSON.parse(await fs.readFile(`${metadir}/${metafile}.json`, 'utf8'));
    const udata = JSON.parse(await fs.readFile(`${metadir}/user.json`, 'utf8'));

    if (Object.keys(mdata).length === 0) {
        return {files: [], udata};
    }

    const files = Object.entries(mdata).map(([file_id, meta]: [string, any]) => ({
        name: meta.name,
        deduped: meta.deduped,
        uploader: meta.uploader,
        date: meta.date,
        size: meta.size,
        ref: meta.ref,
        id: file_id
    }));

    return {files, udata};
}




export async function uploadFiles(id: string, files: File[]) {
    const storagedir = path.join(process.cwd(), 'storage', id, 'files');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');

    await initStorage(id);

    const resFiles = [];
    let mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    let udata = JSON.parse(await fs.readFile(`${metadir}/user.json`, 'utf8'));
    let hashMap = new Map<string, string>(JSON.parse(await fs.readFile(`${metadir}/hashes.json`, 'utf8')));


    let storageExceeded = false;


    for (const file of files.sort((f1, f2) => {return f1.size - f2.size})) {
        const fileId = nanoid();
        const name = file.name;
        const ext = path.extname(name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = createHash('sha256').update(buffer).digest('hex');

        const refId = hashMap.get(hash);
        const deduped = !!refId;
        const date = new Date();





        if (!deduped) {
            if (udata.actualSize + buffer.length > parseInt(process.env.MAX_STORAGE_IN_BYTES!)) {
                storageExceeded = true;
                break;
            }

            await fs.writeFile(`${storagedir}/${fileId}${ext}`, buffer);
            hashMap.set(hash, fileId);
            udata.actualSize += buffer.length;
        }

        udata.initialSize += buffer.length;

        mdata[fileId] = {
            name,
            deduped,
            uploader: id,
            date,
            hash,
            ref: refId || fileId,
            size: buffer.length
        };

        resFiles.push({
            name,
            deduped,
            uploader: id,
            date,
            size: buffer.length,
            id: fileId,
            ref: refId || fileId,
        });
    }



    await fs.writeFile(`${metadir}/files.json`, JSON.stringify(mdata), {encoding: 'utf8', flush: true});
    await fs.writeFile(`${metadir}/user.json`, JSON.stringify(udata), {encoding: 'utf8', flush: true});
    await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([...hashMap]), {encoding: 'utf8', flush: true});

    return { files: resFiles, udata, status: (storageExceeded ? 507 : 200) };
}

export async function moveFilesToBin(id: string, file_id: string, reverse: boolean = false) {
    let storagedir = path.join(process.cwd(), 'storage', id, 'files');
    let bindir = path.join(process.cwd(), 'storage', id, 'bin');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');

    let meta_files = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    let meta_bin = JSON.parse(await fs.readFile(`${metadir}/bin.json`, 'utf8'));

    if (reverse) {
        [storagedir, bindir] = [bindir, storagedir];
        [meta_files, meta_bin] = [meta_bin, meta_files];
    }



    const file_meta = meta_files[file_id]
    const ref= file_meta.ref

    if (!meta_files[file_id].deduped) {
        const items = await fs.readdir(storagedir)
        const item = items.find((item) => path.parse(item).name === ref);
        await fs.rename(`${storagedir}/${item}`, `${bindir}/${item}`);
    }

    meta_bin[file_id]= file_meta;

    meta_files = Object.fromEntries(
        Object.entries(meta_files).filter(([key]) => key !== file_id)
    );

    if (reverse) [meta_files, meta_bin] = [meta_bin, meta_files];

    await fs.writeFile(`${metadir}/files.json`, JSON.stringify(meta_files), {encoding: 'utf8', flush: true});
    await fs.writeFile(`${metadir}/bin.json`, JSON.stringify(meta_bin), {encoding: 'utf8', flush: true});

}

export async function renameFile(id: string, file_id: string, name: string) {
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');
    let mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    let file_meta = mdata[file_id];
    file_meta.name = name;
    mdata[file_id] = file_meta;
    await fs.writeFile(`${metadir}/files.json`, JSON.stringify(mdata), {encoding: 'utf8', flush: true});

}


export async function deleteFile(id: string, file_id: string) {
    const bindir = path.join(process.cwd(), 'storage', id, 'bin');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');



    let meta_files = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    let meta_bin = JSON.parse(await fs.readFile(`${metadir}/bin.json`, 'utf8'))
    let udata = JSON.parse(await fs.readFile(`${metadir}/user.json`, 'utf8'));
    let hashMap = new Map<string, string>(JSON.parse(await fs.readFile(`${metadir}/hashes.json`, 'utf8')));

    const meta_all = {...meta_files, ...meta_bin};
    const refs = Object.values(meta_all).filter((meta: any) => meta.ref === meta_bin[file_id].ref).length;
    if (refs === 1) {
        const items = await fs.readdir(bindir, { recursive: true });
        const item = items.find((item) => path.parse(item).name === meta_bin[file_id].ref);
        await fs.rm(`${bindir}/${item}`);
        hashMap.delete(meta_bin[file_id].hash)
        udata.actualSize -= meta_bin[file_id].size;
    }
     udata.initialSize -= meta_bin[file_id].size;
    meta_bin = Object.fromEntries(
        Object.entries(meta_bin).filter(([key]) => key !== file_id)
    );




    await fs.writeFile(`${metadir}/bin.json`, JSON.stringify(meta_bin), {encoding: 'utf8', flush: true});
    await fs.writeFile(`${metadir}/user.json`, JSON.stringify(udata), {encoding: 'utf8', flush: true});
    await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([...hashMap]), {encoding: 'utf8', flush: true});

}