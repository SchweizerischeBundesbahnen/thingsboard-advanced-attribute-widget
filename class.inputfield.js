/* global $ */

// SVG Plus icon
const WIDGET_ICON_PLUS = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>';

class classInputField {

      constructor(type, parentDom, params, angular) {
            this.type = type;
            this.parentDom = parentDom;
            this.params = params;
            this.title = this.params.title;
            this.label = [];
            this.input = [];
            this.container;
            this.containerBody;
            this.counter = 1;
            this.summary;
            this.angularself = angular;
            this.render();
      }


      /**
       *
       * Render DOM of the input field
       *
       * if field is a multifield, create "add" button
       *
       */
      render = function() {
            this.container = document.createElement('div');
            this.containerBody = document.createElement('div');
            this.container.appendChild(this.containerBody);
            this.addInputField();
            this.parentDom.appendChild(this.container);

            // multi value input field (general)
            if (this.params.multi) {
                  let add = document.createElement('button');
                  add.className = 'btn btn-secondary tb-cstm-button-add';
                  add.innerHTML = WIDGET_ICON_PLUS + '&nbsp;&nbsp;Add';
                  this.container.appendChild(add);
                  add.onclick = () => {
                        this.counter++;
                        this.addInputField();
                        this.updateSummary();
                  };
                  // array as multitype specific
                  if (this.params.multitype && this.params.multitype === 'array') {
                        let container = document.createElement('div');
                        // container.style.display = 'none';
                        let label = document.createElement('label');
                        label.innerHTML = this.params.title.replace('%s', this.params.value || 0);
                        this.summary = document.createElement('input');
                        label.style.marginRight = '20px';
                        this.summary.name = this.params.key || 'thisFieldhasNoKeyPleaseSetAKey';
                        this.summary.type = 'text';
                        this.summary.className = 'form-text';
                        this.summary.value = this.params.default || '';
                        this.summary.setAttribute('disabled', 'disabled');
                        container.appendChild(label);
                        container.appendChild(this.summary);
                        this.container.appendChild(container);
                        this.updateSummary();
                  }
            }
            // ************   end multi value input field
      }



      /**
       *
       * Create new input field DOM
       *
       *
       *
       */
      addInputField = function() {
            let myself = this; // used for sub functions

            let container = this.containerBody;

            // subcontainer for multi forms
            if (this.params.multi) {
                  container = document.createElement('div'); // overwrites default container variable
                  this.containerBody.appendChild(container);
            }

            // label & input are array of length 1, if not a multi inputfield
            this.label.push(document.createElement('label'));
            this.input.push(document.createElement('input'));

            const curLabel = this.label[this.label.length - 1];
            const curInput = this.input[this.input.length - 1];


            // Label
            curLabel.className = 'form-label';
            curLabel.innerHTML = this.params.title.replace('%s', this.params.value || 0);
            curLabel.setAttribute('for', 'cstmFrmInput-' + this.params.key);

            // input field
            curInput.name = this.params.key || 'thisFieldhasNoKeyPleaseSetAKey';
            curInput.id = 'cstmFrmInput-' + this.params.key; // id is needed to associate with label

            if (this.params.multi) {
                  curLabel.innerHTML = this.params.title.replace('%s', this.params.value || 0).replace(':', '') + ' ' + this.counter + ':';
                  curInput.name = curInput.name + '-' + this.input.length;
            }

            switch (this.type) {
                  case 'range':
                        curInput.type = 'range';
                        curInput.className = 'form-range';
                        curInput.min = this.params.min || 0;
                        curInput.max = this.params.max || 100;
                        curInput.step = this.params.step || 0.1;
                        curInput.value = this.params.value || 0;
                        // update label
                        curInput.oninput = () => this.updateLabel(curLabel, $(curInput).val());
                        container.appendChild(curLabel);
                        container.appendChild(curInput);
                        break;
                  case 'text':
                        curLabel.style.marginRight = '20px';
                        curInput.type = 'text';
                        curInput.className = 'form-text';
                        curInput.value = this.params.default || '';
                        container.appendChild(curLabel);
                        container.appendChild(curInput);
                        curInput.oninput = () => this.updateSummary();
                        curInput.onblur = () => this.updateSummary();
                        break;
                  case 'checkbox':
                        container.className = 'form-check';
                        curInput.type = 'checkbox';
                        curInput.value = '';
                        curInput.className = 'form-check-input';
                        curInput.className = 'form-check-label';
                        container.appendChild(curInput);
                        container.appendChild(curLabel);
                        break;
            }

            // set flag for multi-field as partValue
            // this is needed to be able to filter it later
            if (this.params.multi) {
                  curInput.setAttribute('partValue', 'yes');
            }

            // set default value from last setting
            try {
                  this.getDefaultValue(this.params.key)
                        .then(attribute => {
                              curInput.value = attribute[0].value;
                              $(myself.label[0]).html(myself.params.title.replace('%s', $(myself.input[0]).val()));

                        });
            }
            catch (e) {
                  console.log(e);
            }
      }




