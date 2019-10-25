import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import Message from "./Message";
import Progress from "./Progress";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await Axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progress) => {
          setUploadPercentage(
            parseInt(Math.round((progress.loaded * 100) / progress.total))
          );
          // Clear Percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage("File Uploaded!");
    } catch (error) {
      if (error.response.status === 500) {
        setMessage("Server Error Occurred");
      } else {
        setMessage(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    const alertTime = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => clearTimeout(alertTime);
  }, [message]);

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}

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
        {uploadPercentage === 0 ? null : (
          <Progress percentage={uploadPercentage} />
        )}

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
