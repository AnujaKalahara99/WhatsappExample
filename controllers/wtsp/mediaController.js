const axios = require("axios");
const FormData = require("form-data");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { fromPath, fromBuffer, fromBase64 } = require("pdf2pic");
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
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${process.env.PHONE_NUMBER_ID}/media`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      ...formData.getHeaders(),
    },
    data: formData,
  };

  const response = await axios(config);
  //delete the tmp file
  console.log(req.file.path);
  // console.log("hooba/baabaa/var/task".replace("var/task", ""));
  fs.unlinkSync(req.file.path);
  return res.status(200).json(response.data);
});

//Return Image (image will be shown in postman), but this will be probably converted to arraybuffer when requested by frontend
const getMedia = asyncHandler(async (req, res) => {
  var config = {
    method: "get",
    url: `https://graph.facebook.com/${process.env.WAAPI_VERSION}/${req.params.mediaId}`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  const response = await axios(config);
  const mimeType = response.data.mime_type;

  if (response.status === 200) {
    const mediaResponse = await downloadMedia(response.data.url);

    let file = mediaResponse.data;
    //return a temp image if file is pdf and temp in request's query params
    if (mimeType === "application/pdf" && req.query.temp) {
      // const imgArray = await pdf2img.convert(file, {
      //   width: 250,
      //   height: 250,
      //   page_numbers: [1],
      // });
      // file = imgArray[0];
      const options = {
        density: 100,
        saveFilename: "untitled",
        savePath: "./images",
        format: "png",
        width: 600,
        height: 600,
      };
      const img = fromBase64(file, options);
      console.log(img);
      const i = await img(1, true);
      console.log(i);
    }

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

const downloadMedia = async (url) => {
  var config = {
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    responseType: "arraybuffer",
  };

  const response = await axios(config);
  const contentDis = response.headers["content-disposition"];
  const file = {
    data: response.data,
    name: contentDis.slice(
      contentDis.indexOf("filename=") + "filename=".length
    ),
  };

  return file;
};

module.exports = { uploadMedia, getMedia };
