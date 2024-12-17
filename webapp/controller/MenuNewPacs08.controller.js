sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/m/MessageToast",
  "zbsp/bz/zbspcreatetransfer/utils/XmlHelper"
], function (Controller, JSONModel, Filter, MessageToast, XmlHelper) {
  "use strict";

  return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewPacs08", {
    onInit: function () {
      var oDataForm = {
        amount: "123",
        chargeType:"BEN",
        currency:"USD",
        description:"Info Test",
        orderAddress:"Belize",
        partnerAccount:"2110006054",
        partnerIdNumber:"4000053",
        partnerName:"BELIZE CITY COUNCIL",
        recipientAccountId:"20099884389",
        recipientAddress:"Honduras",
        recipientName:"Marvin",
        transactionReference:"ref12345"
      };
      var oDataFormModel = new JSONModel(oDataForm);
      this.getView().setModel(oDataFormModel, "formData");
    },

    _handlePartnerValueHelp: function (oEvent) {
      //  const sInputValue = oEvent.getSource().getValue();

      this.inputId = oEvent.getSource().getId();
      // create value help dialog
      if (!this._partnerHelpDialog) {
        this._partnerHelpDialog = sap.ui.xmlfragment(
          "zbsp.bz.zbspcreatetransfer.view.SelectPartnerDialog", this);
        this.getView().addDependent(this._partnerHelpDialog);
      }
      // open value help dialog filtered by the input value
      this._partnerHelpDialog.open();
    },

    _handlePartnerValueHelpSearch: function (evt) {

      var searchType = sap.ui.getCore().byId("idTypeSelect").getSelectedKey();
      var oBinding = sap.ui.getCore().byId("partnerList").getBinding("items");
      if (searchType == "1") {

        var oFilter1 = new Filter("ID", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("searchFieldInput").getValue());
        oBinding.filter([oFilter1]);

      } else {
        var oFilter1 = new Filter("Name", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("searchFieldInput").getValue());
        oBinding.filter([oFilter1]);
      }

    },

    _handlePartnerSelectionChange: function (evt) {

      const oSelectedItem = evt.getParameter("listItem");
      if (oSelectedItem) {
        this.getView().byId(this.inputId).setValue(oSelectedItem.getTitle());
        this.getView().byId("partnerNameInput").setText(oSelectedItem.getDescription());
        this._partnerHelpDialog.close();
      }
      sap.ui.getCore().byId("partnerList").removeSelections(true);
    },
    _handleAccountValueHelp: function (oEvent) {
      var sInputValue = this.getView().byId("partnerIdInput").getValue(); //oEvent.getSource().getValue();
      this.inputId = oEvent.getSource().getId();
      // create value help dialog
      if (!this._valueHelpDialog) {
        this._valueHelpDialog = sap.ui.xmlfragment("zbsp.bz.zbspcreatetransfer.view.SelectAccountDialog", this);
        this.getView().addDependent(this._valueHelpDialog);
      }
      // create a filter for the binding
      this._valueHelpDialog.getBinding("items").filter(
        [new Filter("AccountHolderID",
          sap.ui.model.FilterOperator.EQ,
          sInputValue)]);
      // open value help dialog filtered by the input value
      this._valueHelpDialog.open();
    },
    _handleAccountValueHelpClose: function (evt) {
      var oSelectedItem = evt.getParameter("selectedItem");
      var sDescription = "";
      if (oSelectedItem) {
        var productInput = this.getView().byId(this.inputId);
        //oText = this.getView().byId('selectedKey');
        sDescription = oSelectedItem.getDescription();
        productInput.setValue(oSelectedItem.getTitle());
        //oText.setText(sDescription);
        this.getView().byId("currencyBox").setSelectedKey(sDescription.substring(0, 3));
      }
      evt.getSource().getBinding("items").filter([]);
    },
    _handlePartnerValueHelpClose: function (evt) {
      sap.ui.getCore().byId("partnerList").removeSelections(true);
      this._partnerHelpDialog.close();
    },
    handleCountyValueHelp: function (oEvent) {
      this.inputId = "";
      if (oEvent) {
        this.inputId = oEvent.getSource().getId();
      }
      // create value help dialog
      if (!this._valueHelpDialog3) {
        this._valueHelpDialog3 = sap.ui.xmlfragment(
          "zbsp.bz.zbspcreatetransfer.view.SelectCountry3",
          this
        );
        this.getView().addDependent(this._valueHelpDialog3);
      }

      // open value help dialog filtered by the input value
      this._valueHelpDialog3.open();
    },
    handleSelectContryValueHelp: function (oEvent) {
      var oTable = null;
      var oIndices = null;

      console.log('entre al select');
      oTable = sap.ui.getCore().byId("treeTableContry3");

      oIndices = oTable.getSelectedIndices();
      if (oIndices.length > 0) {
        var oObject = oTable.getContextByIndex(oIndices[0]).getObject();
        console.log(oObject.landx);
        this.getView().byId("beneCountyInput").setValue(oObject.land1);
        this._valueHelpDialog3.close();

      }
    },
    handleCloseContryValueHelp: function (oEvent) {
      this._valueHelpDialog3.close();

    },

    handleSave: function () {
      debugger;
      let oDataForm = this.getView().getModel("formData").getData();
      oDataForm.typeCode = 'RTGS';
      oDataForm.IntermediaryBankKey = this.getVIew().getModel().getProperty("/IntermediaryBankKey");
      let oPostObject = {
        "Id": `${Date.now()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        "Uuid": crypto.randomUUID(),
        "SenderBusinessSystemId": "FIORI",
        "RecipientBusinessSystemId": "PE",
        "ContentTypeCode": "BAPE_IN_PAYMREQ_FIORI"
      };

      var xmlString = XmlHelper.createPaymentRequestXML(oDataForm);
      console.log(xmlString);
    }
  });
});
