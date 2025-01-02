sap.ui.define([], function() {
    "use strict";

    return {
        createPaymentRequestXML: function(oData) {
            const doc = document.implementation.createDocument(null, null);
            const documentElement = doc.createElementNS("urn:sap:tech:xsd:/bape_paymreq", "Document");
            
            // Set schemaLocation attribute
            documentElement.setAttribute("xsi:schemaLocation", "urn:sap:tech:xsd:/bape_paymreq BAPE_IN_PAYM_REQ.xsd");
            documentElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");

            // Create PaymentRequest Element
            const paymentRequest = doc.createElement("PaymentRequest");
            paymentRequest.appendChild(this.createElementWithText(doc, "ExtTransferID", oData.ordering.transactionReference));     //"JJPPTEST20241112101"
            paymentRequest.appendChild(this.createElementWithText(doc, "SenderCode", "FIORI"));
            paymentRequest.appendChild(this.createElementWithText(doc, "TypeCode", oData.typeCode));                      //"RTGS"

            // Append OrderingAccount
            paymentRequest.appendChild(this.createOrderingAccount(doc, oData));
           
            //Payment ordering remitance information
            paymentRequest.appendChild(this.createRmtInfo(doc, { PRType: "ZP0007", Content: oData.ordering.chargeType }));
            
            // Append Receiver
            paymentRequest.appendChild(this.createReceiver(doc, oData));

            documentElement.appendChild(paymentRequest);
            doc.appendChild(documentElement);

            return new XMLSerializer().serializeToString(doc);
        },

        createOrderingAccount: function(doc, oData) {
            const orderingAccount = doc.createElement("OrderingAccount");
            orderingAccount.appendChild(this.createElementWithText(doc, "Country", "BZ"));

            const bank = doc.createElement("Bank");
            bank.appendChild(this.createElementWithText(doc, "BankCode", "2100"));
            orderingAccount.appendChild(bank);

            const account = doc.createElement("Account");
            account.appendChild(this.createElementWithText(doc, "AccountNumber", oData.ordering.partnerAccount));    //"2120000716"
            //account.appendChild(this.createElementWithText(doc, "AccountType", "2"));                     //no obligatorio
            orderingAccount.appendChild(account);

            


            return orderingAccount;
        },

        createReceiver: function(doc, oData) {
            const receiver = doc.createElement("Receiver");
            receiver.appendChild(this.createElementWithText(doc, "ExtReceiverId", oData.ordering.transactionReference));         //"JJPP20240909-004"
            receiver.appendChild(this.createElementWithText(doc, "Amount", oData.ordering.amount, { Ccy: oData.ordering.currency }));     //"90.27", "BZD"

            receiver.appendChild(this.createReceiverAccount(doc, oData));
            receiver.appendChild(this.createReceiverDetails(doc, oData));
            receiver.appendChild(this.createRmtInfo(doc, { PRType: "ZP0011", Content: oData.ordering.fileAmount }));     //"Test Transfer JV"
            receiver.appendChild(this.createRmtInfo(doc, { PRType: "ZP0012", Content: oData.ordering.fileCurrency }));
            receiver.appendChild(this.createRmtInfo(doc, { PRType: "/320", Content: oData.transactionChain.AddendaInformation }));
            receiver.appendChild(this.createRmtInfo(doc, { PRType: "/760", Content: oData.transactionChain.TagAcc }));
            receiver.appendChild(this.createRmtInfo(doc, { PRType: "/761", Content: oData.transactionChain.TagBnf }));
            receiver.appendChild(this.createRmtInfo(doc, { PRType: "/763", Content: oData.transactionChain.TagRec }));
            return receiver;
        },

        createReceiverAccount: function(doc, oData) {
            const receiverAccount = doc.createElement("ReceiverAccount");
            receiverAccount.appendChild(this.createElementWithText(doc, "Country", "BZ"));

            const bank = doc.createElement("Bank");
            // bank.appendChild(this.createElementWithText(doc, "BankCode", "0002"));
            if (oData.recipient.IntermediaryBankKey) {                
                bank.appendChild(this.createElementWithText(doc, "BICFI", oData.recipient.IntermediaryBankKey));
            }
            receiverAccount.appendChild(bank);

            const account = doc.createElement("Account");
            account.appendChild(this.createElementWithText(doc, "AccountNumber", oData.recipient.recipientAccountId));        //"00002040000431"
            // account.appendChild(this.createElementWithText(doc, "AccountType", "2"));
            receiverAccount.appendChild(account);

            return receiverAccount;
        },

        createReceiverDetails: function(doc, oData) {
            const receiverDetails = doc.createElement("ReceiverDetails");
            receiverDetails.appendChild(this.createElementWithText(doc, "Name", oData.recipient.recipientName));             //"Juanjoze"
            // receiverDetails.appendChild(this.createElementWithText(doc, "ID", "HN12345678"));
            // receiverDetails.appendChild(this.createElementWithText(doc, "Note", "Test Transfer JV"));           //???
            receiverDetails.appendChild(this.createAddressDetails(doc, oData));
            // receiverDetails.appendChild(this.createContactDetails(doc, oData));
            return receiverDetails;
        },
        createRmtInfo: function(doc, oRmtInfo) {
            const receiverRmtInfo = doc.createElement("RmtInf");
            receiverRmtInfo.appendChild(this.createElementWithText(doc, "PRType", oRmtInfo.PRType));           //"SCOR"
            receiverRmtInfo.appendChild(this.createElementWithText(doc, "Content", oRmtInfo.Content));           //"Test Transfer JV"
            return receiverRmtInfo;
        },

        createAddressDetails: function(doc, oData) {
            const addressDetails = doc.createElement("AddressDetails");
            const fullAddress = `${oData.recipient.Address.Building} ${oData.recipient.Address.BuildingName}, ${oData.recipient.Address.Street}, ${oData.recipient.Address.DistrictName}, ${oData.recipient.Address.TownName}, ${oData.recipient.Address.Country}`;
            addressDetails.appendChild(this.createElementWithText(doc, "Address", fullAddress));           //"Address street 1"
            // addressDetails.appendChild(this.createElementWithText(doc, "City", "Tegucigalpa"));
            addressDetails.appendChild(this.createElementWithText(doc, "Country", oData.recipient.Address.Country));           //HN
            return addressDetails;
        },

        createContactDetails: function(doc, oData) {
            // const contactDetails = doc.createElement("ContactDetails");
            // contactDetails.appendChild(this.createElementWithText(doc, "Email", "juan-jose.penella@sapfioneer.com"));
            // contactDetails.appendChild(this.createElementWithText(doc, "TelephoneNumber", "+34654998877"));
            // return contactDetails;
        },
        
        createElementWithText: function(doc, tagName, textContent, attributes = {}) {
            const element = doc.createElement(tagName);
            if (textContent) {
                element.textContent = textContent;
            }
            for (const [key, value] of Object.entries(attributes)) {
                element.setAttribute(key, value);
            }
            return element;
        }
    };
});