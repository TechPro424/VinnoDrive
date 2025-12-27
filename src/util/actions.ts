'use server';

import {revalidatePath, updateTag} from 'next/cache';

export async function reVal(path: string) {
    updateTag('storage-data');
    revalidatePath(path, 'layout');
}

export async function fetchData() {
    const res = await fetch('http://localhost:3000/api/0/', {
        next: {
            tags: ['storage-data']
        }
    })
    return await res.json()
}

export async function dispSize(size: number) {
    const unit = size >= 1000000 ? "MB" : "KB";
    const dispSize = unit === "MB" ? size / 1000000 : size / 1000
    return `${parseFloat(dispSize.toFixed(2))} ${unit}`;

}