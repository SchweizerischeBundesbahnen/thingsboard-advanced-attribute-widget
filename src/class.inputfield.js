/* global $ */

// SVG icons
// All Icons from https://icons8.com
const WIDGET_ICON_PLUS = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>';
const WIDGET_ICON_TRASH = '<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32" width="16px" height="16px"><path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"/></svg>';


/**
 *
 * Creates a field inside a Thingsboard widget
 *
 */
class classInputField {
      /**
       *
       * Constructor
       *
       * @param {string} type - range, text, checkbox
       * @param {HTMLElement} parentDom - DOM element of parent;
       * @param {Object} params - parameters of the input field
       * @param {string} params.title - is used on the label; can have %s for replacements
       * @param {string} params.type - possible values: textfield|slider|checkbox
       * @param {string} params.key - the TB entity attribute key
       * @param {string} params.value -
       * @param {Number} [params.min] - minimum value for range
       * @param {Number} [params.max] - maximum value for range
       * @param {Number} [params.step] - steps for slider
       * @param {string} [params.multi] - true|false
       * @param {string} [params.multitype] - for now only "array" which saves the values as "[x,y,z]"
       * @param {string} [params.pattern] - regular expression; backslash must be escaped;
       * @param {Object} angular - "self" variable inside thingsboard widget js
       *
       * @return {void} Nothing
       *
       */
      constructor(parentDom, params, angular) {
            this.type = params.type;
            this.parentDom = parentDom;
            this.params = params;
            this.title = this.params.title;
            this.label = null;
            this.input = null;
            this.container;
            this.containerBody;
            this.counter = 1;
            this.summary;
            this.angularself = angular;
            this.subfields = [];
            this.subfieldsValues = [];
            this.remove = null;
            this.render();
      }


      /**
       * Render DOM of the input field
       * if field is a multifield, create "add" button
       * @return {void} Nothing
       * @public
       * @method
       */
      render = function() {
            this.container = document.createElement('div');
            this.container.className = 'tb-cstm-row-container';
            this.containerBody = document.createElement('div');
            this.container.appendChild(this.containerBody);
            this.addInputField();
            this.parentDom.appendChild(this.container);

            // multi value input field (general)
            if (this.params.multi) {

                  // "add" button
                  let add = document.createElement('button');
                  add.className = 'btn btn-secondary tb-cstm-button-add';
                  add.innerHTML = WIDGET_ICON_PLUS + '&nbsp;&nbsp;Add';
                  this.container.appendChild(add);
                  add.onclick = (e) => {
                        this.counter++;
                        this.addInputField(true); // true=>subField
                        this.checkAndUpdateSummary();
                        e.preventDefault(); // or else bootrap does page reload/senf form data to nirvana
                  };
            }
      }



      /**
       *
       * Create new input field DOM
       *
       * also creates first element of multi-field
       * @public
       * @method
       *
       * @param {true|false} isMultiField - set field as part of a multifield
       * @return {void} Nothing
       *
       */
      addInputField = function(isMultiField = false) {
            let myself = this; // used for sub functions

            let container = this.containerBody;

            // label & input are array of length 1, if not a multi inputfield
            this.label = document.createElement('label');
            this.input = document.createElement('input');

            const curLabel = this.label;
            const curInput = this.input;


            // Label
            curLabel.className = 'form-label';
            curLabel.innerHTML = this.params.title.replace('%s', this.params.value || 0);
            curLabel.setAttribute('for', 'cstmFrmInput-' + this.params.key);

            // input field
            curInput.name = this.params.key || 'thisFieldhasNoKeyPleaseSetAKey';
            curInput.id = 'cstmFrmInput-' + this.params.key; // id is needed to associate with label

            // in case of multi field it must go in separate container
            if (this.params.multi) {
                  // overwrites default container variable to newly created container
                  container = document.createElement('div');
                  this.containerBody.appendChild(container);
                  curLabel.innerHTML = this.params.title.replace('%s', this.counter - 1);
            }

            // multifield summary
            if (this.params.multi && !isMultiField) {
                  this.type = 'text';
                  curLabel.innerHTML = this.params.title.replace(' %s', '');
                  curInput.setAttribute('disabled', 'disabled');

                  // assign this input to summary of multi field
                  this.summary = curInput;
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
                        curInput.oninput = () => this.checkAndUpdateSummary();
                        curInput.onblur = () => this.checkAndUpdateSummary();
                        break;
                  case 'checkbox':
                        container.className = 'form-check';
                        container.style.paddingLeft = '0px';
                        curInput.type = 'checkbox';
                        curInput.value = '';
                        curInput.className = 'form-check-input';
                        curInput.className = 'form-check-label';
                        container.appendChild(curInput);
                        container.appendChild(curLabel);
                        break;
            }

            // add subfields to array
            if (isMultiField) {
                  this.subfields.push(curInput);
                  curInput.value = myself.subfieldsValues[this.counter - 2] || 0;
                  this.glueRemoveToLastSubElement();
            }

            // set default value from last setting
            // don't do this for multi-fields/subfields because they get set from summary field
            else {
                  try {
                        this.getDefaultValue(this.params.key)
                              .then(attribute => myself.setValue(attribute[0].value));
                  }
                  catch (e) {
                        console.log(e);
                  }
            }
      }


