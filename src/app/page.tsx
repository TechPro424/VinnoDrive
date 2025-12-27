
import FileList from "@/components/FileList";
import {fetchData} from "@/util/actions";


export default async function Home() {
    const data = await fetchData();

  const files = data.files.map(file => {
    const unit = file.size >= 1000000 ? "MB" : "KB";
    return {
      ...file,
      unit,
      dispSize: unit === "MB" ? file.size / 1000000 : file.size / 1000
    };
  });


  return (
      <FileList files={files}/>

  );
}
