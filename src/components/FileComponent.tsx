import FileOptionsButton from "@/components/FileOptionsButton";

export type File = {
          name: string,
          deduped: boolean,
          uploader: string,
          date: string,
          size: number,
          ref: string,
          id: string,
    dispSize: number,
    unit: string

}

export type FileProps = {
    file: File
}



export default function FileComponent(props: FileProps) {
    const file = props.file;
    return (
        <div className={"file"}>
            <p className={"name"}>{file.name}</p>
            <p className={"date"}>{new Date(file.date).toLocaleDateString()}</p>
            <p className={"deduped"}>{file.deduped ? "True" : "False"}</p>
            <p className={"size"}>{file.dispSize} {file.unit}</p>
            <FileOptionsButton file_id={file.id}/>

        </div>
    );
}