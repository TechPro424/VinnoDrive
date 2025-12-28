'use server';

import {revalidatePath, updateTag} from 'next/cache';
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {deleteFile, getUserStorageData, moveFilesToBin, renameFile, uploadFiles} from "@/util/storage";

export async function getUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect('/api/auth/signin');

    return session.user;
}

export async function reVal(path: string) {
    updateTag('storage-data');
    revalidatePath(path, 'layout');
}

export async function upload(formdata: FormData) {
    const {id} = await getUser();

    const files = formdata.getAll('files') as File[];

    if (files.length === 0) {
        throw new Error('No files provided');
    }

    await uploadFiles(id, files);
    await reVal('/');
}

export async function moveToBin(file_id: string, reverse: boolean = false) {
    const {id} = await getUser();

    await moveFilesToBin(id, file_id, reverse);
    await reVal('/');
    await reVal('/bin');
}

export async function fetchData(bin: boolean = false) {
    const {id} = await getUser();
    return await getUserStorageData(id, bin);
}

export async function rename(file_id: string, name: string) {
    const {id} = await getUser();
    await renameFile(id, file_id, name);
    await reVal('/');
}

export async function deleteFileAction(file_id: string) {
    const {id} = await getUser();
    await deleteFile(id, file_id)
    await reVal('/bin');
    await reVal('/');
}

export async function dispSize(size: number) {
    const unit = size >= 1000000 ? "MB" : "KB";
    const dispSize = unit === "MB" ? size / 1000000 : size / 1000
    return `${parseFloat(dispSize.toFixed(2))} ${unit}`;

}