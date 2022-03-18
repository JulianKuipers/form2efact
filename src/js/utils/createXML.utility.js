function createXML(xml, name) {
    console.log("XML started...");
    console.log(saveAs);
    var blob = new Blob([xml], {type: "application/xml;charset=utf-8"});
    console.log(blob);
    saveAs(blob, name);
}