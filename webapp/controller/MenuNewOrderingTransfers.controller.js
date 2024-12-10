sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewOrderingTransfers", {

		// Método de inicialización
		onInit: function () {
			// Crear un modelo de datos JSON vacío
			var oModel = new JSONModel({
				ProductCollection: [
					{ Name: "Product 1", Key: "1" },
					{ Name: "Product 2", Key: "2" },
					{ Name: "Product 3", Key: "3" }
				],
				date: new Date()
			});
			this.getView().setModel(oModel);
		},

		// Evento para el cambio de los valores en los campos de texto
		onInputChange: function (oEvent) {
			var sValue = oEvent.getParameter("newValue");
			// Puedes agregar lógica adicional para procesar el valor cambiado
			MessageToast.show("Valor cambiado: " + sValue);
		},

		// Evento para la solicitud de ayuda de valor (valueHelp) de los campos de entrada
		onValueHelpRequest: function (oEvent) {
			var oInput = oEvent.getSource();
			// Aquí puedes implementar la lógica para mostrar un valor de ayuda (help)
			MessageToast.show("Se pidió ayuda para: " + oInput.getId());
		},

		// Evento para cuando se selecciona una opción en el ComboBox
		onComboBoxSelect: function (oEvent) {
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			MessageToast.show("Opción seleccionada: " + sSelectedKey);
		},

		// Método adicional para manejar la lógica de los combos si es necesario
		onComboBoxChange: function (oEvent) {
			var sSelectedKey = oEvent.getParameter("selectedKey");
			// Puedes agregar lógica aquí si deseas realizar acciones específicas al seleccionar una opción
			MessageToast.show("Cambio en el ComboBox con Key: " + sSelectedKey);
		}

	});
});
