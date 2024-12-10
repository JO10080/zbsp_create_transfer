sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuNewTransactionChainTransfers", {

        onInit: function () {
            // Se puede inicializar el modelo JSON para los datos de ejemplo si es necesario
            var oModel = new JSONModel({
                ProductCollection: [
                    { Name: "Bank 1" },
                    { Name: "Bank 2" },
                    { Name: "Bank 3" }
                ]
            });

            this.getView().setModel(oModel);
        },

        // Función que se llama cuando se hace clic en el valor de ayuda de un campo
        onValueHelpRequest: function (oEvent) {
            var oSource = oEvent.getSource(); // El control Input que activó el evento
            var oBinding = oSource.getBinding("suggestionItems");
            var oModel = this.getView().getModel();

            // Muestra los elementos sugeridos basados en el modelo de datos
            oBinding.filter([]);
        },

        // Función que se llama en el evento 'liveChange' de los Inputs
        onInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            // Aquí se puede agregar la lógica para validar o actualizar el modelo según el cambio en el input
            console.log("Input change detected:", sValue);
        },

        // Función adicional de ejemplo para mostrar un mensaje
        showMessage: function (sMessage) {
            MessageToast.show(sMessage);
        },

        // Función para mostrar un cuadro de mensaje en caso de error
        showErrorMessage: function (sMessage) {
            MessageBox.error(sMessage, {
                title: "Error",
                actions: [MessageBox.Action.CLOSE]
            });
        },

        // Ejemplo de función de guardado (esto debe ser reemplazado con la lógica real para guardar datos)
        onSave: function () {
            // Aquí va la lógica para guardar datos
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            console.log("Guardando datos:", oData);
            this.showMessage("Datos guardados correctamente.");
        }
    });
});