      /**
       *
       * puts a remove button to the last element of a multifield
       * only the last element has a remove button
       *
       * @method
       *
       */
      glueRemoveToLastSubElement = function() {
            const myself = this;

            let move = function() {
                  // detach DOM from old parent
                  try {
                        myself.remove.parentElement.removeChild(myself.remove);
                  }
                  catch (e) {}
                  // append to last subfield
                  if (myself.subfields.length) {
                        $(myself.subfields[myself.subfields.length - 1]).after(myself.remove);
                  }

            };

            // on first run create remove button
            if (!this.remove) {
                  // add remove button
                  this.remove = document.createElement('button');
                  this.remove.className = 'btn';
                  this.remove.innerHTML = WIDGET_ICON_TRASH + '&nbsp;';
                  // this.container.appendChild(remove);
                  this.remove.onclick = (e) => {
                        myself.counter--;
                        let curInput = myself.subfields[myself.subfields.length - 1];
                        let row = curInput.parentElement;
                        row.remove();
                        myself.subfields.pop(); // remove last element
                        move();
                        myself.checkAndUpdateSummary();
                        e.preventDefault(); // or else bootrap does page reload/senf form data to nirvana
                  };
            }


            move();

      }




      /**
       * if there is a total field (array) this updates it
       * is also called by single field for pattern check
       *
       * @public
       * @method
       *
       * @return {void} Nothing
       *
       *
       */
      checkAndUpdateSummary = function() {


            let inputFields = null;

            // for multifields check every subfield
            if (this.summary && this.params.multitype) {

                  let values = [];
                  // put all values in an array
                  this.subfields.forEach((item) => values.push($(item).val()));

                  inputFields = this.subfields;

                  // // check every item agains pattern
                  // if (this.params.pattern) {
                  //       let hasError = false;
                  //       this.subfields.forEach(item => {
                  //             if (!this.checkPattern($(item).val())) hasError = true;
                  //       });
                  //       if (hasError) this.disableSendButton();
                  //       else this.enableSendButton();
                  // }

                  // create a fake array for visualisation
                  let value = '';
                  switch (this.params.multitype) {
                        case 'array':
                              value = [
                                    '[',
                                    values.join(','),
                                    ']'
                              ].join('');
                              break;
                        case 'list':
                              value = values.join(',');
                              break;
                  }
                  $(this.summary).val(value);
            }
            else {
                  inputFields = [this.input];
            }

            if (this.params.pattern) {
                  let hasError = false;
                  inputFields.forEach(item => {
                        if (!this.checkPattern(item)) hasError = true;
                  });
                  if (hasError) this.disableSendButton();
                  else this.enableSendButton();
            }


            // console.log('value:', value);
      }





      /**
       *
       * update the label from current value
       * used excpecially on slider
       *
       * @public
       * @method
       *
       * @param {HTMLElement} label - the <label> DOM Element which will be updated
       * @param {string} value - the value which may have replacer
       * @return {void} Nothing
       *
       */
      updateLabel = function(label, value) {
            value = this.params.title.replace('%s', value);
            $(label).html(value);
      }


