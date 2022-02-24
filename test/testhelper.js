// angular object simulator

const DEVICE_ID = 'TEST';
const GIT_VERSION = '37056f4c23ae3e9a2fa1978b7ea78a4c0afbbe3e';


let self = {
      ctx: {
            settings: {
                  title: 'Test Widget',
                  entityParameters: null,
                  command: 'setEnvParam',
                  buttonText: 'Set Attributes',
                  styleButton: {
                        isPrimary: true,
                        bgColor: 'hsl(206,100%,52%)',
                        textColor: 'black'
                  },
                  entityAttributeType: 'SERVER_SCOPE'
            },
            ngZone: {
                  run: function(fn) {
                        fn();
                  }
            },
            detectChanges: () => {},
            '$scope': {
                  command: null,
                  '$injector': {
                        get: fn => fn
                  }
            },
            servicesMap: {
                  get: () => {
                        return {
                              saveEntityAttributes: (entityId, entityAttributeType, attributes) => {
                                    return {
                                          subscribe: (success, fail) => {
                                                console.log('saved attributes', attributes);
                                                try {
                                                      success();
                                                }
                                                catch (e) {
                                                      fail(e);
                                                }
                                          }
                                    };
                              },
                              getEntityAttributes: (entityId, entityAttributeType, attributes) => {
                                    return {
                                          subscribe: (success, fail) => {
                                                const attr = {};
                                                attr[DEVICE_ID] = {
                                                      led_on: 'true',
                                                      temp_max: '40',
                                                      temp_min: '-25',
                                                      waypoints: '[0, 50, 250]',
                                                      alert_email: '["test@sbb.ch"]',
                                                };
                                                try {
                                                      const data = [{
                                                            lastUpdateTs: (+new Date()),
                                                            key: attributes[0],
                                                            value: attr[entityId.id][attributes[0]]
                                                      }];
                                                      success(data);
                                                }
                                                catch (e) {
                                                      fail(e);
                                                }
                                          }
                                    };
                              }
                        };
                  }
            },
            defaultSubscription: {
                  targetDeviceId: DEVICE_ID
            }
      }
};



// load json settings from file
const loadAngularSettings = function() {
      return new Promise((resolve, reject) => {
            fetch('https://cdn.jsdelivr.net/gh/SchweizerischeBundesbahnen/thingsboard-advanced-attribute-widget@' + GIT_VERSION + '/test/test.settings.json')
                  .then(data => {
                        data.json()
                              .then(json => {
                                    self.ctx.settings.entityParameters = json;
                                    console.log(json);
                                    return resolve();
                              })
                              .catch(e => reject(e));
                  })
                  .catch(e => reject(e));
      });
};
