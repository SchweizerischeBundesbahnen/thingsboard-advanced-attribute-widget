// angular object simulator

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
                                                const data = [{
                                                      lastUpdateTs: (+new Date()),
                                                      key: 'test',
                                                      value: -500
                                                }]
                                                try {
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
                  targetDeviceId: 'TEST'
            }
      }
};



// load json settings from file
const loadAngularSettings = function() {
      return new Promise((resolve, reject) => {
            fetch('test.settings.json')
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
