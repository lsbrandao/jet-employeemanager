define(['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojinputtext',
    'ojs/ojformlayout',
    'ojs/ojavatar',
    'ojs/ojlistview',
    'ojs/ojcollectiontabledatasource',
    'ojs/ojmodel'
  ],
  function (oj, ko, $) {

    function CustomerViewModel() {
      var self = this;

      self.url = "http://localhost:3000/employees/";

      var nextKey = 121;
      self.inputEmployeeID = ko.observable(nextKey);
      self.inputFirstName = ko.observable();
      self.inputLastName = ko.observable();
      self.inputHireDate = ko.observable();
      self.inputSalary = ko.observable();
      self.inputImage = ko.observable();

      self.collection = new oj.Collection(null, {
        model: new oj.Model.extend({
          idAttribute: 'id',
          urlRoot: self.url
        }),
        url: self.url
      });

      self.dataSourceTable = new oj.CollectionTableDataSource(
        self.collection, null);

      //build a new model from the observables in the form
      self.buildModel = function () {
        return {
          'id': self.inputEmployeeID(),
          'FIRST_NAME': self.inputFirstName(),
          'LAST_NAME': self.inputLastName(),
          'HIRE_DATE': self.inputHireDate(),
          'SALARY': self.inputSalary(),
          'Image': self.inputImage()
        };
      };

      //used to update the fields based on the selected row:
      self.updateFields = function (model) {
        self.inputEmployeeID(model.get('id'));
        self.inputFirstName(model.get('FIRST_NAME'));
        self.inputLastName(model.get('LAST_NAME'));
        self.inputHireDate(model.get('HIRE_DATE'));
        self.inputSalary(model.get('SALARY'));
        self.inputImage(model.get('Image'));
      };

      self.handleListSelectionChanged = function (event) {
        var selection = event.detail.value;
        if (selection != null) {
          self.modelToUpdate = self.collection.get(selection);
          self.updateFields(self.modelToUpdate);
        }
      };

    }
    return new CustomerViewModel();
  }
);