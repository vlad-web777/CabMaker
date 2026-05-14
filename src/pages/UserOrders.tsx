

// export default function UserOrders() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">My Orders</h1>
//       <p className="text-gray-600">You have no orders yet.</p>
//     </div>
//   );
// }


import { useEffect, useState } from "react";

type FileItem = {
  key: string;
  size: number;
  lastModified: string;
};

export default function CabinetFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    fetch("https://1d91b0vexi.execute-api.us-east-1.amazonaws.com/default/listCabinetImages")
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Cabinet Files</h1>

      <ul>
        {files.map(file => (
          <li key={file.key}>
            {file.key}
          </li>
        ))}
      </ul>
    </div>
  );
}