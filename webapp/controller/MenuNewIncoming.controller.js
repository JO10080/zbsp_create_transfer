sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/ValueState",
    "sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Filter, ValueState, FilterOperator, MessageToast) {
	"use strict";

	return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewIncoming", {
        handleCountyValueHelp : function (oEvent) {
            this.inputId = "";
            if(oEvent){
                this.inputId = oEvent.getSource().getId();
            }
            // create value help dialog
                if (!this._valueHelpDialog3) {
                    this._valueHelpDialog3 = sap.ui.xmlfragment(
                        "zbsp.bz.zbspcreatetransfer.view.SelectCountry2",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog3);
                }
                
                // open value help dialog filtered by the input value
                this._valueHelpDialog3.open();
        },
        handleSelectContryValueHelp : function (oEvent) {
            var oTable = null;
            var oIndices = null;
            
            console.log('entre al select');
            oTable = sap.ui.getCore().byId("treeTableContry2");
                        
            oIndices = oTable.getSelectedIndices();
            if(oIndices.length > 0){
                 var oObject = oTable.getContextByIndex(oIndices[0]).getObject();
                 console.log(oObject.landx);
                 this.getView().byId("fxorigCountyInput").setValue(oObject.land1);
                 this._valueHelpDialog3.close();
                 
            }
        },
        handleCloseContryValueHelp : function (oEvent) {
            //this.getView().byId("treeTableContry").destroy(true);
            this._valueHelpDialog3.close();
   
           },
           handleItemTypeValueHelp : function (oEvent) {
            
            this.inputId = "";
            if(oEvent){
                this.inputId = oEvent.getSource().getId();
            }
            if (this.getTransactionType && this.getTransactionType() === "1") {
                // create value help dialog
                if (!this._valueHelpDialog1) {
                    this._valueHelpDialog1 = sap.ui.xmlfragment(
                        "zbsp.bz.zbspcreatetransfer.view.SelectItemTypeDialog1",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog1);
                }
                // open value help dialog filtered by the input value
                this._valueHelpDialog1.open();
            } else {
                // create value help dialog
                if (!this._valueHelpDialog2) {
                    this._valueHelpDialog2 = sap.ui.xmlfragment(
                        "zbsp.bz.zbspcreatetransfer.view.SelectItemTypeDialog2",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialog2);
                }
            
                // open value help dialog filtered by the input value
                this._valueHelpDialog2.open();
            }},
            //Codigo original
        //     if(this.getTransactionType() === "1"){
        //         // create value help dialog
        //         if (!this._valueHelpDialog1) {
        //             this._valueHelpDialog1 = sap.ui.xmlfragment(
        //                 "zbsp.bz.zbspcreatetransfer.view.SelectItemTypeDialog1",
        //                 this
        //             );
        //             this.getView().addDependent(this._valueHelpDialog1);
        //         }					
        //         // open value help dialog filtered by the input value
        //         this._valueHelpDialog1.open();
        //     }else{
        //         // create value help dialog
        //         if (!this._valueHelpDialog2) {
        //             this._valueHelpDialog2 = sap.ui.xmlfragment(
        //                 "zbsp.bz.zbspcreatetransfer.view.SelectItemTypeDialog2",
        //                 this
        //             );
        //             this.getView().addDependent(this._valueHelpDialog2);
        //         }
                
        //         // open value help dialog filtered by the input value
        //         this._valueHelpDialog2.open();
        //     }
        // },
        // handleSelectItemValueHelp : function (oEvent) {
        //     var oTable = null;
        //     var oIndices = null;
            
        //     oTable = sap.ui.getCore().byId("treeTable2");
                        
        //     oIndices = oTable.getSelectedIndices();
        //     if(oIndices.length > 0){
        //          var oObject = oTable.getContextByIndex(oIndices[0]).getObject();
        //          this.getView().byId("fxItemTypeCodeInput").setValue(oObject.NodeID);
        //          if(this.getTransactionType() === "1"){
        //              this._valueHelpDialog1.close();
        //          }else{
        //              this._valueHelpDialog2.close();
        //          }
        //     }
        // },
            //codigo original
        // handleSelectItemValueHelp : function (oEvent) {
        //     var oTable = null;
        //     var oIndices = null;
            
        //     oTable = sap.ui.getCore().byId("treeTable2");
                        
        //     oIndices = oTable.getSelectedIndices();
        //     if(oIndices.length > 0){
        //          var oObject = oTable.getContextByIndex(oIndices[0]).getObject();
        //          this.getView().byId("fxItemTypeCodeInput").setValue(oObject.NodeID);
        //          if(this.getTransactionType() === "1"){
        //              this._valueHelpDialog1.close();
        //          }else{
        //              this._valueHelpDialog2.close();
        //          }
        //     }
        // },
            //ORIGINAL
        // handleCloseItemValueHelp : function (oEvent) {
        //     if(this.getTransactionType() === "1"){
        //          this._valueHelpDialog1.close();
        //      }else{
        //          this._valueHelpDialog2.close();
        //     }		
        // },	

        handleCloseItemValueHelp: function(oEvent) {
            // Verificar que el método getTransactionType esté definido
            if (this.getTransactionType && this.getTransactionType() === "1") {
                this._valueHelpDialog1.close();
            } else {
                this._valueHelpDialog2.close();
            }
        },
        

        handleSelectItemValueHelp: function(oEvent) {
            var oTable = sap.ui.getCore().byId("treeTable2");
            var oIndices = oTable.getSelectedIndices();
        
            if (oIndices.length > 0) {
                var oObject = oTable.getContextByIndex(oIndices[0]).getObject();
                this.getView().byId("fxItemTypeCodeInput").setValue(oObject.NodeID);
        
                // Verifica si el método getTransactionType existe antes de llamarlo
                if (this.getTransactionType && this.getTransactionType() === "1") {
                    this._valueHelpDialog1.close();
                } else {
                    this._valueHelpDialog2.close();
                }
            }
        },
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
                this.getView().byId("partnerNameInput1").setText(oSelectedItem.getDescription());
                this._partnerHelpDialog.close();
                //this.getView().byId("orderNameInput").setValue(oSelectedItem.getDescription());	
                //this.getView().byId("orderAddressInput").setValue(oSelectedItem.getInfo());
            }
            sap.ui.getCore().byId("partnerList").removeSelections(true);
        },
        _handlePartnerValueHelpClose : function (evt) {
            sap.ui.getCore().byId("partnerList").removeSelections(true);
            this._partnerHelpDialog.close();
        },
        _handleAccountValueHelp : function(oEvent) {
            var sInputValue = this.getView().byId("partnerIdInput1").getValue(); //oEvent.getSource().getValue();
            
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
                //this.getView().byId("currencyBox").setSelectedKey(sDescription.substring(0, 3));
            }
            evt.getSource().getBinding("items").filter([]);
        },
        _handleAccountValueHelpSearch : function (evt) {
            var sValue = evt.getParameter("value");
            var sPartnerValue = this.getView().byId("partnerIdInput1").getValue();
            var oFilter1 = new Filter("AccountHolderID",sap.ui.model.FilterOperator.EQ, sPartnerValue);
            var oFilter2 = new Filter("AccountID",sap.ui.model.FilterOperator.EQ, sValue);
            evt.getSource().getBinding("items").filter([oFilter1,oFilter2]);
        },
        

    });
});