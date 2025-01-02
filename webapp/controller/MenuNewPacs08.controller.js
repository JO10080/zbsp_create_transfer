sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/m/MessageToast",
  "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
  "sap/ui/core/Fragment",
  "sap/ui/model/FilterOperator",
  "zbsp/bz/zbspcreatetransfer/utils/XmlHelper"
], function (Controller, JSONModel, Filter, MessageToast, ValueHelpDialog, Fragment, FilterOperator, XmlHelper) {
  "use strict";

  return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewPacs08", {
    onInit: function () {
      var oDataForm = {
        ordering:{
          transactionReference: "ref12345",
          partnerAccount: "2110006054",
          amount: "123",
          currency: "USD",
          fileAmount: "12345",
          fileCurrency: "Euro europeo",
          chargeType: "BEN",
        },
        recipient:{
          recipientName: "Marvin",
          recipientAccountId: "20099884389",
          IntermediaryBankKey: "",
          Address:{
            DistrictName:"nom distrito", 
            TownName:"Nom Ciudad", 
            BuildingName:"Nom Edificio", 
            Building:"Edificio", 
            Street:"Calle",
            Country:""
          }
        },
        transactionChain:{
          AddendaInformation: "Addenda",
          TagAcc: "TagAcc",
          TagBnf: "TagBnf",
          TagRec: "TagRec",
        }
        
        
        
        //description: "Info Test",
        //orderAddress: "Belize",
        
        //partnerIdNumber: "4000053",
        //partnerName: "BELIZE CITY COUNCIL",
        
        //recipientAddress: "Honduras",
        
        
        
      };

      var oDataFormModel = new JSONModel(oDataForm);
      this.getView().setModel(oDataFormModel, "formData");

            // Crear el modelo de datos para la tabla
            // var oModel = new JSONModel({
            //   items: [
            //     { id: 1, name: "Pago Adicional 1", age: "30", selected: false },
            //     { id: 2, name: "Pago Adicional 2", age: "25", selected: false },
            //     { id: 3, name: "Pago Adicional 3", age: "40", selected: false }
            //   ],
            //   selectedItems: []
            // });
      
            // Asignar el modelo a la vista
            // this.getView().setModel(oModel);

      // Crear el modelo de datos para la tabla
      // var oModel = new JSONModel({
      //   items: [
      //     { id: 1, name: "Pago Adicional 1", age: "30", selected: false },
      //     { id: 2, name: "Pago Adicional 2", age: "25", selected: false },
      //     { id: 3, name: "Pago Adicional 3", age: "40", selected: false }
      //   ],
      //   selectedItems: []
      // });

      // Asignar el modelo a la vista
      // this.getView().setModel(oModel);


  // Obtener el enrutador
  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 
  // Registrar el evento routeMatched
  oRouter.attachRouteMatched(this.onRouteMatched, this);


    },
// Controlador del evento routeMatched
onRouteMatched: function (oEvent) {
  var sRouteName = oEvent.getParameter("name"); // Nombre de la ruta

           
  if (sRouteName === "RouteMenuNewPacs08") {
    this.getView().getModel("formData").setProperty("/typeCode", 'RTGS');
} else if (sRouteName === "RouteMenuNewPacs09") {
  this.getView().getModel("formData").setProperty("/typeCode", 'RTGS9');
}
  
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
    
      oDataForm.recipient.IntermediaryBankKey = this.getView().byId("recipientBank1Input").getValue();
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
        success: this._successResponse.bind(this),

        // function (oData, response) {
        //   sap.m.MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("saveSuccessMessage",
        //      [oData ? oData.ContentText : '']), {
        //     title: this.getView().getModel("i18n").getResourceBundle().getText("successTitle"),
        //     onClose: function () {
        //       console.log("El usuario cerró el cuadro de diálogo de éxito.");
        //     }
        //   });
        // }.bind(this),
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

      
        // Inicializa el modelo con datos predeterminados
        var oData = {
            formData: {
                cbbPermit: "",   // Código del permiso
                permitNo: "",
                amount: "",
                approvalDate: ""
            },
            tableData: [] // Datos de la tabla
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
    },

    // Evento cuando cambia el valor del código en el input
    onCodeChange: function (oEvent) {
        var sValue = oEvent.getSource().getValue();
        var oTable = this.byId("dataTable");

        // Si el valor del código no está vacío, mostrar la tabla
        if (sValue && sValue.trim() !== "") {
            oTable.setVisible(true); // Hacer visible la tabla
            this.byId("button3").setVisible(true); // Hacer visible el botón Add Row
            this.byId("button4").setVisible(true); // Hacer visible el botón Save Data
            this.byId("button5").setVisible(true); // Hacer visible el botón Delete Row
        } else {
            oTable.setVisible(false); // Ocultar la tabla
            this.byId("button3").setVisible(false); // Ocultar botón Add Row
            this.byId("button4").setVisible(false); // Ocultar botón Save Data
            this.byId("button5").setVisible(false); // Ocultar botón Delete Row
        }

        // Actualiza el valor del código en el modelo
        var oModel = this.getView().getModel();
        oModel.setProperty("/formData/cbbPermit", sValue);
    },

    // Evento cuando se presiona el botón "Add Row"
    onAddRow: function () {
        var oModel = this.getView().getModel();
        var oTableData = oModel.getProperty("/tableData");

        // Agregar una nueva fila vacía a la tabla
        var oNewRow = {
            permitNo: "",
            amount: "",
            approvalDate: ""
        };

        oTableData.push(oNewRow);
        oModel.setProperty("/tableData", oTableData);
    },

    // Evento cuando se presiona el botón "Save Data"
    onSaveData: function () {
        var oModel = this.getView().getModel();
        var aData = oModel.getProperty("/tableData");

        // Lógica para guardar los datos (en este caso, mostramos un mensaje)
        MessageBox.success("Datos guardados correctamente!");
        console.log("Datos guardados: ", aData);
    },

    // Evento cuando se presiona el botón "Delete Selected Row"
    onDeleteRow: function () {
        var oTable = this.byId("dataTable");
        var oSelectedItem = oTable.getSelectedItem();

        if (oSelectedItem) {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/tableData");
            var iIndex = oTable.indexOfItem(oSelectedItem);

            // Eliminar la fila seleccionada
            oData.splice(iIndex, 1);
            oModel.setProperty("/tableData", oData);

            // Mostrar un mensaje de éxito
            MessageBox.success("Fila eliminada correctamente!");
        } else {
            MessageBox.warning("Por favor, seleccione una fila para eliminar.");
        }
    },

    // Evento cuando se cambia la selección en la tabla
    onSelectionChange: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("listItem");

        // Si hay una fila seleccionada, hacer visibles los botones
        this.byId("button3").setVisible(true); // Botón Add Row
        this.byId("button4").setVisible(true); // Botón Save Data
        this.byId("button5").setVisible(true); // Botón Delete Row

        // Lógica adicional si se necesita hacer algo con la fila seleccionada
        if (oSelectedItem) {
            // Realizar operaciones con la fila seleccionada si es necesario
        }
    },

    _successResponse: function (oData, response) {
       // Decodificar la cadena Base64
    var decodedString = atob(oData ? oData.ContentText : '');
    
    // Parsear el XML
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(decodedString, "text/xml");
    
    // Recuperar el tag <PO> dentro del tag <PaymentResponse>
    var poTag = xmlDoc.getElementsByTagName("PaymentResponse")[0].getElementsByTagName("PO")[0];
    var poContent = poTag ? poTag.textContent : '';

    // Mostrar el mensaje de éxito con el contenido del tag <PO>
    sap.m.MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("saveSuccessMessage",
      [poContent]), {
      title: this.getView().getModel("i18n").getResourceBundle().getText("successTitle")
    }); 
      
    },
   // Evento para abrir el ValueHelpDialog cuando se hace clic en el ícono de ayuda
   onPurposeValueHelp: function (oEvent) {
    var sInputValue = oEvent.getSource().getValue(),
      oView = this.getView();

    if (!this._pPurposeValueHelpDialog) {
      this._pPurposeValueHelpDialog = Fragment.load({
        id: oView.getId(),
        name: "zbsp.bz.zbspcreatetransfer.view.PurposeValueHelpDialog",
        controller: this
      }).then(function (oDialog) {
        oView.addDependent(oDialog);
        return oDialog;
      });
    }
    this._pPurposeValueHelpDialog.then(function(oDialog) {
      // Create a filter for the binding
     
    var oFilter = new Filter("CodeName", FilterOperator.Contains, sInputValue);
    var oFilter2 = new Filter("Code", FilterOperator.Contains, sInputValue);

    var oFilterFinal = new sap.ui.model.Filter({
      filters: [oFilter, oFilter2],
      and: false  // Establece que el filtro sea OR, no AND
  });


    oDialog.getBinding("items").filter([oFilterFinal]);
      // Open ValueHelpDialog filtered by the input's value
      oDialog.open(sInputValue);
    });
  },
  onPurposeValueHelpSearch: function (oEvent) {
    var sValue = oEvent.getParameter("value");
    var oFilter = new Filter("CodeName", FilterOperator.Contains, sValue);
    var oFilter2 = new Filter("Code", FilterOperator.Contains, sValue);

    var oFilterFinal = new sap.ui.model.Filter({
      filters: [oFilter, oFilter2],
      and: false  // Establece que el filtro sea OR, no AND
  });


    oEvent.getSource().getBinding("items").filter([oFilterFinal]);


  },

    
});
});
