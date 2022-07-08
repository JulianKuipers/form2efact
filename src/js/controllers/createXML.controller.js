function getXML() {
    var id, invoiceType, issueDate, dueDate, note, poNum, invCount, delivDate, iban, taxAmount, taxableAmount, taxInclusiveAmount, count, invoiceLines, invoicelinesXML, linesArray, autoCalc, header, bankName;
    
    var xml = ``;

    poNum = document.getElementById("poNumber").value;
    invCount = document.getElementById("invoiceCount").value
    id = poNum + invCount;

    issueDate = Formatter.formatDate(new Date());
    dueDate = Formatter.formatDate(addDays(new Date(), 30))
    delivDate = issueDate;

    note = `Testfactuur ${poNum} ${invCount}`;

    iban = document.getElementById("iban").value;
    bankName = iban.slice(4,8);

    invoiceType = document.getElementById("invoiceType").value === "Factuur" ? 380 : 381;

    autoCalc = document.getElementById("autoCalcBox").checked;
    var isIncludingTax = document.getElementById("taxIncludedBox").checked;

    var taxPercentage = Formatter.formatCurrency(document.getElementById("taxPercentage").value);

    count = document.getElementById("count").value;
    invoiceLines = createInvLines(count, autoCalc, taxPercentage, isIncludingTax);
    invoicelinesXML = invoiceLines.xml;

    const standaard = document.getElementById("standaard").value;

    if (autoCalc) {
        linesArray = invoiceLines.lineTotalsExcludingTax;
        header = autoCalculateHeader(linesArray, taxPercentage, isIncludingTax);
        taxAmount = Formatter.formatCurrency(header.taxAmount);
        taxableAmount = Formatter.formatCurrency(header.taxableAmount);
        taxInclusiveAmount = Formatter.formatCurrency(header.taxInclusiveAmount);
    } else {
        taxAmount = Formatter.formatCurrency(document.getElementById("taxAmount").value);
        taxableAmount = Formatter.formatCurrency(document.getElementById("taxableAmount").value);
        taxInclusiveAmount = Formatter.formatCurrency(document.getElementById("taxInclusiveAmount").value);
    }
    
    if (standaard === "NLCIUS") {
        xml = 
        `<doc:Invoice xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
        xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
        xmlns:doc="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
        xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"
        xmlns:nl-cac="urn:digi-inkoop:ubl:2.0:NL:1.8:UBL-NL-CommonAggregateComponents-2"
        xmlns:nl-cbc="urn:digi-inkoop:ubl:2.0:NL:1.8:UBL-NL-CommonBasicComponents-2"
        xmlns:xs="http://www.w3.org/2001/XMLSchema">
            <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
            <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:nen.nl:nlcius:v1.0</cbc:CustomizationID>
            <cbc:ProfileID>NL</cbc:ProfileID>
            <cbc:ID>${id}</cbc:ID>
            <cbc:IssueDate>${issueDate}</cbc:IssueDate>
            <cbc:DueDate>${dueDate}</cbc:DueDate>
            <cbc:InvoiceTypeCode>${invoiceType}</cbc:InvoiceTypeCode>
            <cbc:Note>${note}</cbc:Note>
            <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
            <cac:OrderReference>
            <cbc:ID>${poNum}</cbc:ID>
            </cac:OrderReference>
            <cac:AccountingSupplierParty>
            <cac:Party>
                <cac:PartyName>
                    <cbc:Name>Company BV</cbc:Name>
                </cac:PartyName>
                <cac:PostalAddress>
                    <cbc:StreetName>Street 1</cbc:StreetName>
                    <cbc:CityName>City</cbc:CityName>
                    <cbc:PostalZone>1234 AB</cbc:PostalZone>
                    <cac:Country>
                        <cbc:IdentificationCode>NL</cbc:IdentificationCode>
                    </cac:Country>
                </cac:PostalAddress>
                <cac:PartyTaxScheme>
                    <cbc:CompanyID>NL123456789B01</cbc:CompanyID>
                    <cac:TaxScheme>
                        <cbc:ID>VAT</cbc:ID>
                    </cac:TaxScheme>
                </cac:PartyTaxScheme>
                <cac:PartyLegalEntity>
                    <cbc:RegistrationName>Company BV</cbc:RegistrationName>
                    <cbc:CompanyID schemeID="0106">12345678</cbc:CompanyID>
                </cac:PartyLegalEntity>
                <cac:Contact>
                    <cbc:ElectronicMail>administratie@companybv.nl</cbc:ElectronicMail>
                </cac:Contact>
            </cac:Party>
            </cac:AccountingSupplierParty>
            <cac:AccountingCustomerParty>
            <cac:Party>
                <cac:PartyName>
                    <cbc:Name>Customer BV</cbc:Name>
                </cac:PartyName>
                <cac:PostalAddress>
                    <cbc:StreetName>Street 5</cbc:StreetName>
                    <cbc:CityName>Amsterdam</cbc:CityName>
                    <cbc:PostalZone>4321 YZ</cbc:PostalZone>
                    <cac:Country>
                        <cbc:IdentificationCode>NL</cbc:IdentificationCode>
                    </cac:Country>
                </cac:PostalAddress>
                <cac:PartyLegalEntity>
                    <cbc:RegistrationName>Customer BV</cbc:RegistrationName>
                    <cbc:CompanyID schemeID="0190">99000000000000000000</cbc:CompanyID>
                </cac:PartyLegalEntity>
            </cac:Party>
            </cac:AccountingCustomerParty>
            <cac:Delivery>
                <cbc:ActualDeliveryDate>${delivDate}</cbc:ActualDeliveryDate>
                <cac:DeliveryLocation>
                    <cac:Address>
                        <cac:Country>
                            <cbc:IdentificationCode>NL</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:Address>
                </cac:DeliveryLocation>
            </cac:Delivery>
            <cac:PaymentMeans>
                <cbc:PaymentMeansCode>58</cbc:PaymentMeansCode>
                <cbc:PaymentID>123ID</cbc:PaymentID>
                <cac:PayeeFinancialAccount>
                    <cbc:ID>${iban}</cbc:ID>
                </cac:PayeeFinancialAccount>
            </cac:PaymentMeans>
            <cac:PaymentTerms>
                <cbc:Note>Betaling binnen 30 dagen</cbc:Note>
            </cac:PaymentTerms>
            <cac:TaxTotal>
                <cbc:TaxAmount currencyID="EUR">${taxAmount}</cbc:TaxAmount>
                <cac:TaxSubtotal>
                    <cbc:TaxableAmount currencyID="EUR">${taxableAmount}</cbc:TaxableAmount>
                    <cbc:TaxAmount currencyID="EUR">${taxAmount}</cbc:TaxAmount>
                    <cac:TaxCategory>
                        <cbc:ID>S</cbc:ID>
                        <cbc:Percent>${taxPercentage}</cbc:Percent>
                        <cac:TaxScheme>
                            <cbc:ID>VAT</cbc:ID>
                        </cac:TaxScheme>
                    </cac:TaxCategory>
                </cac:TaxSubtotal>
            </cac:TaxTotal>
            <cac:LegalMonetaryTotal>
                <cbc:LineExtensionAmount currencyID="EUR">${taxableAmount}</cbc:LineExtensionAmount>
                <cbc:TaxExclusiveAmount currencyID="EUR">${taxableAmount}</cbc:TaxExclusiveAmount>
                <cbc:TaxInclusiveAmount currencyID="EUR">${taxInclusiveAmount}</cbc:TaxInclusiveAmount>
                <cbc:PayableAmount currencyID="EUR">${taxInclusiveAmount}</cbc:PayableAmount>
            </cac:LegalMonetaryTotal>
            ${invoicelinesXML}
        </doc:Invoice>`;
    } else if (standaard === "UBL-OHNL") {
        invoiceType = invoiceType === 380 ? "D" : "C";
        xml = 
        `<?xml version="1.0" encoding="UTF-8"?>
        <doc:Invoice 
        xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 ../xsdrt/maindoc/Invoice.xsd urn:digi-inkoop:ubl:2.0:NL:1.7:UBL-NL-CommonBasicComponents-2 ../xsdrt/common/UBL-CommonBasicComponents-2.0-NL-1.7.xsd" 
        xmlns:doc="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" 
        xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
        xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"
        xmlns:nl-cbc="urn:digi-inkoop:ubl:2.0:NL:1.7:UBL-NL-CommonBasicComponents-2">
            <cbc:UBLVersionID>2.0</cbc:UBLVersionID>
            <cbc:CustomizationID>1.9</cbc:CustomizationID>
            <cbc:ProfileID>NL</cbc:ProfileID>
            <cbc:ID>${id}</cbc:ID>
            <cbc:CopyIndicator>false</cbc:CopyIndicator>
            <cbc:IssueDate>${issueDate}</cbc:IssueDate>
            <cbc:InvoiceTypeCode listAgencyID="88" listAgencyName="Logius Gegevensbeheer NL-Overheid" listID="NL-1001" listName="FactuurSoort" listSchemeURI="urn:digi-inkoop:ubl:2.0:NL:1.7:gc:InvoiceTypeCode" listURI="http://www.nltaxonomie.nl/ubl/2.0/NL/1.7/cl/gc/InvoiceTypeCode.gc" listVersionID="1.7">${invoiceType}</cbc:InvoiceTypeCode>
            <cbc:AccountingCostCode>Onbekend</cbc:AccountingCostCode>
            <cac:AccountingSupplierParty>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeAgencyID="NL" schemeAgencyName="KvK">181911512</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name>Staples</cbc:Name>
                    </cac:PartyName>
                    <cac:PostalAddress>
                        <cbc:StreetName>straat</cbc:StreetName>
                        <cbc:BuildingNumber>2</cbc:BuildingNumber>
                        <cbc:CityName>Plaats</cbc:CityName>
                        <cbc:PostalZone>1234AB</cbc:PostalZone>
                        <cac:Country>
                            <cbc:IdentificationCode
                                listAgencyName="United Nations Economic Commission for Europe"
                                listAgencyID="6" listName="Country" listID="ISO3166-1"
                                listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode"
                                listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc"
                                listVersionID="0.3">NL</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:PostalAddress>
                    <cac:PartyLegalEntity>
                        <cac:RegistrationAddress>
                            <cbc:Postbox>1</cbc:Postbox>
                            <cbc:CityName>Amsterdam</cbc:CityName>
                            <cbc:PostalZone>1000AA</cbc:PostalZone>
                            <cac:Country>
                                <cbc:IdentificationCode
                                    listID="ISO3166-1"
                                    listAgencyID="6"
                                    listAgencyName="United Nations Economic Commission for Europe"
                                    listName="Country"
                                    listVersionID="0.3"
                                    listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc"
                                    listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode">NL</cbc:IdentificationCode>
                            </cac:Country>
                        </cac:RegistrationAddress>
                    </cac:PartyLegalEntity>
                </cac:Party>
            </cac:AccountingSupplierParty>
            <cac:AccountingCustomerParty>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeAgencyID="NL" schemeAgencyName="BTW">NL12345678B01</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name>Logius</cbc:Name>
                    </cac:PartyName>
                    <cac:PostalAddress>
                        <cbc:StreetName>Wilhelmina van Pruisenweg</cbc:StreetName>
                        <cbc:BuildingNumber>52</cbc:BuildingNumber>
                        <cbc:CityName>Den Haag</cbc:CityName>
                        <cbc:PostalZone>2595 AN</cbc:PostalZone>
                        <cac:Country>
                            <cbc:IdentificationCode listAgencyName="United Nations Economic Commission for Europe" listAgencyID="6" listName="Country" listID="ISO3166-1" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode" listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc" listVersionID="0.3">NL</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:PostalAddress>
                    <cac:PartyLegalEntity>
                        <cac:RegistrationAddress>
                            <cbc:Postbox>2</cbc:Postbox>
                            <cbc:CityName>Amsterdam</cbc:CityName>
                            <cbc:PostalZone>1000AB</cbc:PostalZone>
                            <cac:Country>
                                <cbc:IdentificationCode
                                    listID="ISO3166-1"
                                    listAgencyID="6"
                                    listAgencyName="United Nations Economic Commission for Europe"
                                    listName="Country"
                                    listVersionID="0.3"
                                    listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc"
                                    listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode">NL</cbc:IdentificationCode>
                            </cac:Country>
                        </cac:RegistrationAddress>
                    </cac:PartyLegalEntity>
                </cac:Party>
            </cac:AccountingCustomerParty>
            <cac:BuyerCustomerParty>
                <cbc:SupplierAssignedAccountID>131579</cbc:SupplierAssignedAccountID>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeAgencyID="NL" schemeAgencyName="BTW">NL12345678B01</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name>Logius</cbc:Name>
                    </cac:PartyName>
                    <cac:PostalAddress>
                        <cbc:StreetName>straat</cbc:StreetName>
                        <cbc:BuildingNumber>4</cbc:BuildingNumber>
                        <cbc:CityName>Plaats</cbc:CityName>
                        <cbc:PostalZone>1234AB</cbc:PostalZone>
                        <cac:Country>
                            <cbc:IdentificationCode
                                listAgencyName="United Nations Economic Commission for Europe"
                                listAgencyID="6" listName="Country" listID="ISO3166-1"
                                listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode"
                                listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc"
                                listVersionID="0.3">NL</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:PostalAddress>
                    <cac:PartyLegalEntity>
                        <cac:RegistrationAddress>
                            <cbc:Postbox>3</cbc:Postbox>
                            <cbc:CityName>Amsterdam</cbc:CityName>
                            <cbc:PostalZone>1000AC</cbc:PostalZone>
                            <cac:Country>
                                <cbc:IdentificationCode
                                    listID="ISO3166-1"
                                    listAgencyID="6"
                                    listAgencyName="United Nations Economic Commission for Europe"
                                    listName="Country"
                                    listVersionID="0.3"
                                    listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc"
                                    listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode">NL</cbc:IdentificationCode>
                            </cac:Country>
                        </cac:RegistrationAddress>
                    </cac:PartyLegalEntity>
                </cac:Party>
            </cac:BuyerCustomerParty>
            <cac:SellerSupplierParty>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeAgencyID="NL" schemeAgencyName="KvK">181911512</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name>Company BV</cbc:Name>
                    </cac:PartyName>
                    <cac:PostalAddress>
                        <cbc:StreetName>Straat</cbc:StreetName>
                        <cbc:BuildingNumber>27</cbc:BuildingNumber>
                        <cbc:CityName>Den Haag</cbc:CityName>
                        <cbc:PostalZone>1289 AZ</cbc:PostalZone>
                        <cac:Country>
                            <cbc:IdentificationCode listAgencyName="United Nations Economic Commission for Europe" listAgencyID="6" listName="Country" listID="ISO3166-1" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode" listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc" listVersionID="0.3">NL</cbc:IdentificationCode>
                        </cac:Country>
                    </cac:PostalAddress>
                    <cac:PartyLegalEntity>
                        <cac:RegistrationAddress>
                            <cbc:Postbox>4</cbc:Postbox>
                            <cbc:CityName>Amsterdam</cbc:CityName>
                            <cbc:PostalZone>1000AD</cbc:PostalZone>
                            <cac:Country>
                                <cbc:IdentificationCode
                                    listID="ISO3166-1"
                                    listAgencyID="6"
                                    listAgencyName="United Nations Economic Commission for Europe"
                                    listName="Country"
                                    listVersionID="0.3"
                                    listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/CountryIdentificationCode-2.0.gc"
                                    listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode">NL</cbc:IdentificationCode>
                            </cac:Country>
                        </cac:RegistrationAddress>
                    </cac:PartyLegalEntity>
                </cac:Party>
            </cac:SellerSupplierParty>
            <cac:Delivery>
                <cbc:ActualDeliveryDate>${delivDate}</cbc:ActualDeliveryDate>
            </cac:Delivery>
            <cac:PaymentMeans>
                <cbc:PaymentMeansCode
                    listID="UN/ECE 4461"
                    listAgencyID="6"
                    listAgencyName="United Nations Economic Commission for Europe"
                    listName="Payment Means"
                    listVersionID="D03A"
                    listURI="http://docs.oasis-open.org/ubl/os-UBL-2.0-update/cl/gc/default/PaymentMeansCode-2.0.gc"
                    listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:PaymentMeansCode">22</cbc:PaymentMeansCode>
                <cac:PayeeFinancialAccount>
                    <cbc:ID>${iban}</cbc:ID>
                    <cac:FinancialInstitutionBranch>
                        <cac:FinancialInstitution>
                            <cbc:ID>${bankName}</cbc:ID>
                        </cac:FinancialInstitution>
                    </cac:FinancialInstitutionBranch>
                </cac:PayeeFinancialAccount>
            </cac:PaymentMeans>
            <cac:TaxTotal>
                <cbc:TaxAmount currencyID="EUR">${taxAmount}</cbc:TaxAmount>
                <cac:TaxSubtotal>
                    <cbc:TaxableAmount currencyID="EUR">${taxableAmount}</cbc:TaxableAmount>
                    <cbc:TaxAmount currencyID="EUR">${taxAmount}</cbc:TaxAmount>
                    <cbc:Percent>${taxPercentage}</cbc:Percent>
                    <cac:TaxCategory>
                        <cac:TaxScheme>
                            <cbc:Name>BTW</cbc:Name>
                        </cac:TaxScheme>
                    </cac:TaxCategory>
                </cac:TaxSubtotal>
            </cac:TaxTotal>
            <cac:LegalMonetaryTotal>
                <cbc:LineExtensionAmount currencyID="EUR">${taxableAmount}</cbc:LineExtensionAmount>
                <cbc:TaxExclusiveAmount currencyID="EUR">${taxableAmount}</cbc:TaxExclusiveAmount>
                <cbc:TaxInclusiveAmount currencyID="EUR">${taxInclusiveAmount}</cbc:TaxInclusiveAmount>
                <cbc:PayableAmount currencyID="EUR">${taxInclusiveAmount}</cbc:PayableAmount>
            </cac:LegalMonetaryTotal>
            ${invoicelinesXML}
        </doc:Invoice>`;
    }

    return xml;
}

