import type {NextRequest} from "next/dist/server/web/spec-extension/request";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import path from "node:path";
import fs from "node:fs/promises";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; file_id: string }> }) {
    const { id, file_id } = await params;
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse(JSON.stringify({ error: "You must be logged in to access this resource."}),
        {
            status: 401, headers: { 'content-type': 'application/json' }
        })

    else if (session.user.id !== id) return new NextResponse(JSON.stringify({ error: "D'you really think we're going to let you access other people's files? Good try, mate; but that was never gonna work."}),
        {
            status: 403, headers: { 'content-type': 'application/json' }
        })

    const storagedir = path.join(process.cwd(), 'storage', id, 'files');
    const metadir = path.join(process.cwd(), 'storage', id, 'meta');

    const mdata = JSON.parse(await fs.readFile(`${metadir}/files.json`, 'utf8'));
    const file_meta = mdata[file_id];

    const items = await fs.readdir(storagedir, { recursive: true });
    const actualFile = items.find(item => path.parse(item).name === file_meta.ref);

    const filePath = path.join(storagedir, actualFile!);
    const buffer = await fs.readFile(filePath);

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${file_meta.name}"`);
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Length', buffer.length.toString());

    return new NextResponse(buffer, { headers });
}
