export default class AttFileType {

  static fileType = {
     audio : {
       file:[".ac3",".au",".mp2",".ogg",".flac",".ape",".wav",".mp3",".aac",".wma"],
       size:500
     },

     video : {
       file:[".3gpp",".mp4",".mpeg",".mpg",".3gp",".wmv",".asf",".asx",".rm",".rmvb",".3gp",".mov",".m4v",".avi",".dat","mkv",
    ".flv",".vob"],
       size:500
     },

     pic : {
       file:[".dwg",".dxf",".gif",".jp2",".jpe",".jpeg",".jpg",".png",".svf",".tif",".tiff",".bmp",".webp",".bmp",".pcx",".tif",
    ".tga",".exif",".fpx",".svg",".psd",".cdr",".ico"],
       size:100
     },

     txt : {file:[".doc",".docx",".dot",".dtd",".js",".json",".mpp",".pdf",".pot",".pps",".ppt",".ppts",".rtf",".wdb",".wps",
       ".xhtml",".xlc",".xlm",".xls",".xlt",".xlw",".xml",".css",".csv",".htm",".html",".txt"],
       size:20
     },

     rar :{
       file:[".rar",".zip",".arj",".z",".iso",".jar",".bz2",".gz",".tar",".ace",".lzh",".cab",".arj"],
       size:200
     }
  };

  static showType = (type) => {
    let audio = [".ac3",".au",".mp2",".ogg",".flac",".ape",".wav",".mp3",".aac",".wma"];
    let video = [".3gpp",".mp4",".mpeg",".mpg",".3gp",".wmv",".asf",".asx",".rm",".rmvb",".3gp",".mov",".m4v",".avi",".dat","mkv",
      ".flv",".vob"];
    let pic = [".dwg",".dxf",".gif",".jp2",".jpe",".jpeg",".jpg",".png",".svf",".tif",".tiff",".bmp",".webp",".bmp",".pcx",".tif",
      ".tga",".exif",".fpx",".svg",".psd",".cdr",".ico"];
    let txt = [".doc",".docx",".dot",".dtd",".js",".json",".mpp",".pdf",".pot",".pps",".ppt",".ppts",".rtf",".wdb",".wps",
      ".xhtml",".xlc",".xlm",".xls",".xlt",".xlw",".xml",".css",".csv",".htm",".html",".txt"];
    let rar = [".rar","zip","arj",".z",".iso",".jar",".bz2",".gz",".tar",".ace",".lzh",".cab",".arj"];

    if(audio.indexOf(type)>=0)
      return "音频";
    else if(video.indexOf(type)>=0)
      return "视频";
    else if(pic.indexOf(type)>=0)
      return "图片";
    else if(txt.indexOf(type)>=0)
      return "文档";
    else if(rar.indexOf(type)>=0)
      return "压缩包";
    else
      return "其他";
  };

  static showFileType = (type) => {
    switch (type){
      case "AUDIO":
        return "音频";
      case "VIDEO":
        return "视频";
      case "IMAGE":
        return "图片";
      case "DOC":
        return "文档";
      case "PACKAGES"://以前有压缩包，后来合并为其他
        return "其他";
      case "OTHER":
        return "其他";
      default:
        return "——";
    }
  };
}