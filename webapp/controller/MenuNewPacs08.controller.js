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
        chargeType: "BEN",
        currency: "USD",
        description: "Info Test",
        orderAddress: "Belize",
        partnerAccount: "2110006054",
        partnerIdNumber: "4000053",
        partnerName: "BELIZE CITY COUNCIL",
        recipientAccountId: "20099884389",
        recipientAddress: "Honduras",
        recipientName: "Marvin",
        transactionReference: "ref12345"
      };
      var oDataFormModel = new JSONModel(oDataForm);
      this.getView().setModel(oDataFormModel, "formData");

            // Crear el modelo de datos para la tabla
            var oModel = new JSONModel({
              items: [
                { id: 1, name: "Pago Adicional 1", age: "30", selected: false },
                { id: 2, name: "Pago Adicional 2", age: "25", selected: false },
                { id: 3, name: "Pago Adicional 3", age: "40", selected: false }
              ],
              selectedItems: []
            });
      
            // Asignar el modelo a la vista
            this.getView().setModel(oModel);

      // Crear el modelo de datos para la tabla
      var oModel = new JSONModel({
        items: [
          { id: 1, name: "Pago Adicional 1", age: "30", selected: false },
          { id: 2, name: "Pago Adicional 2", age: "25", selected: false },
          { id: 3, name: "Pago Adicional 3", age: "40", selected: false }
        ],
        selectedItems: []
      });

      // Asignar el modelo a la vista
      this.getView().setModel(oModel);

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

      oDataForm.IntermediaryBankKey = this.getView().byId("recipientBank1Input").getValue();
      var xmlString = XmlHelper.createPaymentRequestXML(oDataForm);
      console.log(xmlString);

      let oPostObject = {
        "Id": `${Date.now()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        "Uuid": crypto.randomUUID().replace(/-/g, '').substring(0, 16),
        // "Uuid": `${Date.now()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        "SenderBusinessSystemId": "FIORI",
        "RecipientBusinessSystemId": "PE",
        "ContentTypeCode": "BAPE_IN_PAYMREQ_FIORI",
        "ContentText": this._encodeXMLToBase64(xmlString)
      };


      // Obtener el modelo OData
      let oModel = this.getView().getModel("createPayment");

      // Llamada al endpoint OData para enviar los datos
      oModel.create("/FreeMessageResponseSet", oPostObject, {
        success: function (oData, response) {
          sap.m.MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("saveSuccessMessage", [oData ? oData.ContentText : '']), {
            title: this.getView().getModel("i18n").getResourceBundle().getText("successTitle"),
            onClose: function () {
              console.log("El usuario cerró el cuadro de diálogo de éxito.");
            }
          });
        }.bind(this),
        error: function (oError) {
          sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("saveErrorMessage"), {
            title: this.getView().getModel("i18n").getResourceBundle().getText("errorTitle"),
            details: oError.responseText // Detalles adicionales del error
          });
        }.bind(this)
      });
    },

    _encodeXMLToBase64: function(xmlContent) {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(xmlContent);
      const base64String = btoa(String.fromCharCode(...encodedData));
      return base64String;
  },


    // Este evento se dispara cuando se selecciona/deselecciona el checkbox "Seleccionar todo"
    onSelectAll: function(oEvent) {
      var bSelected = oEvent.getParameter("selected");
      var oModel = this.getView().getModel();
      var aItems = oModel.getProperty("/items");

      // Marcar o desmarcar todos los elementos
      aItems.forEach(function(oItem) {
        oItem.selected = bSelected;
      });

      // Actualizamos el modelo de selectedItems: si se seleccionan todos, agregamos todos los elementos, sino, los eliminamos
      if (bSelected) {
        oModel.setProperty("/selectedItems", aItems);
      } else {
        oModel.setProperty("/selectedItems", []);
      }

      // Actualizar el modelo
      oModel.refresh();
    },

    // Este evento se dispara cuando se selecciona/deselecciona un ítem individual
    onCheckboxSelect: function(oEvent) {
      var oModel = this.getView().getModel();
      var oItem = oEvent.getSource().getParent().getBindingContext().getObject();
      var aSelectedItems = oModel.getProperty("/selectedItems");

      // Si el checkbox se selecciona, agregar el ítem a selectedItems
      if (oEvent.getParameter("selected")) {
        aSelectedItems.push(oItem);
      } else {
        // Si se desmarca, quitar el ítem de selectedItems
        var iIndex = aSelectedItems.indexOf(oItem);
        if (iIndex !== -1) {
          aSelectedItems.splice(iIndex, 1);
        }
      }

      // Actualizamos el modelo de selectedItems
      oModel.setProperty("/selectedItems", aSelectedItems);
    },

    // Este evento se dispara cuando se hace clic en el botón "Eliminar"
    onDelete: function() {
      var oModel = this.getView().getModel();
      var aSelectedItems = oModel.getProperty("/selectedItems");

      // Filtramos los ítems que no están seleccionados
      var aItems = oModel.getProperty("/items").filter(function(oItem) {
        return !aSelectedItems.includes(oItem);
      });

      // Actualizamos la propiedad "items" con los ítems no eliminados
      oModel.setProperty("/items", aItems);

      // Limpiar los ítems seleccionados
      oModel.setProperty("/selectedItems", []);
    },

    // Este evento se dispara cuando se hace clic en el botón "Agregar"
    onAdd: function() {
      var oModel = this.getView().getModel();
      var aItems = oModel.getProperty("/items");
      var newItem = {
        id: aItems.length + 1,
        name: "Pago Adicional " + (aItems.length + 1),
        age: "35",
        selected: false
      };

      // Agregar el nuevo ítem
      aItems.push(newItem);

      // Actualizar el modelo
      oModel.setProperty("/items", aItems);
    },

    onCodeChange: function (oEvent) {
      var inputValue = oEvent.getParameter("newValue");

      // Llamar al backend ABAP para obtener los datos basados en el código ingresado
      if (inputValue === "001") {
        this.loadDataForCode(inputValue);
      } else {
        this.clearTable();
      }
    },

    loadDataForCode: function (code) {
      // Aquí se realiza la llamada al backend ABAP (simulada con datos de ejemplo)
      var data = [
        {
          permitNo: "P001",
          amount: "1000",
          approvalDate: "2024-12-19"
        },
        {
          permitNo: "P002",
          amount: "2000",
          approvalDate: "2024-12-20"
        }
      ];

      // Establecer los datos en el modelo
      var oModel = new JSONModel({
        items: data
      });

      // Asociar el modelo con la tabla
      this.getView().setModel(oModel, "tableData");

      // Hacer visible la tabla
      var oTable = this.byId("dataTable");
      oTable.setVisible(true);
    },

    clearTable: function () {
      // Limpiar los datos de la tabla
      var oTable = this.byId("dataTable");
      oTable.setVisible(false);
    }
	});
});
