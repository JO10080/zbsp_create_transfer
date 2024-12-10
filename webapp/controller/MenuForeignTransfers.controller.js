sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
function (Controller,JSONModel) {
    "use strict";

    return Controller.extend("zbsp.bz.zbspcreatetransfer.controller.MenuForeignTransfers", {
        onInit: function () {

            var  aMenu = {ProductCollection: [
                {
                    "ProductId": "RouteMenuNewPacs08",
                    "Name": "FI to FI Customer Credit transfer – pacs.008"
                },
                {
                    "ProductId": "RouteMenuNewPacs09",
                    "Name": "Financial Institution Credit transfer – pacs.009"
                },
                {
                    "ProductId": "RouteMenuPaymentReturn",
                    "Name": "Payment Return - pacs.004"
                },
                {
                    "ProductId": "RouteMenuNewIncoming",
                    "Name": "Incoming FI to FI Customer Credit transfer"
                }


            ]};
            
            
			// set explored app's demo model on this sample
			var oModel = new JSONModel(aMenu);
			this.getView().setModel(oModel, "menu");




		},
       
   
            onSelect: function (oEvent) {
                // Obtener el producto seleccionado
                var oSelectedItem = oEvent.getParameter("item");
                var sSelectedProductId = oSelectedItem.getKey();
    
                // Mostrar un mensaje con el nombre del producto seleccionado
               // MessageToast.show("Selected Product: " + sSelectedProductName + " (ID: " + sSelectedProductId + ")");
                
                // Navegar a la vista ProductDetail, pasando el ProductId como parámetro
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(sSelectedProductId);
                    
               
            }
        }); 

});
