"use strict";

sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  /**
   * Generated event handler.
   *
   * @param this reference to the 'this' that the event handler is bound to.
   * @param pageContext the context of the page on which the event was fired
   */
  const sendMail = function (pageContext) {
    try {
      const tokenUrl = 'https://z-sap-build-apps-sbx.authentication.us10.hana.ondemand.com/oauth/token';
      const apiUrl = 'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/public/workflow/rest/v1/workflow-instances';
      const payload = {
        "mail": {
          "subject": "Alert",
          "message": "Alert, this mail has been sent because ..."
        }
      };
      return Promise.resolve(_catch(function () {
        return Promise.resolve(fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            'client_id': 'sb-a337118b-0a7d-4d70-8aab-058718c13dd0!b280797|xsuaa!b49390',
            'client_secret': 'dd3579fd-6f15-4508-b23f-ec786be45f63$UqrnrUISh6x-IipTaFzy4R4A5inx259t8tCSO6DtVxc=',
            'grant_type': 'client_credentials'
          })
        })).then(function (tokenResponse) {
          if (!tokenResponse.ok) {
            throw new Error('Failed to get token');
          }
          return Promise.resolve(tokenResponse.json()).then(function (tokenData) {
            const token = tokenData.access_token;
            return Promise.resolve(fetch(apiUrl, {
              method: 'POST',
              //mode: 'no-cors', //Header token is niet mogelijk dan dus geen auth
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(payload)
            })).then(function () {});
          });
        });
      }, function (error) {
        MessageToast.show("Failed to send email: " + error);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.sendMail = sendMail;
  return __exports;
});
//# sourceMappingURL=SendAlert-dbg.js.map
