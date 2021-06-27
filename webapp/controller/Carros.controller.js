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
    return BaseController.extend("project.frotasapp.controller.Carros", {
        formatter: formatter,

        onInit: function () {
            this.getRoute("carros").attachMatched(this.onRouteMatched.bind(this));
        },

        onRouteMatched: function (oEvent) {
        },

        onCarsFilter: function (oEvent) {

            var sQuery = oEvent.getSource().getValue();
            var oFilter = new Filter({
                filters: [
                    new Filter("Marca", FilterOperator.Contains, sQuery),
                    new Filter("Modelo", FilterOperator.Contains, sQuery),
                    new Filter("Placa", FilterOperator.Contains, sQuery),
                    new Filter("Chassi", FilterOperator.Contains, sQuery),
                    new Filter("Renavam", FilterOperator.Contains, sQuery)
                ],
                and: false
            });

            // filter binding
            var oTable = this.getView().byId("carroTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter);
        },

        onDataExport: function (oEvent) {

            var oExport = new Export({
                fileName: "Carros",

                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new ExportTypeCSV({
                    separatorChar: ";"
                }),

                // Pass in the model created above
                models: this.getModel("carros"),

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
                    name: "Marca",
                    template: {
                        content: "{Marca}"
                    }
                }, {
                    name: "Modelo",
                    template: {
                        content: "{Modelo}"
                    }
                }, {
                    name: "Placa",
                    template: {
                        content: "{Placa}"
                    }
                }, {
                    name: "Chassi",
                    template: {
                        content: "{Chassi}"
                    }
                }, {
                    name: "Renavam",
                    template: {
                        content: "{Renavam}"
                    }
                }]
            });

            // download exported file
            oExport.saveFile("Carros").catch(function (oError) {
                MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
            }).then(function () {
                oExport.destroy();
            });
        }
    });
});