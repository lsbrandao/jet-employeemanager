/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojknockout',
    'promise',
    'ojs/ojlistview',
    'ojs/ojarraydataprovider'
  ],
  function (oj, ko, $) {

    function AboutViewModel() {
      var self = this;

      var data = [{
          name: 'Settings',
          version: '10.3.6',
          nodes: 2,
          cpu: 2,
          type: 'Java Cloud Service Virtual Image',
          balancer: 1,
          memory: 8
        },
        {
          name: 'Tools',
          version: '10.3.6',
          nodes: 2,
          cpu: 2,
          type: 'Java Cloud Service Virtual Image',
          balancer: 1,
          memory: 8
        },
        {
          name: 'Base',
          version: '10.3.6',
          nodes: 2,
          cpu: 2,
          type: 'Java Cloud Service Virtual Image',
          balancer: 1,
          memory: 8
        }
      ];

      self.dataProvider = new oj.ArrayDataProvider(data, {
        keys: data.map(function (value) {
          return value.name;
        })
      });

      self.connected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new AboutViewModel();
  }
);