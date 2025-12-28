import BinFileOptionsButton from "@/components/BinFileOptionsButton";
import type {File} from '@/components/FileList'
import FileOptionsButton from "@/components/FileOptionsButton";


export type FileProps = {
    file: File,
    bin: boolean
}



export default function FileComponent(props: FileProps) {
    const file = props.file;
    return (
        <div className={"file"}>
            <p className={"name"}>{file.name}</p>
            <p className={"date"}>{new Date(file.date).toLocaleDateString()}</p>
            <p className={"deduped"}>{file.deduped ? "True" : "False"}</p>
            <p className={"size"}>{file.dispSize} {file.unit}</p>
            {props.bin ? <BinFileOptionsButton file_id={file.id} file_name={file.name}/> : <FileOptionsButton file_id={file.id} file_name={file.name} />}

        </div>
    );
}