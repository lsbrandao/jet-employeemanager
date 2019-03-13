define([
    'ojs/ojcore',
    'knockout',
    'jquery',
    '../factories/EmployeeFactory',
    'ojs/ojdatagrid',
    'ojs/ojcollectiondatagriddatasource',
    'ojs/ojinputtext',
    'ojs/ojformlayout',
    'my-employee-form/loader',
    'ojs/ojbutton'
  ],
  function (oj, ko, $, EmployeeFactory) {

    function DashboardViewModel() {
      var self = this;
      self.url = 'http://localhost:3000/employees';

      var nextKey = 121;
      self.inputEmployeeID = ko.observable(nextKey);
      self.inputFirstName = ko.observable();
      self.inputLastName = ko.observable();
      self.inputHireDate = ko.observable();
      self.inputSalary = ko.observable();


      self.collection = EmployeeFactory.createEmployeeCollection();

      self.dataSource = new oj.CollectionDataGridDataSource(
        self.collection, {
          rowHeader: 'id',
          columns: ['FIRST_NAME', 'LAST_NAME', 'HIRE_DATE', 'SALARY']
        });

      //build a new model from the observables in the form
      self.buildModel = function () {
        return {
          'id': self.inputEmployeeID(),
          'FIRST_NAME': self.inputFirstName(),
          'LAST_NAME': self.inputLastName(),
          'HIRE_DATE': self.inputHireDate(),
          'SALARY': self.inputSalary()
        };
      };

      //used to update the fields based on the selected row:
      self.updateFields = function (model) {
        self.inputEmployeeID(model.get('id'));
        self.inputFirstName(model.get('FIRST_NAME'));
        self.inputLastName(model.get('LAST_NAME'));
        self.inputHireDate(model.get('HIRE_DATE'));
        self.inputSalary(model.get('SALARY'));
      };

      self.handleSelectionChanged = function (event) {
        var selection = event.detail['value'][0];
        if (selection != null) {
          var rowKey = selection['startKey']['row'];
          self.modelToUpdate = self.collection.get(rowKey);
          self.updateFields(self.modelToUpdate);
        }
      };

      //METHOD FOR CREATING ITEM
      self.create = function (event) {
        if (self.inputEmployeeID(nextKey) < nextKey) {
          self.inputEmployeeID(nextKey);
        }
        nextKey += 1;
        self.inputEmployeeID(nextKey);
        self.collection.create(self.buildModel(), {
          wait: true,
          contentType: 'application/json',
          success: function (model, response) {
            console.log(self.inputEmployeeID() + ' -- new record created successfully')
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(self.inputEmployeeID() + " -- " + jqXHR);
          }
        });
      };

      // METHOD FOR UPDATING ITEM
      self.update = function () {
        self.empl = self.collection.get(self.inputEmployeeID());
        self.empl.save(self.buildModel(), {
          contentType: 'application/json',
          success: function (model, response) {
            console.log(self.inputEmployeeID() + ' -- updated successfully')
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(self.inputEmployeeID() + " -- " + jqXHR);
          }
        });
      };

      // METHOD FOR DELETING ITEM
      self.remove = function () {
        self.modelToUpdate = self.collection.remove(self.buildModel());
        self.modelToUpdate.destroy();
      };
    }

    return new DashboardViewModel();
  }
);