      /**
       * if there is a total field (array) this updates it
       *
       *
       *
       *
       */
      updateSummary = function() {
            let value = '';
            if (this.summary && this.params.multitype && this.params.multitype === 'array') {
                  let values = [];
                  this.input.forEach((item) => {
                        values.push($(item).val());
                  });
                  if (this.params.pattern) {
                        let hasError = false;
                        values.forEach((item, i) => { if (!this.checkPattern(this.input[i], item)) hasError = true; });
                        if (hasError) this.disableSendButton();
                        else this.enableSendButton();
                  }
                  value = [
                        '[',
                        values.join(','),
                        ']'
                  ].join('');
                  $(this.summary).val(value);
            }
            else {
                  let values = [$(this.input[0]).val()];
                  if (this.params.pattern) {
                        let hasError = false;
                        values.forEach((item, i) => { if (!this.checkPattern(this.input[i], item)) hasError = true; });
                        if (hasError) this.disableSendButton();
                        else this.enableSendButton();
                  }
            }
            // console.log('value:', value);
      }

      /**
       *
       * disables the send button
       *
       */
      disableSendButton = function() {
            $(this.angularself.ctx.$scope.btnSend).off('click');
            $(this.angularself.ctx.$scope.btnSend).removeClass('btn-primary');
            $(this.angularself.ctx.$scope.btnSend).addClass('btn-danger');
      }

      /**
       *
       * enables the send button
       *
       */
      enableSendButton = function() {
            $(this.angularself.ctx.$scope.btnSend).off('click');
            $(this.angularself.ctx.$scope.btnSend).removeClass('btn-danger');
            $(this.angularself.ctx.$scope.btnSend).addClass('btn-primary');
            $(this.angularself.ctx.$scope.btnSend).click(this.angularself.ctx.$scope.sendUpdate);
      }





      updateLabel = function(label, value) {
            value = this.params.title.replace('%s', value);
            $(label).html(value);
      }

      /**
       *
       * Checks, if there is a pattern for the input value and checks it against it
       * only for text fields
       *
       *
       */
      checkPattern = function(input, value) {
            let correct = false;
            if (!this.params.pattern) return true; // no pattern set
            let reg = new RegExp(this.params.pattern);
            if (reg.test(value)) return true;
            if (!correct) this.shake(input);
            return false;
      }

      /**
       *
       * Shake animation for textfield
       * used when user inputs wrong values (according to pattern setting)
       *
       *
       */
      shake = function(domElement) {
            domElement.classList.add('shake');
            setTimeout(function() {
                  domElement.classList.remove('shake');
            }, 200);
      }

      /**
       *
       * get default value from server attribute (which is last set value)
       * returns a promise with requested attributes
       * example of returned data:

            [{
                  "lastUpdateTs": 1644836402754,
                  "key": "startMission_startPos",
                  "value": "-500"
            }]
       *
       */
      getDefaultValue = function(attributeKey) {
            let entityAttributeType = this.angularself.ctx.settings.entityAttributeType;
            let attributeService = this.angularself.ctx.$scope.$injector.get(this.angularself.ctx.servicesMap.get('attributeService'));
            const entityId = {
                  entityType: 'DEVICE',
                  id: this.angularself.ctx.defaultSubscription.targetDeviceId
            };
            return new Promise((resolve, reject) => {
                  attributeService.getEntityAttributes(entityId, entityAttributeType, [attributeKey]).subscribe(
                        function success(data) {
                              console.log(data);
                              resolve(data);
                        },
                        function fail(e) {
                              reject(e);
                        }
                  );
            });
      }


/**
 * 
 * get value-key pair
 * 
 * 
 */
      getValue = function() {
            let value;
            if (this.params.multi) {
                  value = $(this.summary).val();
            }
            else {
                  const input = $(this.input[this.input.length - 1]);
                  value = ($(input).attr('type') === 'checkbox') ? ($(input).prop('checked') ? true : false) : $(input).val();
            }
            return {
                  key: this.params.key,
                  value: value
            }
      }

}
