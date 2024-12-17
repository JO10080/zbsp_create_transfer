// utils/XmlHelper.js
sap.ui.define([], function() {
    "use strict";

    return {
        createDataPDUXML: function() {
            const xmlDoc = document.implementation.createDocument("", "", null);

            // Create DataPDU Element
            const dataPDU = xmlDoc.createElementNS("urn:swift:saa:xsd:saa.2.0", "DataPDU");
            dataPDU.setAttribute("xmlns:Sw", "urn:swift:snl:ns.Sw");
            dataPDU.setAttribute("xmlns:SwGbl", "urn:swift:snl:ns.SwGbl");
            dataPDU.setAttribute("xmlns:SwInt", "urn:swift:snl:ns.SwInt");
            dataPDU.setAttribute("xmlns:SwSec", "urn:swift:snl:ns.SwSec");

            // Create Header Element
            const header = xmlDoc.createElement("Header");
            const message = xmlDoc.createElement("Message");

            // Populate Message Element
            message.appendChild(this.createElementWithText(xmlDoc, "SenderReference", "OATTDHNTEXXX008000000010234$20230907151808"));
            message.appendChild(this.createElementWithText(xmlDoc, "MessageIdentifier", "pacs.008.001.08"));
            message.appendChild(this.createElementWithText(xmlDoc, "Format", "MX"));
            message.appendChild(this.createElementWithText(xmlDoc, "SubFormat", "Input"));

            // Add Sender Element
            message.appendChild(this.createSender(xmlDoc));

            // Add Receiver Element
            message.appendChild(this.createReceiver(xmlDoc));

            // InterfaceInfo Element
            message.appendChild(this.createInterfaceInfo(xmlDoc));

            // NetworkInfo Element
            message.appendChild(this.createNetworkInfo(xmlDoc));

            header.appendChild(message);
            dataPDU.appendChild(header);

            // Create Body Element
            const body = xmlDoc.createElement("Body");
            const appHdr = this.createAppHdr(xmlDoc);

            body.appendChild(appHdr);
            body.appendChild(this.createDocument(xmlDoc));
            dataPDU.appendChild(body);

            // Serialize to string
            const serializer = new XMLSerializer();
            return serializer.serializeToString(dataPDU);
        },

        createElementWithText: function(doc, tagName, textContent) {
            const element = doc.createElement(tagName);
            element.textContent = textContent;
            return element;
        },

        createSender: function(doc) {
            const sender = doc.createElement("Sender");
            sender.appendChild(this.createElementWithText(doc, "DN", "o=attdhnte,o=swift"));

            const fullName = doc.createElement("FullName");
            fullName.appendChild(this.createElementWithText(doc, "X1", "CEBBBZBZXXX"));
            sender.appendChild(fullName);
            return sender;
        },

        createReceiver: function(doc) {
            const receiver = doc.createElement("Receiver");
            receiver.appendChild(this.createElementWithText(doc, "DN", "o=attdhnte,o=swift"));

            const fullName = doc.createElement("FullName");
            fullName.appendChild(this.createElementWithText(doc, "X1", "LIBABZBZXXX"));
            receiver.appendChild(fullName);
            return receiver;
        },

        createInterfaceInfo: function(doc) {
            const interfaceInfo = doc.createElement("InterfaceInfo");
            interfaceInfo.appendChild(this.createElementWithText(doc, "UserReference", "TC01.01"));
            return interfaceInfo;
        },

        createNetworkInfo: function(doc) {
            const networkInfo = doc.createElement("NetworkInfo");
            networkInfo.appendChild(this.createElementWithText(doc, "Priority", "Normal"));
            networkInfo.appendChild(this.createElementWithText(doc, "Service", "swift.finplus!pf"));
            networkInfo.appendChild(doc.createElement("SWIFTNetNetworkInfo"));
            return networkInfo;
        },

        createAppHdr: function(doc) {
            const appHdr = doc.createElementNS("urn:iso:std:iso:20022:tech:xsd:head.001.001.02", "AppHdr");
            appHdr.appendChild(this.createFr(doc));
            appHdr.appendChild(this.createTo(doc));
            appHdr.appendChild(this.createElementWithText(doc, "BizMsgIdr", "CEBB202410319000000002"));
            appHdr.appendChild(this.createElementWithText(doc, "MsgDefIdr", "pacs.008.001.08"));
            appHdr.appendChild(this.createElementWithText(doc, "BizSvc", "swift.cbprplus.01"));
            appHdr.appendChild(this.createElementWithText(doc, "CreDt", "2023-09-07T15:18:07-06:00"));
            return appHdr;
        },

        createFr: function(doc) {
            const fr = doc.createElement("Fr");
            const fiId = doc.createElement("FIId");
            const finInstnId = doc.createElement("FinInstnId");
            finInstnId.appendChild(this.createElementWithText(doc, "BICFI", "CEBBBZBZXXX"));
            fiId.appendChild(finInstnId);
            fr.appendChild(fiId);
            return fr;
        },

        createTo: function(doc) {
            const to = doc.createElement("To");
            const fiId = doc.createElement("FIId");
            const finInstnId = doc.createElement("FinInstnId");
            finInstnId.appendChild(this.createElementWithText(doc, "BICFI", "LIBABZBZXXX"));
            fiId.appendChild(finInstnId);
            to.appendChild(fiId);
            return to;
        },

        createDocument: function(doc) {
            const document = doc.createElementNS("urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08", "Document");
            const fiToFICstmrCdtTrf = doc.createElement("FIToFICstmrCdtTrf");

            //-------------- Create GrpHdr Element --------------
            //clrSys element
            const clrSys = doc.createElement("ClrSys");
            clrSys.appendChild(this.createElementWithText(doc, "Cd", "RTG"));
            
            //sttlmInf Element
            const sttlmInf = doc.createElement("SttlmInf");
            sttlmInf.appendChild(this.createElementWithText(doc, "SttlmMtd", "CLRG"));
            sttlmInf.appendChild(clrSys);

            const grpHdr = doc.createElement("GrpHdr");
            grpHdr.appendChild(this.createElementWithText(doc, "MsgId", "CEBB202410319000000002"));
            grpHdr.appendChild(this.createElementWithText(doc, "CreDtTm", "2023-09-07T15:18:07-06:00"));
            grpHdr.appendChild(this.createElementWithText(doc, "NbOfTxs", "1"));
            grpHdr.appendChild(sttlmInf);
            
            
            
            

            
            // Create CdtTrfTxInf Element
            const cdtTrfTxInf = doc.createElement("CdtTrfTxInf");
            // Insert the PmtId Element
            cdtTrfTxInf.appendChild(this.createPmtId(doc));
            // Insert the PmtTpInf Element
            cdtTrfTxInf.appendChild(this.createPmtTpInf(doc));
            // Insert the IntrBkSttlmAmt Element
            cdtTrfTxInf.appendChild(this.createIntrBkSttlmAmt(doc, "BZD", "22.02"));
            cdtTrfTxInf.appendChild(this.createElementWithText(doc, "IntrBkSttlmDt", "2023-09-07"));
            cdtTrfTxInf.appendChild(this.createElementWithText(doc, "ChrgBr", "DEBT"));
            // Insert the InstgAgt Element
            cdtTrfTxInf.appendChild(this.createInstgAgt(doc, "CEBBBZBZXXX"));
            // Insert the InstdAgt Element
            cdtTrfTxInf.appendChild(this.createInstdAgt(doc, "LIBABZBZXXX"));
            // Insert the Dbtr Element
            cdtTrfTxInf.appendChild(this.createDbtr(doc, "Cliente Banco Occidente", "Calle uno", "Binefar", "BZ", ["Dbtr Address", "Dbtr Address Details2"], "1990-08-03", "Tegucigalpa1", "BZ", "BZ45454567001", "CUST"));
            // Insert the DbtrAcct Element
            cdtTrfTxInf.appendChild(this.createDbtrAcct(doc, "212011080040", "2"));
            // Insert the DbtrAgt Element
            cdtTrfTxInf.appendChild(this.createDbtrAgt(doc, "BOCCHNTEXXX"));
            // Insert the CdtrAgt Element
            cdtTrfTxInf.appendChild(this.createCdtrAgt(doc, "LIBABZBZXXX", "2000", "HN"));
            // Insert the Cdtr Element
            cdtTrfTxInf.appendChild(this.createCdtr(doc, "Frutas y verduras SL", "Calle Buenavista", "Esplus", "BZ", ["Direccion 1", "Direccion 2"], "0000000000000"));
            // Insert the CdtrAcct Element
            cdtTrfTxInf.appendChild(this.createCdtrAcct(doc, "2120000716", "2"));
            // Insert the InstrForNxtAgt Element
            cdtTrfTxInf.appendChild(this.createInstrForNxtAgt(doc, "PAGO DE SUMINISTROS"));

            // Insert the RmtInf Element
            cdtTrfTxInf.appendChild(this.createRmtInf(doc, "/772", "PAGO DE SUMINISTROS"));

            fiToFICstmrCdtTrf.appendChild(grpHdr);
            fiToFICstmrCdtTrf.appendChild(cdtTrfTxInf);
            document.appendChild(fiToFICstmrCdtTrf);
            return document;
        },

        createPmtId: function(doc) {
            const pmtId = doc.createElement("PmtId");
            pmtId.appendChild(this.createElementWithText(doc, "InstrId", "0001ATTD5001954"));
            pmtId.appendChild(this.createElementWithText(doc, "EndToEndId", "E2E20230315-002-002"));
            pmtId.appendChild(this.createElementWithText(doc, "TxId", "CEBBBZBZ00000000000003"));
            pmtId.appendChild(this.createElementWithText(doc, "UETR", "b1cac04e-216e-412e-b131-609047a5bb10"));
            
            return pmtId;
        },

        createPmtTpInf: function(doc) {
            const pmtTpInf = doc.createElement("PmtTpInf");
        
            const svcLvl = doc.createElement("SvcLvl");
            svcLvl.appendChild(this.createElementWithText(doc, "Prtry", "0806"));
            pmtTpInf.appendChild(svcLvl);
        
            const lclInstrm = doc.createElement("LclInstrm");
            lclInstrm.appendChild(this.createElementWithText(doc, "Prtry", "RTGSFIToFICustomerCredit"));
            pmtTpInf.appendChild(lclInstrm);
        
            const ctgyPurp = doc.createElement("CtgyPurp");
            ctgyPurp.appendChild(this.createElementWithText(doc, "Cd", "CASH"));
            pmtTpInf.appendChild(ctgyPurp);
        
            return pmtTpInf;
        },

        createIntrBkSttlmAmt: function(doc, ccy, amount) {
            const intrBkSttlmAmt = doc.createElement("IntrBkSttlmAmt");
            intrBkSttlmAmt.setAttribute("Ccy", ccy); // Set the currency attribute
            intrBkSttlmAmt.textContent = amount; // Set the text content
            return intrBkSttlmAmt;
        },

        createInstgAgt: function(doc, bic) {
            const instgAgt = doc.createElement("InstgAgt");
            const finInstnId = doc.createElement("FinInstnId");
            finInstnId.appendChild(this.createElementWithText(doc, "BICFI", bic));
            instgAgt.appendChild(finInstnId); // Append FinInstnId to InstgAgt
            return instgAgt; // Return the complete InstgAgt element
        },

        createInstdAgt: function(doc, bic) {
            const instdAgt = doc.createElement("InstdAgt");
            const finInstnId = doc.createElement("FinInstnId");
            finInstnId.appendChild(this.createElementWithText(doc, "BICFI", bic));
            
            // Uncomment to include ClrSysMmbId if needed
            /*
            const clrSysMmbId = doc.createElement("ClrSysMmbId");
            const clrSysId = doc.createElement("ClrSysId");
            clrSysId.appendChild(this.createElementWithText(doc, "Cd", "USPID"));
            clrSysMmbId.appendChild(clrSysId);
            clrSysMmbId.appendChild(this.createElementWithText(doc, "MmbId", "2000"));
            finInstnId.appendChild(clrSysMmbId);
            */
            
            instdAgt.appendChild(finInstnId); // Append FinInstnId to InstdAgt
            return instdAgt; // Return the complete InstdAgt element
        },

        createDbtr: function(doc, name, street, town, country, addressLines, birthDate, birthCity, birthCountry, id, schemeName) {
            const dbtr = doc.createElement("Dbtr");
            dbtr.appendChild(this.createElementWithText(doc, "Nm", name));
        
            // Create PstlAdr Element
            const pstlAdr = doc.createElement("PstlAdr");
            pstlAdr.appendChild(this.createElementWithText(doc, "StrtNm", street));
            pstlAdr.appendChild(this.createElementWithText(doc, "TwnNm", town));
            pstlAdr.appendChild(this.createElementWithText(doc, "Ctry", country));
        
            // Append address lines
            addressLines.forEach(line => {
                pstlAdr.appendChild(this.createElementWithText(doc, "AdrLine", line));
            });
            
            dbtr.appendChild(pstlAdr);
        
            // Create Id Element
            const idElement = doc.createElement("Id");
            const prvtId = doc.createElement("PrvtId");
            const dtAndPlcOfBirth = doc.createElement("DtAndPlcOfBirth");
            dtAndPlcOfBirth.appendChild(this.createElementWithText(doc, "BirthDt", birthDate));
            dtAndPlcOfBirth.appendChild(this.createElementWithText(doc, "CityOfBirth", birthCity));
            dtAndPlcOfBirth.appendChild(this.createElementWithText(doc, "CtryOfBirth", birthCountry));
            
            prvtId.appendChild(dtAndPlcOfBirth);
            const othr = doc.createElement("Othr");
            othr.appendChild(this.createElementWithText(doc, "Id", id));
            
            const schmeNm = doc.createElement("SchmeNm");
            schmeNm.appendChild(this.createElementWithText(doc, "Cd", schemeName));
            othr.appendChild(schmeNm);
            
            prvtId.appendChild(othr);
            idElement.appendChild(prvtId);
            dbtr.appendChild(idElement);
        
            return dbtr; // Return the complete Dbtr element
        },

        createDbtrAcct: function(doc, id, type) {
            const dbtrAcct = doc.createElement("DbtrAcct");
        
            // Create Id Element
            const idElement = doc.createElement("Id");
            const othr = doc.createElement("Othr");
            othr.appendChild(this.createElementWithText(doc, "Id", id));
            idElement.appendChild(othr);
            dbtrAcct.appendChild(idElement);
            
            // Create Tp Element
            const tp = doc.createElement("Tp");
            tp.appendChild(this.createElementWithText(doc, "Prtry", type));
            dbtrAcct.appendChild(tp);
        
            return dbtrAcct; // Return the complete DbtrAcct element
        },

        createDbtrAgt: function(doc, bicfi) {
            const dbtrAgt = doc.createElement("DbtrAgt");
        
            // Create FinInstnId Element
            const finInstnId = doc.createElement("FinInstnId");
            finInstnId.appendChild(this.createElementWithText(doc, "BICFI", bicfi));
            
            dbtrAgt.appendChild(finInstnId);
            return dbtrAgt; // Return the complete DbtrAgt element
        },

        createCdtrAgt: function(doc, bicfi, mmbId, country) {
            const cdtrAgt = doc.createElement("CdtrAgt");
        
            // Create FinInstnId Element
            const finInstnId = doc.createElement("FinInstnId");
            finInstnId.appendChild(this.createElementWithText(doc, "BICFI", bicfi));
        
            // Create ClrSysMmbId Element
            const clrSysMmbId = doc.createElement("ClrSysMmbId");
            clrSysMmbId.appendChild(this.createElementWithText(doc, "MmbId", mmbId));
            finInstnId.appendChild(clrSysMmbId);
            
            // Create PstlAdr Element
            const pstlAdr = doc.createElement("PstlAdr");
            pstlAdr.appendChild(this.createElementWithText(doc, "Ctry", country));
            finInstnId.appendChild(pstlAdr);
        
            cdtrAgt.appendChild(finInstnId);
            return cdtrAgt; // Return the complete CdtrAgt element
        },

        createCdtr: function(doc, name, street, town, country, adrLines, orgId) {
            const cdtr = doc.createElement("Cdtr");
        
            // Create Name Element
            cdtr.appendChild(this.createElementWithText(doc, "Nm", name));
        
            // Create PstlAdr Element
            const pstlAdr = doc.createElement("PstlAdr");
            pstlAdr.appendChild(this.createElementWithText(doc, "StrtNm", street));
            pstlAdr.appendChild(this.createElementWithText(doc, "TwnNm", town));
            pstlAdr.appendChild(this.createElementWithText(doc, "Ctry", country));
            
            adrLines.forEach(line => {
                pstlAdr.appendChild(this.createElementWithText(doc, "AdrLine", line));
            });
        
            cdtr.appendChild(pstlAdr);
            
            // Create Id Element
            const id = doc.createElement("Id");
            const orgIdElement = doc.createElement("OrgId");
            
            const othr = doc.createElement("Othr");
            othr.appendChild(this.createElementWithText(doc, "Id", orgId));
            orgIdElement.appendChild(othr);
            
            id.appendChild(orgIdElement);
            cdtr.appendChild(id);
        
            return cdtr; // Return the complete Cdtr element
        },

        createCdtrAcct: function(doc, accountId, accountType) {
            const cdtrAcct = doc.createElement("CdtrAcct");
        
            // Create Id Element
            const id = doc.createElement("Id");
            const othr = doc.createElement("Othr");
            othr.appendChild(this.createElementWithText(doc, "Id", accountId));
            id.appendChild(othr);
            cdtrAcct.appendChild(id);
        
            // Create Tp Element
            const tp = doc.createElement("Tp");
            tp.appendChild(this.createElementWithText(doc, "Cd", accountType));
            cdtrAcct.appendChild(tp);
        
            return cdtrAcct; // Return the complete CdtrAcct element
        },

        createInstrForNxtAgt: function(doc, instruction) {
            const instrForNxtAgt = doc.createElement("InstrForNxtAgt");
            instrForNxtAgt.appendChild(this.createElementWithText(doc, "InstrInf", instruction));
            return instrForNxtAgt; // Return the complete InstrForNxtAgt element
        },
        
        createRmtInf: function(doc, creditorReference, additionalInfo) {
            const rmtInf = doc.createElement("RmtInf");
            const strd = doc.createElement("Strd");
            
            const cdtrRefInf = doc.createElement("CdtrRefInf");
            const tp = doc.createElement("Tp");
            const cdOrPrtry = doc.createElement("CdOrPrtry");
            
            cdOrPrtry.appendChild(this.createElementWithText(doc, "Prtry", creditorReference));
            tp.appendChild(cdOrPrtry);
            cdtrRefInf.appendChild(tp);
            strd.appendChild(cdtrRefInf);
            
            strd.appendChild(this.createElementWithText(doc, "AddtlRmtInf", additionalInfo));
            rmtInf.appendChild(strd);
        
            return rmtInf; // Return the complete RmtInf element
        }
    };
});