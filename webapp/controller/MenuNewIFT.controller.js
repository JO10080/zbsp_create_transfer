sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState",
    "zbsp/bz/zbspcreatetransfer/model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, 
  MessageBox, ValueState, formatter) {
	"use strict";

  // This method returns an array that contains all entries of the array aArray that are truthy (in the same order).
    // If all entries of aArray are truthy it is returned, otherwise a new array is returned.
    function fnArrayFilteredTruthy(aArray) {
      var aCopy = null;
      for (var i = 0; i < aArray.length; i++) {
        var oEntry = aArray[i];
        if (oEntry) {
          if (aCopy) {
            aCopy.push(oEntry);
          }
        } else if (!aCopy) {
          aCopy = aArray.slice(0, i);
        }
      }
      return aCopy || aArray;
    }



	return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewIFT", {
    formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      onInit : function () {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page is busy indication immediately so there is no break in
        // between the busy indication for loading the view's meta data
        var oViewModel = new JSONModel({
          busy : false,
          delay : 0,
          objectTypeName : "",
          objectType     : "",
          acctConfirmationError : this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("acctConfirmationRequired")
        });

        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onObjectMatched, this);

        this.getView().setModel(oViewModel, "detailView");

        this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

        this._aMandatoryInputFields  = this._getMandatoryInputFields();
        this._aMandatorySelectFields = this._getMandatorySelectFields();
        this._aInputFields           = this._aMandatoryInputFields.concat(this._getNonMandatoryInputFields());
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Event handler when the share by E-Mail button has been clicked
       * @public
       */
      onShareEmailPress : function () {
        var oViewModel = this.getModel("detailView");

        sap.m.URLHelper.triggerEmail(
          null,
          oViewModel.getProperty("/shareSendEmailSubject"),
          oViewModel.getProperty("/shareSendEmailMessage")
        );
      },
      onChequeNoSelect : function (oEvent) {
        var selected = oEvent.getParameter("selected");
        this.getView().byId("accountIdInput_ift").setVisible(!selected);
      },
      /**
       * Event handler when the share by E-Mail button has been clicked
       * @public
       */
      handleSave : function () {
        // Set busy indicator during view binding
        var oViewModel = this.getView().getModel("detailView");

        if (!this._checkAndMarkEmptyMandatoryFields() && !this._fieldWithErrorState()) {
          // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
          oViewModel.setProperty("/busy", true);
          var oEntry = { };
          oEntry.Id                   = "1";
          oEntry.TransactionTypeCode  = oViewModel.getProperty("/objectType");
          oEntry.Partner              = this.getView().byId("partnerIdInput_ift").getValue();
          
          oEntry.OrderName            = this.getView().byId("partnerNameInput_ift").getText(); // SE NECESITA
          oEntry.RecipientAccountId   = this.getView().byId("recipientAccountIdInput_ift").getValue(); // SE NECESITA
          oEntry.AccountId            = this.getView().byId("accountIdInput_ift").getValue();
          oEntry.Amount               = this.getView().byId("amountInput_ift").getValue();
          oEntry.Currency             = this.getView().byId("currencyBox_ift").getSelectedKey();
          
          oEntry.Description          = this.getView().byId("addendaInformationInput_ift").getValue();//agregado
          oEntry.BankCode             = this.getView().byId("destinationBankInput_ift").getValue();//agregado
          oEntry.RecipientName        = this.getView().byId("recipientNameInput_ift").getValue();
          oEntry.RecipientAddress     = this.getView().byId("recipientAddressInput_ift").getValue();
          //oEntry.CustomerValueDate    = this.getView().byId("customerValueDateInput").getDateValue();
          //oEntry.RecipientId          = this.getView().byId("recipientIdInput").getValue(); eliminado
          //oEntry.RecipientIdType      = this.getView().byId("recipientIdTypeBox").getSelectedKey(); eliminado
          if(oEntry.TransactionTypeCode!=="03"){
            oEntry.RecipientBankKey     = this.getView().byId("recipientBankBox_ift").getSelectedKey();
          }else{
            oEntry.RecipientBankKey     = this.getView().byId("recipientBankInput_ift").getValue();
          }

          oEntry.RecipientAccountId   = this.getView().byId("recipientAccountIdInput_ift").getValue();
          //oEntry.RecipientAccountType = this.getView().byId("recipientAccTypeBox").getSelectedKey(); eliminado



          this.getView().getModel().create("/PaymentOrderSet", oEntry, {
              success: function(oCreatedEntry) {              
                oViewModel.setProperty("/busy", false);
                if(oCreatedEntry.StatusCode==="ACSC"){
                   //this.handleMessageBoxOpen("Orden " + oCreatedEntry.Id + " creada exitosamente." , "information");
                   this.handleMessageBoxOpen("Order " + oCreatedEntry.Id + " in status " + oCreatedEntry.StatusName, "information");
                }else if(oCreatedEntry.StatusCode==="RCVD"){
                   this.handleMessageBoxOpen("Order " + oCreatedEntry.Id + " in status " + oCreatedEntry.StatusName, "information");                	
                }else{
                	this.handleMessageBoxOpen("Order " + oCreatedEntry.Id + " in status " + oCreatedEntry.StatusName, "information");                	
                	this.handleMessageDialogOpen( oCreatedEntry.Id );
                }
                  
              }.bind(this), 
              error: function(oError) {             
                oViewModel.setProperty("/busy", false);
                //MessageToast.show("Error:" + oError.response.body);           
                    }
          });
        }
      },
      handleMessageDialogOpen: function ( sPaymentOrderId) {

        var filters     = [];
        var paymentOrderIdFilter  = new Filter("PaymentOrderId", FilterOperator.EQ, sPaymentOrderId);
        this._disableInputFields();
        if (!this._oMessageDialog) {
          this._oMessageDialog = sap.ui.xmlfragment("zbsp.bz.zbspcreatetransfer.view.MessagePopover", this);
          this._oMessageDialog.setModel(this.getView().getModel());
        }
        filters.push(paymentOrderIdFilter);
        this._oMessageDialog.getBinding("items").filter(filters);
        this._oMessageDialog.toggle(this.getView().byId("btnSave_ift"));
      },
      onMessagePopoverClose: function (oEvent) {
        //oViewModel.setProperty("/busy", false);
        this._clearInputFields();
        this.getRouter().navTo("master", {}, true);
      },
      handleCancel : function () {
        this._clearInputFields();
        this.getRouter().navTo("master", {}, true);
      },
      handleMessageBoxOpen : function (sMessage, sMessageBoxType) {
        MessageBox[sMessageBoxType](sMessage, {
          /*actions: [MessageBox.Action.YES, MessageBox.Action.NO],*/
          onClose: function (oAction) {
             this._clearInputFields();
             this.getRouter().navTo("master", {}, true);

          }.bind(this)
        });
      },
      /**
       * Event handler when the share in JAM button has been clicked
       * @public
       */
      onShareInJamPress : function () {
        var oViewModel = this.getView().getModel("detailView"),
          oShareDialog = sap.ui.getCore().createComponent({
            name : "sap.collaboration.components.fiori.sharing.dialog",
            settings : {
              object :{
                id : location.href,
                share : oViewModel.getProperty("/shareOnJamTitle")
              }
            }
          });

        oShareDialog.open();
      },
      onNumberChange: function(oEvent) {
        // If a number field is empty, an error occurs in the backend.
        // So this sets a missing number to "0".
        var oField = oEvent.getSource(),
          sNumber = oField.getValue();
        if (sNumber === "") {
          oField.setValue("0");
        }
        this._fieldChange(oField);
      },

      onInputChange: function(oEvent) {
        // Whenever the value of an input field is changed, the system must
        // update the product draft. For most of the fields, no specific
        // processing is required on the update of the product draft. onInputChange is the
        // change event defined in the XML view for such fields.
        var oField = oEvent.getSource();
        // Workaround to ensure that both the supplier Id and Name are updated in the model before the
        // draft is updated, otherwise only the Supplier Name is saved to the draft and Supplier Id is lost
        setTimeout(function() {
          this._fieldChange(oField);
        }.bind(this), 0);
      },
      /**
       * Updates the item count within the line item table's header
       * @param {object} oEvent an event containing the total number of items in the list
       * @private
       */
      onListUpdateFinished : function (oEvent) {
        var sTitle,
          iTotalItems = oEvent.getParameter("total"),
          oViewModel = this.getView().getModel("detailView");

        // only update the counter if the length is final
        if (this.byId("lineItemsList_ift").getBinding("items").isLengthFinal()) {
          if (iTotalItems) {
            sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
          } else {
            //Display 'Line Items' instead of 'Line items (0)'
            sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
          }
          oViewModel.setProperty("/lineItemListTitle", sTitle);
        }
      },

      /* =========================================================== */
      /* begin: internal methods                                     */
      /* =========================================================== */




      /**
       * Binds the view to the object path and expands the aggregated line items.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */
      _onObjectMatched : function (oEvent) {

        var sTransferType     = oEvent.getParameter("arguments").transType;

        sTransferType = sTransferType ? sTransferType : "01";

        var oViewModel = this.getView().getModel("detailView");

        this.getView().getModel().read("/TransactionTypeSet('" + sTransferType +"')", {
            success: function (oData) {

              oViewModel.setProperty("/objectTypeName", oData.Name);
              oViewModel.setProperty("/objectType", sTransferType);

            }
        });


        oViewModel.setProperty("/objectType" , sTransferType);

        var sObjectPath = this.getView().getModel().createKey("PaymentOrderSet", {
          Id : "1"
        });
        this._bindView("/" + sObjectPath);

        this._aMandatoryInputFields = this._getMandatoryInputFields();

      },
      _fieldChange: function(oControl) {

        // Removes previous error state
        oControl.setValueState(ValueState.None);

        /*// Callback function in the event that saving draft is unsuccessful
        var fnSubmitDraftSuccess = function(sMessage) {
          if (sMessage && oControl) {
            oControl.setValueState("Error");
            oControl.setValueStateText(sMessage);
          }
        };
        this._oHelper.saveProductDraft(fnSubmitDraftSuccess);*/
      },


      /**
       * Binds the view to the object path. Makes sure that detail view displays
       * a busy indicator while data for the corresponding element binding is loaded.
       * @function
       * @param {string} sObjectPath path to the object to be bound to the view.
       * @private
       */
      _bindView : function (sObjectPath) {
        // Set busy indicator during view binding
        var oViewModel = this.getView().getModel("detailView");

        // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
        oViewModel.setProperty("/busy", false);

        this.getView().bindElement({
          path : sObjectPath,
          events: {
            change : this._onBindingChange.bind(this),
            dataRequested : function () {
              oViewModel.setProperty("/busy", true);
            },
            dataReceived: function (oData) {
              oViewModel.setProperty("/busy", false);
            }
          }
        });
      },

      _onBindingChange : function () {
        return;
        var oView = this.getView(),
          oElementBinding = oView.getElementBinding();

        // No data for the binding
        if (!oElementBinding.getBoundContext()) {
          this.getRouter().getTargets().display("detailObjectNotFound");
          // if object could not be found, the selection in the master list
          // does not make sense anymore.
          this.getOwnerComponent().oListSelector.clearMasterListSelection();
          return;
        }

        var sPath = oElementBinding.getPath(),
          oResourceBundle = this.getResourceBundle(),
          oObject     = oView.getView().getModel().getObject(sPath),
          sObjectId   = oObject.Id,
          sObjectName = oObject.Description,
          oViewModel  = this.getView().getModel("detailView");

        this.getOwnerComponent().oListSelector.selectAListItem(sPath);

        oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
        oViewModel.setProperty("/shareOnJamTitle", sObjectName);
        oViewModel.setProperty("/shareSendEmailSubject",
          oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
        oViewModel.setProperty("/shareSendEmailMessage",
          oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
      },

      _onMetadataLoaded : function () {

        // Store original busy indicator delay for the detail view
        var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
          oViewModel = this.getView().getModel("detailView");
          //oLineItemTable = this.byId("lineItemsList"),
          //iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

        // Make sure busy indicator is displayed immediately when
        // detail view is displayed for the first time
        oViewModel.setProperty("/delay", 0);
        oViewModel.setProperty("/lineItemTableDelay", 0);

        /*oLineItemTable.attachEventOnce("updateFinished", function() {
          // Restore original busy indicator delay for line item table
          oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
        });*/

        // Binding the view will set it to not busy - so the view is always busy if it is not bound
        oViewModel.setProperty("/busy", true);
        // Restore original busy indicator delay for the detail view
        //oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
      },
      _handleSelectDialogPress: function (oEvent) {
        if (!this._oDialog) {
          this._oDialog = sap.ui.xmlfragment("zbsp.bz.zbspcreatetransfer.view.SelectTypeDialog", this);
          this._oDialog.setModel(this.getView().getModel());
        }


        this._oDialog.getBinding("items").filter([]);
        this._oDialog.open();
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
      _handleIdTypeChanged : function (evt) {
      	/*
        if(sap.ui.getCore().byId("idTypeSelect").getSelectedKey()==="1"){
          sap.ui.getCore().byId("identificationTypeSelect").setVisible(false);
        }else{
          sap.ui.getCore().byId("identificationTypeSelect").setVisible(false);
        }
        */
      },
      _handlePartnerValueHelpClose : function (evt) {
        sap.ui.getCore().byId("partnerList").removeSelections(true);
        this._partnerHelpDialog.close();
      },
      _handlePartnerSelectionChange : function (evt) {

        var oSelectedItem = evt.getParameter("listItem");
        if (oSelectedItem) {
          this.getView().byId(this.inputId).setValue(oSelectedItem.getTitle());
          this.getView().byId("partnerNameInput_ift").setText(oSelectedItem.getDescription());
          this._partnerHelpDialog.close();
        }
        sap.ui.getCore().byId("partnerList").removeSelections(true);
      },
      
      _handleAccountValueHelp : function(oEvent) {
        var sInputValue = this.getView().byId("partnerIdInput_ift").getValue(); //oEvent.getSource().getValue();
          
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
          var acctInput = this.getView().byId(this.inputId);
            sDescription = oSelectedItem.getDescription();
          acctInput.setValue(oSelectedItem.getTitle());
          //this.getView().byId("currencyBox").setSelectedKey(sDescription.substring(0, 3));
          //alert(sDescription);
        }
        evt.getSource().getBinding("items").filter([]);
      },
      _handleAccountValueHelpSearch : function (evt) {
        var sValue = evt.getParameter("value");
        var sPartnerValue = this.getView().byId("partnerIdInput_ift").getValue();
        var oFilter1 = new Filter("AccountHolderID",sap.ui.model.FilterOperator.EQ, sPartnerValue);
        var oFilter2 = new Filter("AccountID",sap.ui.model.FilterOperator.EQ, sValue);
        evt.getSource().getBinding("items").filter([oFilter1,oFilter2]);
      },
      _fieldWithErrorState: function() {
        return this._aInputFields.some(function(input) {
          return (input.getValueState() === ValueState.Error);
        });
      },
      _getNonMandatoryInputFields: function() {
      	
        return fnArrayFilteredTruthy([
             this.byId("recipientAddressInput_ift"),
             //this.byId("confirmAccountInput"),
	         //this.byId("recipientIdInput")             
         ]);
      },
      _getMandatoryInputFields: function() {
      	//var oViewModel = this.getModel("detailView"),
      	//    oTrans = oViewModel.getProperty("/objectType");
		//if(oTrans === "01"){
	        return fnArrayFilteredTruthy([
    	      this.byId("partnerIdInput_ift"),
        	  this.byId("accountIdInput_ift"),
	          this.byId("amountInput_ift"),
    	      this.byId("currencyInput_ift"),
        	  this.byId("recipientNameInput_ift"),
        	  this.byId("addendaInformationInput_ift"),
        	  this.byId("destinationBankInput_ift"),
	          //this.byId("recipientIdInput"), se elimino el campo 
    	      this.byId("recipientAccountIdInput_ift"),
        	  this.byId("confirmAccountInput_ift"),
	          this.byId("recipientBankInput_ift")
    	      ]);
    	//}
      },
      _getMandatorySelectFields: function() {

        return fnArrayFilteredTruthy([
          this.byId("currencyBox_ift"),
          //this.byId("recipientIdTypeBox"),
          this.byId("recipientBankBox_ift"),
          //this.byId("recipientAccTypeBox"),
          ]);

      },
      // Set the empty mandatory fields to Value State Error
      // Return whether at least one mandatory field is still empty
      _checkAndMarkEmptyMandatoryFields: function() {
        var bErrors = false;

        var oViewModel = this.getView().getModel("detailView");
        this._aMandatoryInputFields  = this._getMandatoryInputFields();
        this._aMandatorySelectFields = this._getMandatorySelectFields();
        // Check that inputs are not empty or space.
        // This does not happen during data binding because this is only triggered by changes.
        // Note that this loop must not stop with the first found error, since for all mandatory fields the value state must be updated.
        jQuery.each(this._aMandatoryInputFields, function(i, input) {
          if (( !input.getValue() || input.getValue().trim() === "" ) && input.getVisible() ) {
            bErrors = true;
            input.setValueState(ValueState.Error);
          }else{
            input.setValueState(ValueState.None);
          }
        });
        jQuery.each(this._aMandatorySelectFields, function(i, selectBox) {
          if (( !selectBox.getSelectedKey() || selectBox.getSelectedKey().trim() === "" ) && selectBox.getVisible() ) {
            bErrors = true;
            selectBox.setValueState(ValueState.Error);
          }else{
            selectBox.setValueState(ValueState.None);
          }
        });

		/*
        if(this.getView().byId("confirmAccountInput").getValue()=== ""){
          oViewModel.setProperty("/acctConfirmationErrorText", this.getResourceBundle().getText("acctConfirmationRequired"));
        }else if(this.getView().byId("recipientAccountIdInput").getValue()!== ""){
           if(this.getView().byId("recipientAccountIdInput").getValue().trim()!==this.getView().byId("confirmAccountInput").getValue().trim()){
             oViewModel.setProperty("/acctConfirmationErrorText", this.getResourceBundle().getText("acctConfirmationError"));
             this.getView().byId("confirmAccountInput").setValueState(ValueState.Error);
           }else{
             this.getView().byId("confirmAccountInput").setValueState(ValueState.None);
           }           
        }
		*/

        return bErrors;
      },
      // Clear all input fields
      _clearInputFields: function() {
        this._aMandatorySelectFields = this._getMandatorySelectFields();
        jQuery.each(this._aInputFields, function(i, input) {
          input.setValue("");
          input.setValueState(ValueState.None);
          input.setEnabled(true);
        });
        jQuery.each(this._aMandatorySelectFields, function(i, inputBox) {
          inputBox.setSelectedKey("");
          inputBox.setValueState(ValueState.None);
          inputBox.setEnabled(true);
        });
        this.getView().byId("btnSave_ift").setEnabled(true);
        this.getView().byId("partnerNameInput_ift").setText("");
        //this.getView().byId("accountIdInput").setVisible(true);
        if (this._partnerHelpDialog) {
            this._partnerHelpDialog.destroy(true);
            this._partnerHelpDialog = null;
          }
          if (this._valueHelpDialog) {
            this._valueHelpDialog.destroy(true);
            this._valueHelpDialog = null;
          }
          if (this._oMessageDialog) {
            this._oMessageDialog.destroy(true);
            this._oMessageDialog = null;
          }
      },
      // Disable all input fields
      _disableInputFields: function() {
        this._aMandatorySelectFields = this._getMandatorySelectFields();
        jQuery.each(this._aInputFields, function(i, input) {
          input.setEnabled(false);
        });
        jQuery.each(this._aMandatorySelectFields, function(i, inputBox) {
          inputBox.setEnabled(false);
        });
        this.getView().byId("btnSave_ift").setEnabled(false);
      }

    });

});
 