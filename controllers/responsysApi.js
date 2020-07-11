
var responsys = {
  authToken: null,
  endPoint: null,
  programs: null,
  programStopped: true
};

var authOptions = {
  method: "POST",
  uri: "https://login2.responsys.net/rest/api/v1.3/auth/token",
  form: {
    user_name: process.env.riUsername,
    password: process.env.riPassword,
    auth_type: "password"
  },
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  },
  json: false // Automatically stringifies the body to JSON
};


function authTokenPrograms(authOptions, rp, responsys, res) {
  rp(authOptions)
    .then(function(body) {
      // POST succeeded...
      let json = JSON.parse(body);
      authToken = json.authToken;
      responsys.endPoint = json.endPoint;
      responsys.authToken = authToken;
      console.log("auth worked: " + body);
      console.log("Auth token: " + responsys.authToken);
    })
    .then(function() {
      var getProgramOptions = {
        uri: responsys.endPoint + "/rest/api/v1.3/programs",
        headers: {
          "content-type": "application/json",
          Authorization: responsys.authToken
        },
        json: false // Automatically parses the JSON string in the response
      };
      rp(getProgramOptions)
        .then(function(programBody) {
          //let json = JSON.parse(body);
          programs = programBody;
          responsys.programs = programBody;
          console.log("program API call worked: ");
          return res.status(200).send(responsys.programs);
        })
        .catch(function(err) {
          console.log("program API call did not work: " + err);
        });
    })
    .catch(function(err) {
      // POST failed...
      console.log("auth did not work: " + err);
    });
}

function stopProgram(authOptions, rp, responsys, programName) {
  rp(authOptions)
    .then(function(body) {
      // POST succeeded...
      let json = JSON.parse(body);
      authToken = json.authToken;
      responsys.endPoint = json.endPoint;
      responsys.authToken = authToken;
      // console.log("auth worked: " + body);
      console.log("Auth token: " + responsys.authToken);
    })
    .then(function() {
     // var saveDraft = "Y";
      //var programName = "dylan_test_program";
      var stopProgramOptions = {
        method: "PATCH",
        uri: responsys.endPoint + "/rest/api/v1.3/programs/" + programName,
        headers: {
          "content-type": "application/json",
          Authorization: responsys.authToken
        },
        json: true, // Automatically parses the JSON string in the response
        body: {
          action: "unpublish",
          saveDraft: "Y"
        }
      };
      rp(stopProgramOptions)
        .then(function(stopProgramBody) {
          //let json = JSON.parse(body);
          console.log(stopProgramBody)
          console.log("stopProgram API call worked: ");
          // return res.status(200).send(responsys.programs);
        })
        .catch(function(err) {
          console.log("stopProgram API call did not work: " + err);
        });
    })
    .catch(function(err) {
      // POST failed...
      console.log("auth did not work: " + err);
    });
}

module.exports = {
  authTokenPrograms,
  responsys,
  authOptions,
  stopProgram
};
