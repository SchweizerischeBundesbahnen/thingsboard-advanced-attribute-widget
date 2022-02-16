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
      const cstmFields = JSON.parse(self.ctx.settings.entityParameters);

      // so angular can use it in html code
      self.ctx.$scope.command = self.ctx.settings.command;



      $(document).ready(function() {

            // parent DOM
            const frm = document.getElementById('cstmFrm1-' + self.ctx.settings.command);

            // iterate input fields
            for (let i = 0; i < cstmFields.length; i++) {
                  const field = cstmFields[i];
                  new classInputField(field.type, frm, field, self);
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
      const entityAttributeType = self.ctx.settings.entityAttributeType;

      if (self.ctx.settings.styleButton.isPrimary === false) {
            self.ctx.$scope.customStyle = {
                  'background-color': self.ctx.$scope.styleButton.bgColor,
                  'color': self.ctx.$scope.styleButton.textColor
            };
      }

      const attributeService = self.ctx.$scope.$injector.get(self.ctx.servicesMap.get('attributeService'));


      // gets called when button is pushed
      // saves attributes and triggers rule chain "attributes updated"
      self.ctx.$scope.sendUpdate = function() {

            // holds all attributes that will be written to device
            let attributes = [];

            // take command from widget Settings
            attributes.push({
                  key: 'command',
                  value: self.ctx.settings.command
            });

            // loop input forms and get values
            // don't take part values because they are always
            // summarized in "total"-field which we use
            $('#cstmFrm1-' + self.ctx.settings.command + ' *').filter(":input").not("[partValue='yes']").each(function() {
                  if ($(this).attr('name')) { // needs a name because this will be the key
                        // use checkbox true|false or val()
                        const value = ($(this).attr('type') === 'checkbox') ? ($(this).prop('checked') ? true : false) : $(this).val();
                        attributes.push({
                              key: $(this).attr('name'),
                              value: value
                        });
                  }
            });


            let entityId = {
                  entityType: "DEVICE",
                  id: self.ctx.defaultSubscription.targetDeviceId
            };
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
}
