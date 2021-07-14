sap.ui.define([
  "./BaseController",
  "../model/formatter",
  "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (BaseController, formatter, Export, ExportTypeCSV, MessageBox, Filter, FilterOperator) {
  "use strict";
  return BaseController.extend("project.frotasapp.controller.Condutores", {
    formatter: formatter,

    onInit: function () {
      this.getRoute("condutores").attachMatched(this.onRouteMatched.bind(this));
    },

    onRouteMatched: function () {
    },

    onCarsFilter: function (oEvent) {

      var sQuery = oEvent.getSource().getValue();
      var oFilter = new Filter({
        filters: [
          new Filter("Nome", FilterOperator.Contains, sQuery),
          new Filter("Matricula", FilterOperator.Contains, sQuery),
          new Filter("CentroCusto", FilterOperator.Contains, sQuery),
          new Filter("TicketLog", FilterOperator.Contains, sQuery),
          new Filter("CPF", FilterOperator.Contains, sQuery),
          new Filter("RG", FilterOperator.Contains, sQuery),
          new Filter("CNH", FilterOperator.Contains, sQuery)
        ],
        and: false
      });

      // filter binding
      var oTable = this.getView().byId("condutorTable");
      var oBinding = oTable.getBinding("items");
      oBinding.filter(oFilter);
    },

    onDataExport: function () {

      var oExport = new Export({
        fileName: "Condutores",

        // Type that will be used to generate the content. Own ExportType's can be created to support other formats
        exportType: new ExportTypeCSV({
          separatorChar: ";"
        }),

        // Pass in the model created above
        models: this.getModel("condutores"),

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
          name: "Matricula",
          template: {
            content: "{Matricula}"
          }
        }, {
          name: "CentroCusto",
          template: {
            content: "{CentroCusto}"
          }
        }, {
          name: "TicketLog",
          template: {
            content: "{TicketLog}"
          }
        }, {
          name: "DataNascimento",
          template: {
            content: "{DataNascimento}"
          }
        }, {
          name: "Email",
          template: {
            content: "{Email}"
          }
        }, {
          name: "DDD",
          template: {
            content: "{DDD}"
          }
        }, {
          name: "Celular",
          template: {
            content: "{Celular}"
          }
        }, {
          name: "CPF",
          template: {
            content: "{CPF}"
          }
        }, {
          name: "RG",
          template: {
            content: "{RG}"
          }
        }, {
          name: "CNH",
          template: {
            content: "{CNH}"
          }
        }, {
          name: "VencimentoCNH",
          template: {
            content: "{VencimentoCNH}"
          }
        }, {
          name: "DataRecebimento",
          template: {
            content: "{DataRecebimento}"
          }
        }, {
          name: "GerenteSupervisor",
          template: {
            content: "{GerenteSupervisor}"
          }
        }, {
          name: "Diretor",
          template: {
            content: "{Diretor}"
          }
        }]
      });

      // download exported file
      oExport.saveFile("Condutores").catch(function (oError) {
        MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
      }).then(function () {
        oExport.destroy();
      });
    }
  });
});