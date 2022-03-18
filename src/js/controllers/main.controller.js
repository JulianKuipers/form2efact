function main() {
    // Get timestamp for filename
    let date = new Date();
    let currentTimeStamp = `${date.toLocaleDateString()}${date.toLocaleTimeString()}`;

    var poNum = document.getElementById("poNumber").value;
    var invCount = document.getElementById("invoiceCount").value;;
    var xml = getXML();

    // Make name for invoice file
    var name = "INV" + currentTimeStamp + ".xml";
    console.log(`Gen activated: ${poNum}, ${invCount}; ${name}`);
    console.log(xml);
    createXML(xml, name);
}