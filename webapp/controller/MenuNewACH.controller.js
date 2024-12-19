sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/ValueState",
    "sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Filter, ValueState, FilterOperator, MessageToast) {
	"use strict";

	return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewACH", {
        //Original
        // _handlePartnerValueHelp : function(oEvent) {
        //     var sInputValue = oEvent.getSource().getValue();
    
        //     this.inputId = oEvent.getSource().getId();
        //     // create value help dialog
        //     if (!this._partnerHelpDialog) {
        //       this._partnerHelpDialog = sap.ui.xmlfragment(
        //           "zbsp.bz.zbspcreatetransfer.view.SelectPartnerDialog", this);
        //       this.getView().addDependent(this._partnerHelpDialog);
        //     }
        //     // open value help dialog filtered by the input value
        //     this._partnerHelpDialog.open();
        //   },

        _handlePartnerValueHelp : function(oEvent) {
          var sInputValue = oEvent.getSource().getValue();
  
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
          _handlePartnerValueHelpSearch : function (evt) {

            var searchType = sap.ui.getCore().byId("idTypeSelect").getSelectedKey();
            var oBinding = sap.ui.getCore().byId("partnerList").getBinding("items");
            if(searchType=="1"){
    
              //var oFilter1 = new Filter("IdentificationType"  , sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("identificationTypeSelect").getSelectedKey());
              //var oFilter2 = new Filter("IdentificationNumber", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("searchFieldInput").getValue());
              //oBinding.filter([oFilter1,oFilter2]);
              
              var oFilter1 = new Filter("ID", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("searchFieldInput").getValue());
              oBinding.filter([oFilter1]);
              
            }else{
              var oFilter1 = new Filter("Name", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("searchFieldInput").getValue());
              oBinding.filter([oFilter1]);
            }
    
          },
          _handlePartnerSelectionChange : function (evt) {

            var oSelectedItem = evt.getParameter("listItem");
            if (oSelectedItem) {
              this.getView().byId(this.inputId).setValue(oSelectedItem.getTitle());
              this.getView().byId("partnerNameInput_4").setText(oSelectedItem.getDescription());
              this._partnerHelpDialog.close();
            }
            sap.ui.getCore().byId("partnerList").removeSelections(true);
          },
          _handlePartnerValueHelpClose : function (evt) {
            sap.ui.getCore().byId("partnerList").removeSelections(true);
            this._partnerHelpDialog.close();
          },
          _handleAccountValueHelp : function(oEvent) {
            var sInputValue = this.getView().byId("partnerIdInput_4").getValue(); //oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();
            // create value help dialog
            if (!this._valueHelpDialog) {
                this._valueHelpDialog = sap.ui.xmlfragment("zbsp.bz.zbspcreatetransfer.view.SelectAccountDialog", this);
                this.getView().addDependent(this._valueHelpDialog);
            }
            // create a filter for the binding
            this._valueHelpDialog.getBinding("items").filter(
                    [ new Filter("AccountHolderID",
                            sap.ui.model.FilterOperator.EQ,
                            sInputValue) ]);
            // open value help dialog filtered by the input value
            this._valueHelpDialog.open( );
        },
        _handleAccountValueHelpClose : function (evt) {
            var oSelectedItem = evt.getParameter("selectedItem");
            var sDescription  = "";
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
        

    });
    });