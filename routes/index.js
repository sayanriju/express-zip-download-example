const express = require("express")
const router = express.Router()
const archiver = require("archiver")
const request = require("request")

const imgUrls = [
  "http://lorempixel.com/output/abstract-q-c-640-480-8.jpg",
  "http://lorempixel.com/output/city-q-c-640-480-1.jpg",
  "http://lorempixel.com/output/cats-q-c-640-480-5.jpg",
  "http://lorempixel.com/output/people-q-c-640-480-1.jpg",
  "http://lorempixel.com/output/sports-q-c-640-480-3.jpg",
  "http://lorempixel.com/output/technics-q-c-640-480-7.jpg"
]

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", {
    title: "Express",
    imgUrls
  })
})

/** Download individual img file *
 * (Expects url of img to download to be passed as the query param "url")
 */
router.get("/dlimg", (req, res) => {
  let url = req.query.url
  if (!url) {
    return res.status(400).json({
      error: true,
      reason: "No Url specified as query param"
    })
  }
  res.set("Content-Disposition", "attachment;filename=image.jpg")
  res.set("Content-Type", "image/jpg")
  url = decodeURIComponent(url)
  return request(url).pipe(res)
})

/** Download all image files as zip */
router.get("/dlzip", (req, res) => {
  // console.log("prepare to dl zip.......................")
  const archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level.
  })
  archive.pipe(res)

  res.set("Content-Disposition", "attachment;filename=attachments.zip")
  res.set("Content-Type", "application/zip, application/octet-stream")
  res.on("close", () => {
    // console.log("zip file prepared......")
    res.send(archive)
  })

  imgUrls.forEach((url, idx) => {
    archive.append(request(url), { name: `${idx}.jpg` })
  })
  archive.finalize()
})

module.exports = router
