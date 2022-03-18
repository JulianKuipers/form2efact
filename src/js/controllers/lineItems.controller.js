function changeLineItems() {
  var el = document.getElementById("invoiceLines");
  var count = document.getElementById("count").value;
  var autoCalcBox = document.getElementById("autoCalcBox");
  var taxIncludedBox = document.getElementById("taxIncludedBox");

  var firstChild = el.firstElementChild;

  // Initialize state of first child
  _initialize(firstChild);

  // Clear all appending childs
  while (firstChild.nextElementSibling != null) {
      el.lastElementChild.remove();
  }

  for (let index = 2; index <= count; index++) {
    var child = document.createElement("div");
    // Top div element
    child.id = `item${index}`;

    // Create title h6 element
    var h6 = document.createElement("h6");
    h6.innerHTML = `Positie ${index}`;

    //Create topFormRow
    var topFormRow = document.createElement("div");
    topFormRow.classList.add("form-row");

    var formGroupFull = document.createElement("div");
    formGroupFull.classList.add("form-group");
    formGroupFull.classList.add("col-md-12");

    var nameItemLabel, nameItemInput;
    nameItemLabel = document.createElement("label");
    nameItemLabel.setAttribute("for", `nameItem${index}`);
    nameItemLabel.innerHTML = "Naam/omschrijving";
    nameItemInput = document.createElement("input");
    nameItemInput.classList.add("form-control");
    nameItemInput.setAttribute("type", "text");
    nameItemInput.setAttribute("placeholder", "Naam/omschrijving van het item");
    nameItemInput.id = `nameItem${index}`;

    formGroupFull.appendChild(nameItemLabel);
    formGroupFull.appendChild(nameItemInput);

    topFormRow.appendChild(formGroupFull);

    // Create bottomFormRow
    var bottomFormRow = document.createElement("div");
    bottomFormRow.classList.add("form-row");

    var formGroupLeft = document.createElement("div");
    formGroupLeft.classList.add("form-group");
    formGroupLeft.classList.add("col-md-2");

    var formGroupCentre = document.createElement("div");
    formGroupCentre.classList.add("form-group");
    formGroupCentre.classList.add("col-md-5");

    var formGroupRight = document.createElement("div");
    formGroupRight.classList.add("form-group");
    formGroupRight.classList.add("col-md-5");

    var quantityItem, quantityLabel;
    quantityLabel = document.createElement("label");
    quantityLabel.setAttribute("for", `quantityItem${index}`);
    quantityLabel.innerHTML = "Aantal items";
    quantityItem = document.createElement("input");
    quantityItem.classList.add("form-control");
    quantityItem.setAttribute("type", "number");
    quantityItem.setAttribute("min", 1);
    quantityItem.setAttribute("value", 1);
    quantityItem.id = `quantityItem${index}`;

    var priceItem, priceLabel;
    priceLabel = document.createElement("label");
    priceLabel.setAttribute("for", `priceItem${index}`);
    if (taxIncludedBox.checked) {
      priceLabel.innerHTML = "Stuksprijs inclusief BTW";
    } else {
      priceLabel.innerHTML = "Stuksprijs exclusief BTW";
    }
    priceItem = document.createElement("input");
    priceItem.classList.add("form-control");
    priceItem.setAttribute("type", "text");
    priceItem.setAttribute("value", "0,00");
    priceItem.id = `priceItem${index}`;

    if (!autoCalcBox.checked) {
      var taxInclusiveAmountItem, taxInclusiveAmountLabel;
      taxInclusiveAmountLabel = document.createElement("label");
      taxInclusiveAmountLabel.setAttribute("for", `taxInclusiveAmountItem${index}`);
      taxInclusiveAmountLabel.innerHTML = "Totaal bedrag exclusief BTW van dit item";
      taxInclusiveAmountItem = document.createElement("input");
      taxInclusiveAmountItem.classList.add("form-control");
      taxInclusiveAmountItem.setAttribute("type", "text");
      taxInclusiveAmountItem.setAttribute("value", "0,00");
      taxInclusiveAmountItem.id = `taxInclusiveAmountItem${index}`;

      formGroupRight.appendChild(taxInclusiveAmountLabel);
      formGroupRight.appendChild(taxInclusiveAmountItem);
    }

    formGroupLeft.appendChild(quantityLabel);
    formGroupLeft.appendChild(quantityItem);

    formGroupCentre.appendChild(priceLabel);
    formGroupCentre.appendChild(priceItem);

    bottomFormRow.appendChild(formGroupLeft);
    bottomFormRow.appendChild(formGroupCentre);
    bottomFormRow.appendChild(formGroupRight);

    // Append all to child
    child.appendChild(h6);
    child.appendChild(topFormRow);
    child.appendChild(bottomFormRow);

    el.appendChild(child);
  }
}

function _initialize(element) {
  var label = element.lastElementChild.children[1].firstElementChild;
  label.innerHTML = taxIncludedBox.checked ? "Stuksprijs inclusief BTW" : "Stuksprijs exclusief BTW";
}