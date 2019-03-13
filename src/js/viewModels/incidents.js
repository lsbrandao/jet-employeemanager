define([
    'ojs/ojcore',
    'knockout',
    'jquery',
    '../factories/EmployeeFactory',
    'my-employee-form-container/loader',
    'ojs/ojknockout-model'
  ],
  function (oj, ko, $, EmployeeFactory) {

    function IncidentsViewModel() {
      var self = this;


      self.collection = EmployeeFactory.createEmployeeCollection();
      self.collection.fetch({
        'startIndex': 7,
        'fetchSize': 3
      });

      self.filter = ko.observableArray('');

      self.filterChanged = function (event) {
        var filter = event.target.rawValue;
        var filteredCollection = self.collection;
        if (self.originalCollection == undefined && filter !== undefined) {
          self.originalCollection = filteredCollection.clone();
        }
        var ret =
          self.originalCollection !== undefined ?
          self.originalCollection.where({
            FIRST_NAME: {
              value: filter,
              comparator: self.nameFilter
            }
          }) : [];
        if (ret.length == 0) {
          while (!filteredCollection.isEmpty()) {
            filteredCollection.pop();
          }
        } else {
          filteredCollection.reset(ret);
          self.datasource(oj.KnockoutUtils.map(self.collection, null, true)());
        }
      };

      self.nameFilter = function (model, attr, value) {
        var deptName = model.get("FIRST_NAME");
        return (deptName.toLowerCase().indexOf(value.toLowerCase()) > -1);
      };

      self.datasource = oj.KnockoutUtils.map(self.collection, null, true);
    }

    return new IncidentsViewModel();
  }
);