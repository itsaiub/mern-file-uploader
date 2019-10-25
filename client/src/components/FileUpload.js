import React, { Fragment, useState } from "react";
import Axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      const res = await Axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
    } catch (error) {
      if (error.response.status === 500) {
        console.log("Server Error");
      } else {
        console.log(error.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="custom-file mb-2">
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
          <input
            onChange={handleChange}
            type="file"
            className="custom-file-input"
            id="customFile"
          />
        </div>
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-auto m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img
              style={{ width: "100" }}
              src={uploadedFile.filePath}
              alt={uploadedFile.fileName}
            />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
