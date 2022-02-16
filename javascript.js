/*
      global self, $, classInputField
*/



self.onInit = function() {
      self.ctx.ngZone.run(function() {
            init();
            self.ctx.detectChanges();
      });
};

function init() {

      // load input fields from widget advanced settings JSON
      let cstmFields = self.ctx.settings.entityParameters;
      if (cstmFields && typeof cstmFields !== 'object') {
            cstmFields = JSON.parse(cstmFields);
      }

      // so angular can use it in html code
      self.ctx.$scope.command = self.ctx.settings.command;



      $(document).ready(function() {

            // parent DOM
            const frm = document.getElementById('cstmFrm1-' + self.ctx.settings.command);

            self.ctx.$scope.fields = [];

            // iterate input fields
            for (let i = 0; i < cstmFields.length; i++) {
                  const field = cstmFields[i];

                  // create new field and add to scope array under "field"
                  let clField = new classInputField(field.type, frm, field, self);
                  self.ctx.$scope.fields.push(clField);
            }

            frm.appendChild(document.createElement('br'));

            // send button
            let button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = self.ctx.settings.buttonText;
            $(button).click(self.ctx.$scope.sendUpdate);
            frm.appendChild(button);
            self.ctx.$scope.btnSend = button;

      });


      // angular DOM elements
      self.ctx.$scope.showTitle = self.ctx.settings.title && self.ctx.settings.title.length ? true : false;
      self.ctx.$scope.title = self.ctx.settings.title;
      self.ctx.$scope.styleButton = self.ctx.settings.styleButton;


      if (self.ctx.settings.styleButton.isPrimary === false) {
            self.ctx.$scope.customStyle = {
                  'background-color': self.ctx.$scope.styleButton.bgColor,
                  'color': self.ctx.$scope.styleButton.textColor
            };
      }



}


// gets called when button is pushed
// saves attributes and triggers rule chain "attributes updated"
self.ctx.$scope.sendUpdate = function() {


      let entityId = {
            entityType: "DEVICE",
            id: self.ctx.defaultSubscription.targetDeviceId
      };

      const entityAttributeType = self.ctx.settings.entityAttributeType;


      // holds all attributes that will be written to device
      let attributes = [];


      // take command from widget Settings
      attributes.push({
            key: 'command',
            value: self.ctx.settings.command
      });
      // loop input forms and get values
      self.ctx.$scope.fields.forEach(item => attributes.push(item.getValue()));


      const attributeService = self.ctx.$scope.$injector.get(self.ctx.servicesMap.get('attributeService'));
      // save attributes
      attributeService.saveEntityAttributes(entityId, entityAttributeType, attributes).subscribe(
            function success() {
                  self.ctx.$scope.error = '';
                  self.ctx.detectChanges();
            },
            function fail(rejection) {
                  if (self.ctx.settings.showError) {
                        self.ctx.$scope.error =
                              rejection.status + ": " +
                              rejection.statusText;
                        self.ctx.detectChanges();
                  }
            }

      );
};
