define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
    'ojs/ojoffcanvas'
  ],
  function (oj, ko, moduleUtils) {
    function ControllerViewModel() {
      var self = this;

      self.dashboardLabel = ko.observable(oj.Translations.getTranslatedString('dashboardLabel'));
      self.incidentsLabel = ko.observable(oj.Translations.getTranslatedString('incidentsLabel'));
      self.customersLabel = ko.observable(oj.Translations.getTranslatedString('customersLabel'));
      self.aboutLabel = ko.observable(oj.Translations.getTranslatedString('aboutLabel'));

      self.setLangAction = function (event) {
        var newLang = event.target.value;
        oj.Config.setLocale(newLang,
          function () {
            $('html').attr('lang', newLang);
            if (newLang === 'ar-EG') {
              $('html').attr('dir', 'rtl');
            } else {
              $('html').attr('dir', 'ltr');
            }
            document.dispatchEvent(new CustomEvent('localeListener'));
            self.dashboardLabel(oj.Translations.getTranslatedString('dashboardLabel'));
            self.incidentsLabel(oj.Translations.getTranslatedString('incidentsLabel'));
            self.customersLabel(oj.Translations.getTranslatedString('customersLabel'));
            self.aboutLabel(oj.Translations.getTranslatedString('aboutLabel'));
          });
      };

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure({
        'dashboard': {
          label: 'Dashboard',
          isDefault: true
        },
        'incidents': {
          label: 'Incidents'
        },
        'customers': {
          label: 'Customers'
        },
        'about': {
          label: 'About'
        }
      });
      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      self.moduleConfig = ko.observable({
        'view': [],
        'viewModel': null
      });

      self.loadModule = function () {
        ko.computed(function () {
          var name = self.router.moduleConfig.name();
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          var masterPromise = Promise.all([
            moduleUtils.createView({
              'viewPath': viewPath
            }),
            moduleUtils.createViewModel({
              'viewModelPath': modelPath
            })
          ]);
          masterPromise.then(
            function (values) {
              self.moduleConfig({
                'view': values[0],
                'viewModel': values[1]
              });
            }
          );
        });
      };

      // Navigation setup
      var navData = [{
          name: self.dashboardLabel,
          id: 'dashboard',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
        },
        {
          name: self.incidentsLabel,
          id: 'incidents',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
        },
        {
          name: self.customersLabel,
          id: 'customers',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'
        },
        {
          name: self.aboutLabel,
          id: 'about',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'
        }
      ];
      self.navDataSource = new oj.ArrayTableDataSource(navData, {
        idAttribute: 'id'
      });

      // Drawer
      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function () {
        oj.OffcanvasUtils.close(self.drawerParams);
      });
      self.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function () {
        return oj.OffcanvasUtils.toggle(self.drawerParams);
      }
      // Add a close listener so we can move focus back to the toggle button when the drawer closes
      $("#navDrawer").on("ojclose", function () {
        $('#drawerToggleButton').focus();
      });

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("App Name");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
    }

    return new ControllerViewModel();
  }
);