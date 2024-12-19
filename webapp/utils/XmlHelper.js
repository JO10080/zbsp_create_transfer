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
            paymentRequest.appendChild(this.createElementWithText(doc, "ExtTransferID", oData.transactionReference));     //"JJPPTEST20241112101"
            paymentRequest.appendChild(this.createElementWithText(doc, "SenderCode", "FIORI"));
            paymentRequest.appendChild(this.createElementWithText(doc, "TypeCode", oData.typeCode));                      //"RTGS"

            // Append OrderingAccount
            paymentRequest.appendChild(this.createOrderingAccount(doc, oData));
            
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
            account.appendChild(this.createElementWithText(doc, "AccountNumber", oData.partnerAccount));    //"2120000716"
            //account.appendChild(this.createElementWithText(doc, "AccountType", "2"));                     //no obligatorio
            orderingAccount.appendChild(account);

            return orderingAccount;
        },

        createReceiver: function(doc, oData) {
            const receiver = doc.createElement("Receiver");
            receiver.appendChild(this.createElementWithText(doc, "ExtReceiverId", oData.transactionReference));         //"JJPP20240909-004"
            receiver.appendChild(this.createElementWithText(doc, "Amount", oData.amount, { Ccy: oData.currency }));     //"90.27", "BZD"

            receiver.appendChild(this.createReceiverAccount(doc, oData));
            receiver.appendChild(this.createReceiverDetails(doc, oData));

            return receiver;
        },

        createReceiverAccount: function(doc, oData) {
            const receiverAccount = doc.createElement("ReceiverAccount");
            receiverAccount.appendChild(this.createElementWithText(doc, "Country", "BZ"));

            const bank = doc.createElement("Bank");
            // bank.appendChild(this.createElementWithText(doc, "BankCode", "0002"));
            if (oData.IntermediaryBankKey) {                
                bank.appendChild(this.createElementWithText(doc, "BICFI", oData.IntermediaryBankKey));
            }
            receiverAccount.appendChild(bank);

            const account = doc.createElement("Account");
            account.appendChild(this.createElementWithText(doc, "AccountNumber", oData.recipientAccountId));        //"00002040000431"
            // account.appendChild(this.createElementWithText(doc, "AccountType", "2"));
            receiverAccount.appendChild(account);

            return receiverAccount;
        },

        createReceiverDetails: function(doc, oData) {
            const receiverDetails = doc.createElement("ReceiverDetails");
            receiverDetails.appendChild(this.createElementWithText(doc, "Name", oData.recipientName));             //"Juanjoze"
            // receiverDetails.appendChild(this.createElementWithText(doc, "ID", "HN12345678"));
            // receiverDetails.appendChild(this.createElementWithText(doc, "Note", "Test Transfer JV"));           //???
            receiverDetails.appendChild(this.createAddressDetails(doc, oData));
            // receiverDetails.appendChild(this.createContactDetails(doc, oData));
            return receiverDetails;
        },

        createAddressDetails: function(doc, oData) {
            const addressDetails = doc.createElement("AddressDetails");
            addressDetails.appendChild(this.createElementWithText(doc, "Address", oData.recipientAddress));           //"Address street 1"
            // addressDetails.appendChild(this.createElementWithText(doc, "City", "Tegucigalpa"));
            addressDetails.appendChild(this.createElementWithText(doc, "Country", oData.recipientCountry));           //HN
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