      /**
       *
       * Checks, if there is a pattern for the input value and checks it against it
       * only for text fields
       *
       * @public
       * @method
       *
       * @param {HTMLElement} input - element that contains the value; needed to activate shake on wrong input
       * @param {string} value - this is the string that will be checked agains this.params.pattern
       * @return {true|false} - true for correct pattern, false if check is unsuccesfull
       *
       *
       */
      checkPattern = function(input) {
            const value = $(input).val();
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
       * @public
       * @method
       *
       * @param {HTMLElement} domElement - the element that should be shaken
       * @return {void} Nothing
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
       * Set value of the input field
       * gets called after server attributes are called
       *
       * @method
       *
       */
      setValue = function(value) {
            const curInput = this.input;
            // regular field
            if (!this.params.multi) {
                  // checkboxes are special (no value, but attr checked)
                  if (this.type === 'checkbox' && value === 'true') {
                        curInput.setAttribute('checked', 'checked');
                  }
                  // regular value
                  else {
                        curInput.value = value;
                  }

                  // label
                  $(this.label).html(this.params.title.replace('%s', $(this.input).val()));
            }

            // in case of multi field load subfields for every array value
            else {
                  switch (this.params.multitype) {
                        case 'array':
                              this.subfieldsValues = JSON.parse(value);
                              break;
                        case 'list':
                              this.subfieldsValues = value.split(',');
                              break;
                  }
                  this.subfieldsValues.forEach(item => {
                        this.counter++;
                        this.addInputField(true); // true=>subField
                  });
                  this.checkAndUpdateSummary();
            }
      }


      /**
       *
       * get default value from server attribute (which is last set value)
       * does no conversion blunt value
       *
       * @public
       * @method
       *
       * @param {Array} attributeKey - array with keys to retrieve values from
       * @return {Promise} - a promise with requested attributes
       *
       *
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
       * get value-key pair of this attribute
       * public function that gets called from angular inside widget code
       *
       * @public
       * @method
       *
       *
       * @return {Object} - {key:'', value:''}
       *
       *
       */
      getValue = function() {
            let value;

            // for multi value take summary
            if (this.params.multi) {
                  switch (this.params.multitype) {
                        case 'array':
                              // summary is a dumb string; so we take it appart and make a real JSON-String out of it
                              // everything that is not a number will be force converted into a json-string
                              let parts = $(this.summary).val().slice(1, -1).split(',');
                              parts.forEach((item, index) => { if (isNaN(item)) { parts[index] = '"' + item + '"' } });
                              value = '[' + parts.join(',') + ']'; // real json
                              let jsonValue = JSON.parse(value);
                              value = JSON.stringify(jsonValue);
                              break;
                        case 'list':

                              value = $(this.summary).val();
                              break;
                  }
            }
            else {
                  const input = $(this.input);
                  value = (input.attr('type') === 'checkbox') ? (input.prop('checked') ? true : false) : input.val();
            }


            return {
                  key: this.params.key,
                  value: value
            };
      }


      /**
       *
       * disables the send button
       *
       * @public
       * @method
       *
       * @return {void} Nothing
       *
       */
      disableSendButton = function() {
            const btn = this.angularself.ctx.$scope.btnSend;

            // disable button completly
            $(btn).off('click'); // remove all event handlers of click
            $(btn).click(e => e.preventDefault()); // prevent reloading page (which is default behaviour of bootrap button)

            $(btn).removeClass('btn-primary');
            $(btn).addClass('btn-danger');
      }

      /**
       *
       * enables the send button
       *
       * @public
       * @method
       *
       * @return {void} Nothing
       *
       */
      enableSendButton = function() {
            const btn = this.angularself.ctx.$scope.btnSend;
            $(btn).off('click');
            $(btn).removeClass('btn-danger');
            $(btn).addClass('btn-primary');
            $(btn).click(this.angularself.ctx.$scope.sendUpdate);
      }

}
