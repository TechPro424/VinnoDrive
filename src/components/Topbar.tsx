'use server';

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";

export default async function Topbar() {
    const session = await getServerSession(authOptions);
    const userImage = session?.user?.image;




    return (
        <div className={"top"}>
            <Image src={userImage ? userImage : '/vinlogo.svg'} width={32} height={32} alt={""}/>
        </div>
    );
}