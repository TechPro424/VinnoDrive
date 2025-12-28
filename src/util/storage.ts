import fs from 'node:fs/promises';
import path from 'node:path';
import {nanoid} from "nanoid";
import {createHash} from "node:crypto";

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
        await fs.writeFile(`${metadir}/user.json`, JSON.stringify({initialSize: 0, actualSize: 0}));
        await fs.writeFile(`${metadir}/files.json`, JSON.stringify({}));
        await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([]));

        return {files: [], udata: {initialSize: 0, actualSize: 0}};
    }
}

export async function getUserStorageData(id: string) {
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');

    const initResult = await initStorage(id);
    if (initResult) return initResult;

    const mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
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

    const initResult = await initStorage(id);
    if (initResult) return initResult;

    const resFiles = [];
    let mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    let udata = JSON.parse(await fs.readFile(`${metadir}/user.json`, 'utf8'));
    let hashMap = new Map<string, string>(JSON.parse(await fs.readFile(`${metadir}/hashes.json`, 'utf8')));

    for (const file of files) {
        const fileId = nanoid();
        const name = file.name;
        const ext = path.extname(name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = createHash('sha256').update(buffer).digest('hex');

        const refId = hashMap.get(hash);
        const deduped = !!refId;
        const date = new Date();

        udata.initialSize += buffer.length;

        if (!deduped) {
            await fs.writeFile(`${storagedir}/${fileId}${ext}`, buffer);
            hashMap.set(hash, fileId);
            udata.actualSize += buffer.length;
        }

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

    await fs.writeFile(`${metadir}/files.json`, JSON.stringify(mdata));
    await fs.writeFile(`${metadir}/user.json`, JSON.stringify(udata));
    await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([...hashMap]));

    return { files: resFiles, udata };
}

export async function moveFilesToBin(id: string, file_id: string) {
    const storagedir = path.join(process.cwd(), 'storage', id, 'files');
    const bindir = path.join(process.cwd(), 'storage', id, 'bin');
    const items = await fs.readdir(storagedir)
    for (const item of items)
        if (path.parse(item).name === file_id)
            await fs.rename(`${storagedir}/${item}`, `${bindir}/${item}`);



}