function createInvLines(max, autoCalc, taxPercentage, isIncludingTax) {
    const sanitizer = new Sanitizer("text");
    const standaard = document.getElementById("standaard").value;
    var xml = ``;
    var i = 1;
    var lineTotalsArray = [];
    while (i <= max) {
        var name, quantity, price, cost, lineObj, priceAmount;
        name = sanitizer.sanitize(document.getElementById(`nameItem${i}`).value);
        quantity = document.getElementById(`quantityItem${i}`).value;
        price = Formatter.formatCurrency(document.getElementById(`priceItem${i}`).value);
        if (autoCalc) {
            cost = Formatter.formatCurrency(autoCalculateLine(isIncludingTax, quantity, price, taxPercentage));
            lineObj = {
                lineID: i,
                price : price,
                quantity : quantity,
                lineTotalExcludingTax: cost
            };
            lineTotalsArray.push(lineObj)
        } else {
            cost = Formatter.formatCurrency(document.getElementById(`taxInclusiveAmountItem${i}`).value); 
        }

        var lid;
        if (i >= 0 && i < 10) {
            lid = `000${i}0`;
        } else if (i > 9 && i < 100) {
            lid = `00${i}0`;
        } else if (i > 99 && i < 1000) {
            lid = `0${i}0`;
        } else if (i > 999 && i < 10000) {
            lid = `${i}0`;
        } else {
            lid = `-1`;
        }

        priceAmount = Formatter.formatCurrency(isIncludingTax ? roundTwoDecimals(price / getTaxRatio(taxPercentage)): price);

        if (standaard === "NLCIUS") {
            xml += 
            `<cac:InvoiceLine>
                <cbc:ID>${i}</cbc:ID>
                <cbc:InvoicedQuantity unitCode="ZZ">${quantity}</cbc:InvoicedQuantity>
                <cbc:LineExtensionAmount currencyID="EUR">${cost}</cbc:LineExtensionAmount>
                <cac:OrderLineReference>
                    <cbc:LineID>${lid}</cbc:LineID>
                </cac:OrderLineReference>
                <cac:Item>
                    <cbc:Description>${name}</cbc:Description>
                    <cbc:Name>${name}</cbc:Name>
                    <cac:SellersItemIdentification>
                        <cbc:ID>PROD123</cbc:ID>
                    </cac:SellersItemIdentification>
                    <cac:ClassifiedTaxCategory>
                        <cbc:ID>S</cbc:ID>
                        <cbc:Percent>${taxPercentage}</cbc:Percent>
                        <cac:TaxScheme>
                            <cbc:ID>VAT</cbc:ID>
                        </cac:TaxScheme>
                    </cac:ClassifiedTaxCategory>
                </cac:Item>
                <cac:Price>
                    <cbc:PriceAmount currencyID="EUR">${priceAmount}</cbc:PriceAmount>
                    <cbc:BaseQuantity>1</cbc:BaseQuantity>
                </cac:Price>
            </cac:InvoiceLine>`;
        } else if (standaard === "UBL-OHNL") {
            xml += 
            `<cac:InvoiceLine>
                <cbc:ID>${i}</cbc:ID>
                <cbc:InvoicedQuantity unitCode="ST">${quantity}</cbc:InvoicedQuantity>
                <cbc:LineExtensionAmount currencyID="EUR">${cost}</cbc:LineExtensionAmount>
                <cbc:FreeOfChargeIndicator>false</cbc:FreeOfChargeIndicator>
                <cac:OrderLineReference>
                    <cbc:LineID>${lid}</cbc:LineID>
                    <cac:OrderReference>
                        <cbc:ID>${document.getElementById("poNumber").value}</cbc:ID>
                    </cac:OrderReference>
                </cac:OrderLineReference>
                <cac:Delivery>
                    <cbc:ActualDeliveryDate>${Formatter.formatDate(new Date())}</cbc:ActualDeliveryDate>
                </cac:Delivery>
                <cac:TaxTotal>
                    <cbc:TaxAmount currencyID="EUR">${cost * (taxPercentage / 100)}</cbc:TaxAmount>
                    <cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="EUR">${cost}</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="EUR">${cost * (taxPercentage / 100)}</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cbc:Percent>${taxPercentage}</cbc:Percent>
                            <cac:TaxScheme>
                                <cbc:Name>BTW</cbc:Name>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                </cac:TaxTotal>
                <cac:Item>
                    <cbc:CatalogueIndicator>false</cbc:CatalogueIndicator>
                    <cbc:Name>${name}</cbc:Name>
                    <cac:SellersItemIdentification>
                        <cbc:ID>${Math.round(Math.random() * 963485)}</cbc:ID>
                    </cac:SellersItemIdentification>
                </cac:Item>
                <cac:Price>
                    <cbc:PriceAmount currencyID="EUR">${priceAmount}</cbc:PriceAmount>
                    <cbc:BaseQuantity unitCode="ST">1</cbc:BaseQuantity>
                </cac:Price>
            </cac:InvoiceLine>`;
        }

     i++;
    }
    return {
        xml: xml,
        lineTotalsExcludingTax : lineTotalsArray
    };
}