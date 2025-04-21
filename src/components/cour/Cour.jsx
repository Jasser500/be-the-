import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import "./Cour.css";

// ✅ Version stable du worker JS (fonctionne avec CRA)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

function Cour() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdfs();
  }, []);

  const getPdfs = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      setAllFiles(result.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers :", error);
    }
  };

  const submitPdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const result = await axios.post("http://localhost:5000/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (result.data.status === "ok") {
        alert("PDF envoyé !");
        getPdfs();
        setTitle("");
        setFile("");
      }
    } catch (error) {
      alert("Erreur d'upload : " + error.message);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  const deletePdf = async (id) => {
    if (window.confirm("Supprimer ce PDF ?")) {
      try {
        await axios.delete(`http://localhost:5000/delete-file/${id}`);
        alert("PDF supprimé !");
        getPdfs();
        setPdfFile(null);
      } catch (error) {
        alert("Erreur de suppression : " + error.message);
      }
    }
  };

  return (
    <div className="cour">
      <form className="formStyle" onSubmit={submitPdf}>
        <h4>Ajouter un PDF</h4>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button type="submit">Envoyer</button>
      </form>

      <div className="uploaded">
        <h4>Liste des cours :</h4>
        <div className="output-div">
          {allFiles.map((data) => (
            <div className="inner-div" key={data._id}>
              <h6>{data.title}</h6>
              <button onClick={() => showPdf(data.pdf)}>Voir PDF</button>
              <button onClick={() => deletePdf(data._id)}>Supprimer</button>
            </div>
          ))}
        </div>
      </div>

      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
}

export default Cour;
