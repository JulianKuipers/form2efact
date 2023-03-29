// Public functions
function initialize() {
    var checkbox = document.getElementById("autoCalcBox");
    checkbox.addEventListener('change', changeForm);

    var checkbox = document.getElementById("taxIncludedBox");
    checkbox.addEventListener('change', changeForm);

    var itemCount = document.getElementById("count");
    itemCount.addEventListener('change', changeLineItems);

    var taxPercentageDef = document.getElementById("taxPercentageDefault");
    taxPercentageDef.addEventListener('change', setDefTaxRate);

    changeForm();
}

function changeForm() {
    var autoCalc = document.getElementById("autoCalcBox");

    var absoluteAmountDiv = document.getElementById("absoluteAmountDiv");
    var totalAmountDiv = document.getElementById("totalAmountDiv1");
    var taxDiv = document.getElementById("taxDiv");

    var invoiceLines = document.getElementById("invoiceLines");
    var nodes = invoiceLines.children;

    if (autoCalc.checked) {
        //Remove children of absoluteAmountDiv
        _removeChildren(absoluteAmountDiv.children);

        //Remove children of totalAmountDiv
        _removeChildren(totalAmountDiv.children);

        if (taxDiv.firstElementChild === null) {
            _createTaxDiv(taxDiv);
        }

        //Enable checkbox for including/excluding tax
        _enableIncludingTaxCheckBox();

        // Trigger update of rows
        changeLineItems();
    } else {
        if (absoluteAmountDiv.firstElementChild === null) {
            _createAbsoluteAmountsDiv(absoluteAmountDiv);
        }

        // Fill TotalAmountDiv of item1 with label and input field
        var row2 = nodes[0].lastElementChild;
        var div = row2.lastElementChild;
        _fillTotalAmountDiv(div);

        //Disable checkbox for including/excluding tax
        _disableIncludingTaxCheckBox();

        // Trigger update of rows
        changeLineItems();
    }
}

// Private functions

function _createTaxDiv(placeholder) {
    var div = document.createElement("div");
    var label = document.createElement("label");
    var input = document.createElement("input");

    div.classList.add("form-group");
    div.classList.add("col-md-6");

    label.setAttribute("for", "taxPercentageDefault");
    label.innerHTML = "Percentage belasting";

    input.classList.add("form-control");
    input.id = "taxPercentageDefault";
    input.setAttribute("type", "number");
    input.setAttribute("value", "0.00");
    input.setAttribute("min", "0.00");

    div.appendChild(label);
    div.appendChild(input);

    placeholder.appendChild(div);
}

function _createAbsoluteAmountsDiv(placeholder) {
    var formGroupLeft = document.createElement("div");
    formGroupLeft.classList.add("form-group");
    formGroupLeft.classList.add("col-md-4");

    var formGroupCentre = document.createElement("div");
    formGroupCentre.classList.add("form-group");
    formGroupCentre.classList.add("col-md-4");

    var formGroupRight = document.createElement("div");
    formGroupRight.classList.add("form-group");
    formGroupRight.classList.add("col-md-4");

    var taxableAmountItem, taxableAmountLabel;
    taxableAmountLabel = document.createElement("label");
    taxableAmountLabel.setAttribute("for", "taxableAmount");
    taxableAmountLabel.innerHTML = "Factuurbedrag exclusief belasting";
    taxableAmountItem = document.createElement("input");
    taxableAmountItem.classList.add("form-control");
    taxableAmountItem.setAttribute("type", "number");
    taxableAmountItem.id = "taxableAmount";
    taxableAmountItem.setAttribute("value", "0.00");

    var taxAmountItem, taxAmountLabel;
    taxAmountLabel = document.createElement("label");
    taxAmountLabel.setAttribute("for", "taxAmount");
    taxAmountLabel.innerHTML = "Totaal bedrag belasting op de factuur";
    taxAmountItem = document.createElement("input");
    taxAmountItem.classList.add("form-control");
    taxAmountItem.setAttribute("type", "number");
    taxAmountItem.setAttribute("value", "0.00");
    taxAmountItem.id = "taxAmount";

    var taxInclusiveAmountItem, taxInclusiveAmountLabel;
    taxInclusiveAmountLabel = document.createElement("label");
    taxInclusiveAmountLabel.setAttribute("for", "taxInclusiveAmount");
    taxInclusiveAmountLabel.innerHTML = "Totaal factuurbedrag inclusief belasting";
    taxInclusiveAmountItem = document.createElement("input");
    taxInclusiveAmountItem.classList.add("form-control");
    taxInclusiveAmountItem.setAttribute("type", "number");
    taxInclusiveAmountItem.setAttribute("value", "0.00");
    taxInclusiveAmountItem.id = "taxInclusiveAmount";

    formGroupRight.appendChild(taxInclusiveAmountLabel);
    formGroupRight.appendChild(taxInclusiveAmountItem);

    formGroupCentre.appendChild(taxAmountLabel);
    formGroupCentre.appendChild(taxAmountItem);

    formGroupLeft.appendChild(taxableAmountLabel);
    formGroupLeft.appendChild(taxableAmountItem);

    placeholder.appendChild(formGroupLeft);
    placeholder.appendChild(formGroupCentre);
    placeholder.appendChild(formGroupRight);
}

function _fillTotalAmountDiv(div) {
    var taxInclusiveAmountItem, taxInclusiveAmountLabel;
    taxInclusiveAmountLabel = document.createElement("label");
    taxInclusiveAmountLabel.setAttribute("for", "taxInclusiveAmountItem1");
    taxInclusiveAmountLabel.innerHTML = "Totaal itembedrag excl. BTW";
    taxInclusiveAmountItem = document.createElement("input");
    taxInclusiveAmountItem.classList.add("form-control");
    taxInclusiveAmountItem.setAttribute("type", "number");
    taxInclusiveAmountItem.setAttribute("value", "0.00");
    taxInclusiveAmountItem.id = "taxInclusiveAmountItem1";

    div.appendChild(taxInclusiveAmountLabel);
    div.appendChild(taxInclusiveAmountItem);
}

function _removeChildren(collection) {
    while (collection.length > 0) {
        collection[0].remove();
    }
}

function _disableIncludingTaxCheckBox() {
    var box = document.getElementById("taxIncludedBox");
    box.disabled = true;
}

function _enableIncludingTaxCheckBox() {
    var box = document.getElementById("taxIncludedBox");
    box.disabled = false;
}