const axios = require("axios");
const FormData = require("form-data");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
// var pdf2img = require("pdf-img-convert");

//multer intercepts and saves formdata file in tmp folder...available on req.file
const uploadMedia = asyncHandler(async (req, res) => {
  const formData = new FormData();
  const fileBuffer = fs.createReadStream(req.file.path);
  formData.append("file", fileBuffer);
  formData.append("type", req.file.mimetype);
  formData.append("messaging_product", "whatsapp");

  var config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${req.user.phoneNumId}/media`,
    headers: {
      Authorization: `Bearer ${req.user.watoken}`,
      ...formData.getHeaders(),
    },
    data: formData,
  };

  const response = await axios(config);
  //delete the tmp file
  fs.unlinkSync(req.file.path);
  return res.status(200).json(response.data);
});

//Return Image (image will be shown in postman), but this will be probably converted to arraybuffer when requested by frontend
const getMedia = asyncHandler(async (req, res) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${req.params.mediaId}`,
    headers: {
      Authorization: `Bearer ${req.user.watoken}`,
    },
  };

  const response = await axios(config);
  const mimeType = response.data.mime_type;

  if (response.status === 200) {
    const mediaResponse = await downloadMedia(
      response.data.url,
      req.user.watoken
    );

    let file = mediaResponse.data;
    //return a temp image if file is pdf and temp in request's query params
    // if (mimeType === "application/pdf" && req.query.temp === true) {
    //   const imgArray = await pdf2img.convert(file, {
    //     width: 250,
    //     height: 250,
    //     page_numbers: [1],
    //   });
    //   file = imgArray[0];
    // }

    //Here your saved file needs to be encoded to base 64.
    const fileBuffer = Buffer.from(file, "base64");

    const fileType =
      mimeType === "application/pdf" && req.query.temp ? "image/png" : mimeType;

    res.writeHead(200, {
      "Content-Type": fileType,
      "Content-Length": file.length,
      "File-Name": mediaResponse.name,
      "Access-Control-Expose-Headers": "File-Name",
    });
    res.end(fileBuffer);
    return;
  }
  return res.status(500).json(response.status);
});

const downloadMedia = async (url, token) => {
  var config = {
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "arraybuffer",
  };

  const response = await axios(config);
  const contentDis = response.headers["content-disposition"];
  let fileName = contentDis.slice(
    contentDis.indexOf("filename=") + "filename=".length
  );
  const nameArray = fileName.split(";");
  fileName = nameArray && nameArray.length > 0 ? nameArray[0] : fileName;

  const file = {
    data: response.data,
    name: fileName,
  };

  return file;
};

const downloadMediaImage = async (mediaId, token) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${mediaId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios(config);
  const mimeType = response.data.mime_type;

  if (response.status === 200) {
    const mediaResponse = await downloadMedia(response.data.url, token);

    let file = mediaResponse.data;
    //return a temp image if file is pdf and temp in request's query params
    // if (mimeType === "application/pdf") {
    //   const imgArray = await pdf2img.convert(file, {
    //     width: 250,
    //     height: 250,
    //     page_numbers: [1],
    //   });
    //   file = imgArray[0];
    // }

    //Here your saved file needs to be encoded to base 64.
    const fileBuffer = Buffer.from(file).toString("base64");

    // const fileType = mimeType === "application/pdf" ? "image/png" : mimeType;
    return {
      media: `data:${mimeType};base64,` + fileBuffer,
      fileName: mediaResponse.name,
    };
  }
  return "";
};

module.exports = { uploadMedia, getMedia, downloadMediaImage };
