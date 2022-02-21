// angular object simulator

const DEVICE_ID = 'TEST';


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
                                                const attr = {};
                                                attr[DEVICE_ID] = {
                                                      distance1: '230',
                                                      distance2: '201',
                                                      waypoints: '[0, 50, 250]'
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
            fetch('https://cdn.jsdelivr.net/gh/SchweizerischeBundesbahnen/thingsboard-advanced-attribute-widget@7f19d42c7680d1e2ec995c6767f3503f4510b6d3/test/test.settings.json')
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
