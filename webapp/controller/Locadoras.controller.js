sap.ui.define([
    './BaseController',
    '../model/formatter',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/m/MessageBox',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, formatter, Export, ExportTypeCSV, MessageBox, Filter, FilterOperator) {
    "use strict";
    return BaseController.extend("project.frotasapp.controller.Locadoras", {
        formatter: formatter,

        onInit: function () {

        },

        onLocadoraFilter: function (oEvent) {

            var sQuery = oEvent.getSource().getValue();
            var oFilter = new Filter({
                filters: [
                    new Filter("Nome", FilterOperator.Contains, sQuery),
                    new Filter("CNPJ", FilterOperator.Contains, sQuery)
                ],
                and: false
            });

            // filter binding
            var oTable = this.getView().byId("locadoraTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter);
        },

        onDataExport: function (oEvent) {

            var oExport = new Export({

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ";"
                }),

                // Pass in the model created above
                models: this.getModel("locadoras"),

                // binding information for the rows aggregation
                rows: {
                    path: "/"
                },

                // column definitions with column name and binding info for the content

                columns: [{
                    name: "Id",
                    template: {
                        content: "{Id}"
                    }
                }, {
                    name: "Nome",
                    template: {
                        content: "{Nome}"
                    }
                }, {
                    name: "CNPJ",
                    template: {
                        content: "{CNPJ}"
                    }
                }]
            });

            // download exported file
            oExport.saveFile("Locadoras").catch(function (oError) {
                MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
            }).then(function () {
                oExport.destroy();
            });
        }
    });
});