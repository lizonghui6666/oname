export default class seo {

  static changeDomSeo = (data) => {
    if (typeof window !== 'undefined') {
      document.title = data.title;
      let metas = document.getElementsByTagName("meta");
      metas[2].content = data.keywords;
      metas[3].content = data.description;
    }
  };
}