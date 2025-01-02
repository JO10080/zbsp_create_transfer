sap.ui.define([
], function () {
    "use strict";

    return {
        /**
         * Rounds the currency value to 2 digits
         *
         * @public
         * @param {string} sValue value to be formatted
         * @returns {string} formatted currency value with 2 digits
         */
        currencyValue : function (sValue) {
            if (!sValue) {
                return "";
            }

            return parseFloat(sValue).toFixed(2);
        },
        errorType: function (sValue) {
            //var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (sValue) {
                case "E":
                    return sap.ui.core.MessageType.Error;
                case "S":
                    return sap.ui.core.MessageType.Success;
                case "W":
                    return sap.ui.core.MessageType.Warning;
                default:
                    return sap.ui.core.MessageType.Error;
            }
        },
        errorTitle: function (sValue) {
            //var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (sValue) {
                case "E":
                    return "Error";
                case "S":
                    return "Success";
                case "W":
                    return "Warning";
                default:
                    return "Error";
            }
        }

    };

}
);