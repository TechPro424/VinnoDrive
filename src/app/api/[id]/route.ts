import type { NextRequest } from 'next/server';
import fs from 'node:fs/promises';
import { nanoid } from 'nanoid';
import path from 'node:path'
import {createHash} from "node:crypto";

async function initStorage(id: string) {
    const storagedir = path.join(process.cwd(), 'storage', id, 'files');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');
    const bindir = path.join(process.cwd(), 'storage', id, 'bin');

    try {
      await fs.access(storagedir);
  }

  catch (error) {
      await fs.mkdir(storagedir, {recursive: true});
      await fs.mkdir(metadir, {recursive: true});
      await fs.mkdir(bindir, {recursive: true});
      await fs.writeFile(`${metadir}/user.json`, JSON.stringify({initialSize: 0, actualSize: 0}), {encoding: 'utf8', flush: true});
      await fs.writeFile(`${metadir}/files.json`, JSON.stringify({}), {encoding: 'utf8', flush: true});
      await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([]), {encoding: 'utf8', flush: true});

      return new Response(JSON.stringify({files: [], udata: {initialSize: 0, actualSize: 0}}), {
          status: 200,
          headers: { 'content-type': 'application/json' }
      })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  const storagedir = path.join(process.cwd(), 'storage', id, 'files');
  const metadir = path.join(process.cwd(), 'storage', id, 'meta');

  let files = [];


  const init_res = await initStorage(id);
  if (init_res) return init_res;


const items = await fs.readdir(storagedir);

if (items.length === 0) {
    return new Response(JSON.stringify({files: []}), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    })
}

    const mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    const udata = JSON.parse(await fs.readFile(`${metadir}/user.json`, 'utf8'));

      // Check if no files exist
  if (Object.keys(mdata).length === 0) {
    return new Response(JSON.stringify({files: [], udata: udata}), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  }

  for (const [file_id, meta] of Object.entries(mdata)) {
      files.push({
          name: meta.name,
          deduped: meta.deduped,
          uploader: meta.uploader,
          date: meta.date,
          size: meta.size,
          ref: meta.ref,
          id: file_id

      })
  }

  return new Response(JSON.stringify({files: files, udata: udata}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest,
                           { params }: { params: Promise<{ id: string }> },) {
    const id = (await params).id;
    const storagedir = path.join(process.cwd(), 'storage', id, 'files');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');


    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const init_res = await initStorage(id);
    if (init_res) return init_res;

  const res_files = [];
  let mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
  let udata = JSON.parse(await fs.readFile(`${metadir}/user.json`, 'utf8'));

  let hashMap = new Map<string, string>(JSON.parse(await fs.readFile(`${metadir}/hashes.json`, 'utf8')));


  for (const file of files) {
      const file_id = nanoid()
      const name = file.name;
      const ext = path.extname(name);
      const buffer = Buffer.from(await file.arrayBuffer());
      const hash= createHash('sha256').update(buffer).digest('hex');

      const ref_id = hashMap.get(hash);

      const deduped = !!ref_id;
      const date = new Date();

      udata.initialSize += buffer.length;

      if (!deduped) {
          await fs.writeFile(`${storagedir}/${file_id}${ext}`, buffer, {encoding: 'utf8', flush: true});
          hashMap.set(hash, file_id);
          udata.actualSize += buffer.length;
      }
      mdata[file_id] =  {
          name: name,
          deduped: deduped,
          uploader: id,
          date: date,
          hash: hash,
          ref: ref_id || file_id,
          size: buffer.length
      };

      res_files.push({
                name: name,
                  deduped: deduped,
                  uploader: id,
                  date: date,
                size: buffer.length,
                id: file_id,
            ref: ref_id || file_id,
            })


  }
  await fs.writeFile(`${metadir}/files.json`, JSON.stringify(mdata), {encoding: 'utf8', flush: true});
  await fs.writeFile(`${metadir}/user.json`, JSON.stringify(udata), {encoding: 'utf8', flush: true});
  await fs.writeFile(`${metadir}/hashes.json`, JSON.stringify([...hashMap]), {encoding: 'utf8', flush: true});
    return new Response(JSON.stringify({files: res_files, udata: udata}), {status: 201, headers: { 'content-type': 'application/json' }})
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  // e.g. Delete user with ID `id` in DB
  const body = await request.json()
  const { file_id } = body;
  const storagedir = path.join(process.cwd(), 'storage', id, 'files');
  const bindir = path.join(process.cwd(), 'storage', id, 'bin');
  const items = await fs.readdir(storagedir)
    for (const item of items) {
        if (path.parse(item).name === file_id) {
            await fs.rename(`${storagedir}/${item}`, `${bindir}/${item}`);
            return new Response(null, { status: 204 });
        }
    }


  return new Response(null, { status: 404 });
}