'use server';

import Image from "next/image";
import Link from "next/link";
import NavButton from "@/components/NavButton";
import StorageComponent from "@/components/StorageComponent";

export default async function Navbar() {

    return (
        <nav>
            <Link href="/">
            <div>
                <Image src={'/vinlogo.svg'} alt={""} width={32} height={32} />
                <h2 id={"title"}>VinnoDrive</h2>
            </div>
            </Link>


            <NavButton/>

            <Link className={"routes"} href="/">My Drive</Link>
            <Link className={"routes"} href="/bin">Bin</Link>

            <StorageComponent />
        </nav>
    );
}