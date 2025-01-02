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
    MessageBox,  ValueState, formatter) {
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

	return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewIncoming", {
       
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
                defaultDate: new Date(),
                objectTypeName : "",
                objectType     : "",
                acctConfirmationError : this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("acctConfirmationRequired")

            });

            sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this._onObjectMatched, this);

            this.getView().setModel(oViewModel, "detailView");

            this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
            
            var myModel = this.getOwnerComponent().getModel();
            myModel.setSizeLimit(999);
            
            this._aMandatoryInputFields  = this._getMandatoryInputFields();
            this._aMandatorySelectFields = this._getMandatorySelectFields();
            this._aInputFields           = this._aMandatoryInputFields.concat(this._getNonMandatoryInputFields());
        },
        
        handleChange: function (oEvent) {
            var oText = this.byId("textResult");
            var oDP = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
            var bValid = oEvent.getParameter("valid");
            this._iEvent++;
            oText.setText("Change - Event " + this._iEvent + ": DatePicker " + oDP.getId() + ":" + sValue);
            if (bValid) {
                oDP.setValueState(sap.ui.core.ValueState.None);
            } else {
                oDP.setValueState(sap.ui.core.ValueState.Error);
            }
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
            this.getView().byId("accountIdInput").setVisible(!selected);
        },
        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        handleSave : function () {
            // Set busy indicator during view binding

            var oViewModel = this.getView().getModel("detailView");
            
            if (!this._checkAndMarkEmptyMandatoryFields() && !this._fieldWithErrorState()) {
                oViewModel.setProperty("/busy", true);	
                
                var oEntry = { };
                oEntry.Id                   = "1";	
                oEntry.TransactionTypeCode  = oViewModel.getProperty("/objectType");
                oEntry.Partner              = this.getView().byId("partnerIdInput_inc").getValue(); 
                //oEntry.PartnerName          = this.getView().byId("partnerNameInput").getText(); 
                //oEntry.AccountId            = this.getView().byId("accountIdInput").getValue(); 
                oEntry.AccountId            = this.getView().byId("partnerAccountIdInput_inc").getValue(); 
                oEntry.Amount               = this.getView().byId("amountInput_inc").getValue(); 
                oEntry.Currency             = this.getView().byId("currencyBox_inc").getSelectedKey();
                oEntry.Exchngrate           = "0"; 
                oEntry.Description          = this.getView().byId("descriptionInput_inc").getValue(); 
                //oEntry.Description4         = this.getView().byId("description4Input").getValue(); 
                oEntry.RecipientName        = this.getView().byId("orderNameInput_inc").getValue(); 
                oEntry.RecipientAddress     = this.getView().byId("partnerAddressInput_inc").getValue(); 
                oEntry.RecipientAddress2    = "";
                oEntry.RecipientAddress3    = "";
                oEntry.RecipientAddress4    = "";
                oEntry.RecipientBankKey     = this.getView().byId("orderBic_inc").getValue();
                oEntry.RecipientAccountId   = this.getView().byId("accountIdInput_inc").getValue();
                oEntry.FXTransType          = this.getView().byId("fxItemTypeCodeInput_inc").getValue();
                oEntry.ExternalReference    = this.getView().byId("transactionReferenceInput_inc").getValue(); 
                oEntry.SymCuenta            = this.getView().byId("symCuentaBox_inc").getSelectedKey(); 
                oEntry.IntermediaryBankKey  = this.getView().byId("intermediaryBankInput_inc").getValue(); 
                oEntry.InstituteAccount     = "";
                oEntry.InstituteName        = this.getView().byId("instituteNameInput_inc").getValue(); 
                oEntry.InstituteAddr1       = "";
                
                oEntry.OrderName        = this.getView().byId("partnerNameInput_inc").getText();  
                oEntry.OrderAddress     = this.getView().byId("orderAddressInput_inc").getValue();
                
                //Agregado OrigCountry
                oEntry.OrigCountry     = this.getView().byId("fxorigCountyInput_inc").getValue(); //this.getView().byId("origCountyInput").getValue();
                
                console.log(oEntry);
                this.getView().getModel().create("/PaymentOrderSet", oEntry, {
                      success: function(oCreatedEntry) {						  
                          oViewModel.setProperty("/busy", false);
                          if(oCreatedEntry.StatusCode === "ACSC"){
                             //this.handleMessageBoxOpen("Orden " + oCreatedEntry.Id + " creada exitosamente." , "information");
                             this.handleMessageBoxOpen("Order " + oCreatedEntry.Id + " in status " + oCreatedEntry.StatusName, "information");
                          }else if(oCreatedEntry.StatusCode === "RCVD"){
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
        handleCancel : function () {
            this._clearInputFields();
            this.getRouter().navTo("master", {}, true);
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
            this._oMessageDialog.toggle(this.getView().byId("btnSave_inc"));
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
            var oViewModel = this.getModel("detailView"),
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
            // Inicio Msegura
            //if (oField === "partnerIdInput") {
            //	//var oValue = this.getView().byId("PartnerName").getValue();
            //	var oField1 = 
            //	oValue = oField.getValue();
            //	this.getView().byId("OrderNameInput").setValue(oValue);
            //}
            // Fin Msegura
            // Workaround to ensure that both the supplier Id and Name are updated in the model before the
            // draft is updated, otherwise only the Supplier Name is saved to the draft and Supplier Id is lost
            setTimeout(function() {
                this._fieldChange(oField);
            }.bind(this), 0);
        },
        onOrderNameChange: function() {
            //var oValue = sap.ui.getCore().byId("PartnerName").getValue();
            //var oValue = this.getView().byId("PartnerNameInput").getValue();
            //this.getView().byId("OrderNameInput").setValue(oValue);
        },			
        /**
         * Updates the item count within the line item table's header
         * @param {object} oEvent an event containing the total number of items in the list
         * @private
         */
        onListUpdateFinished : function (oEvent) {
            var sTitle,
                iTotalItems = oEvent.getParameter("total"),
                oViewModel = this.getModel("detailView");

            // only update the counter if the length is final
            if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
                if (iTotalItems) {
                    sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
                } else {
                    //Display 'Line Items' instead of 'Line items (0)'
                    sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
                }
                oViewModel.setProperty("/lineItemListTitle", sTitle);
            }
        },
        getTransactionType : function () {
            return "2";
        },
        
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
        
        
        handleItemTypeValueHelp : function (oEvent) {
            
            this.inputId = "";
            if(oEvent){
                this.inputId = oEvent.getSource().getId();
            }
            if(this.getTransactionType() === "1"){
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
            }else{
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
            }
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
                 this.getView().byId("fxorigCountyInput_inc").setValue(oObject.land1);
                 this._valueHelpDialog3.close();
                 
            }
        },
        
        handleSelectItemValueHelp : function (oEvent) {
            var oTable = null;
            var oIndices = null;
            
            oTable = sap.ui.getCore().byId("treeTable2");
                        
            oIndices = oTable.getSelectedIndices();
            if(oIndices.length > 0){
                 var oObject = oTable.getContextByIndex(oIndices[0]).getObject();
                 this.getView().byId("fxItemTypeCodeInput_inc").setValue(oObject.NodeID);
                 if(this.getTransactionType() === "1"){
                     this._valueHelpDialog1.close();
                 }else{
                     this._valueHelpDialog2.close();
                 }
            }
        },
        handleCloseItemValueHelp : function (oEvent) {
            if(this.getTransactionType() === "1"){
                 this._valueHelpDialog1.close();
             }else{
                 this._valueHelpDialog2.close();
            }		
        },			
        handleCloseContryValueHelp : function (oEvent) {
         //this.getView().byId("treeTableContry").destroy(true);
         this._valueHelpDialog3.close();

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
            sTransferType = sTransferType ? sTransferType : "07";

            var oViewModel = this.getView().getModel("detailView");
            
            this.getView().getModel().read("/TransactionTypeSet('" + sTransferType + "')", {
                success: function (oData) {		
                    
                    oViewModel.setProperty("/objectTypeName", oData.Name);	
                    oViewModel.setProperty("/objectType", sTransferType);
                    
                }
            });
        
            
            oViewModel.setProperty("/objectType", sTransferType );	
                            
            var sObjectPath = this.getView().getModel().createKey("PaymentOrderSet", {
                Id : "1"
            });
            this._bindView("/" + sObjectPath);
            //console.log(sObjectPath);
            
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
            this.getView().byId("controlForm_inc").bindElement({
                        path : sObjectPath
            });
            this.getView().byId("recipientForm_inc").bindElement({
                        path : sObjectPath
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
                this._oDialog.getView().setModel(this.getView().getModel());
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
        
        _handleValDateValueHelp : function(oEvent) {
            //Abre ayuda de calendario para seleccionar fecha
        },		
        
        _handleIdTypeChanged : function (evt) {
            if(sap.ui.getCore().byId("idTypeSelect").getSelectedKey() === "1"){
                sap.ui.getCore().byId("identificationTypeSelect").setVisible(true);
            }else{
                sap.ui.getCore().byId("identificationTypeSelect").setVisible(false);
            }
        },
        _handlePartnerValueHelpClose : function (evt) {
            sap.ui.getCore().byId("partnerList").removeSelections(true);
            this._partnerHelpDialog.close();
        },
        _handlePartnerSelectionChange : function (evt) {
            
            var oSelectedItem = evt.getParameter("listItem");
            if (oSelectedItem) {					
                this.getView().byId(this.inputId).setValue(oSelectedItem.getTitle());
                this.getView().byId("partnerNameInput_inc").setText(oSelectedItem.getDescription());
                this._partnerHelpDialog.close();
                //this.getView().byId("orderNameInput").setValue(oSelectedItem.getDescription());	
                //this.getView().byId("orderAddressInput").setValue(oSelectedItem.getInfo());
            }
            sap.ui.getCore().byId("partnerList").removeSelections(true);
        },
        _handleAccountValueHelp : function(oEvent) {
            var sInputValue = this.getView().byId("partnerIdInput_inc").getValue(); //oEvent.getSource().getValue();
            
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
            var sPartnerValue = this.getView().byId("partnerIdInput_inc").getValue();
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
                this.byId("intermediaryBankInput_inc"),
                this.byId("instituteNameInput_inc"),
                this.byId("instituteAddr1Input_inc"),
                this.byId("description4Input_inc"),
                this.byId("orderBic_inc"),
                this.byId("fxorigCountyInput_inc"),
                this.byId("transactionReferenceInput_inc")
             ]);
        },
        _getMandatoryInputFields: function() {
            
            return fnArrayFilteredTruthy([
                //Ordenante
                this.byId("transactionReferenceInput_inc"),
                this.byId("accountIdInput_inc"),
                this.byId("orderNameInput_inc"),
                this.byId("orderAddressInput_inc"),
                this.byId("orderBankNameInput_inc"),
                this.byId("orderBankAddressInput_inc"),
                this.byId("amountInput_inc"),
                this.byId("fxItemTypeCodeInput_inc"),
                //Recipiente
                this.byId("partnerIdInput_inc"),					
                //this.byId("partnerNameInput"),
                this.byId("partnerAccountIdInput_inc"),
                this.byId("partnerAddressInput_inc"),
                //Transacction Chain
                this.byId("clearingAggrementInput"),
                this.byId("intermediaryBic"),
                this.byId("descriptionInput_inc")			
                ]);				
            
        },
        _getMandatorySelectFields: function() {
            
            return fnArrayFilteredTruthy([
                this.byId("currencyBox"),
                this.byId("symCuentaBox"),
                this.byId("recipientAccTypeBox"),
                this.byId("chargeTypeBox")
                //this.byId("recipientBank1Input"),
                //this.byId("clearingAggrementInput"),
                //this.byId("intermediaryBankInput")
                ]);				
            
        },
        _getCheckboxFields: function() {
            return fnArrayFilteredTruthy([
                this.byId("invEsp")
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
            
            /*if(this.getView().byId("confirmAccountInput").getValue() === ""){
                oViewModel.setProperty("/acctConfirmationErrorText", this.getResourceBundle().getText("acctConfirmationRequired"));	
            }else if(this.getView().byId("recipientAccountIdInput").getValue() !== ""){
               if(this.getView().byId("recipientAccountIdInput").getValue().trim() !== this.getView().byId("confirmAccountInput").getValue().trim()){
                   oViewModel.setProperty("/acctConfirmationErrorText", this.getResourceBundle().getText("acctConfirmationError"));
                   this.getView().byId("confirmAccountInput").setValueState(ValueState.Error);
               }else{
                   this.getView().byId("confirmAccountInput").setValueState(ValueState.None);
               }				   
            }
            
            if(this.getView().byId("recipientAddress2Input").getValue() === ""){					
                this.getView().byId("recipientAddress2Input").setValueState(ValueState.Warning);
            }else{					
                this.getView().byId("recipientAddress2Input").setValueState(ValueState.None);
            }
            if(this.getView().byId("recipientAddress3Input").getValue() === ""){
                this.getView().byId("recipientAddress3Input").setValueState(ValueState.Warning);
            }else{
                this.getView().byId("recipientAddress3Input").setValueState(ValueState.None);
            }
            if(this.getView().byId("recipientAddress4Input").getValue() === ""){
                this.getView().byId("recipientAddress4Input").setValueState(ValueState.Warning);
            }else{
                this.getView().byId("recipientAddress4Input").setValueState(ValueState.None);
            }
            
            return bErrors;*/
        },
        
        // Clear all input fields
        //Falta de modificar
        _clearInputFields: function() {	
            
            this._aCheckboxFields = this._getCheckboxFields();
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
            
            jQuery.each(this._aCheckboxFields, function(i, inputCBox) {
                inputCBox.setSelected(false);
                inputCBox.setValueState(ValueState.None);
                inputCBox.setEnabled(true);
                //$(inputCBox).prop("selected", false);
            });				
            
            this.getView().byId("btnSave_inc").setEnabled(true);					
            this.getView().byId("partnerNameInput_inc").setText("");
            
            if (this._partnerHelpDialog) {
                this._partnerHelpDialog.destroy(true);
                this._partnerHelpDialog = null;
            }
            if (this._oMessageDialog) {
                this._oMessageDialog.destroy(true);
                this._oMessageDialog = null;
            }
            if (this._valueHelpDialog) {
                this._valueHelpDialog.destroy(true);
                this._valueHelpDialog = null;
            }
            if (this._valueHelpDialog1) {
                this._valueHelpDialog1.destroy(true);
                this._valueHelpDialog1 = null;
            }			    
            if (this._valueHelpDialog2) {
                this._valueHelpDialog2.destroy(true);
                this._valueHelpDialog2 = null;
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
            this.getView().byId("btnSave_inc").setEnabled(false);
        }

    });

}
);