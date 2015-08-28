
document.addEventListener("DOMContentLoaded", function(event) { 

// querySelector, jQuery style
var $_ = function (selector) {
  return document.querySelectorAll(selector);
};

var grabMjiApiInfos = function(that) {
  console.log(that)
}



// laDalle Api 
if (window.location.hostname == "localhost"){
  var host = "http://"+window.location.hostname+':3000'
}
else{
  var host = "http://"+ window.location.hostname;
}

var codeHost = document.querySelectorAll('.host');
for (i = 0; i < codeHost.length; ++i) {
  codeHost[i].innerHTML = host;
}

var api = 'api';
var jsonPath = 'data/api.json';
var body = document.body;
var ex = document.querySelectorAll('.change-url');
var exLength = ex.length;
  for(var i = 0; i < exLength; i++) { 
    ex[i].innerHTML = host+'/'+api+'/';
  }

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

  // define blendr vars from json
getJSON(jsonPath).then(function(data) {

    var nbPerson = data.length;
    // console.log(data.length)
    // Iterates through the objects 

     for(var i in data) { 
          // console.log(data[i])

         var nbName = data[i].name;
         var nbFace = data[i].face;
         var nbNameFormat = nbName.replace(/ /g,"_");

         // console.log(nbName)

          var template = '<div class="em-block" ' +
          ' data-apiurl="'+window.location.hostname+':3000/'+api+'/'+ i +'"'+
          ' data-apiurl-face="'+window.location.hostname+':3000/'+api+'/'+ i +'/face"' +
          ' data-apiurl-name="'+window.location.hostname+':3000/'+api+'/'+ i +'/name"' +
          ' data-apiurl-job="'+window.location.hostname+':3000/'+api+'/'+ i +'/job"' +
          ' data-apiurl-face-png="'+window.location.hostname+':3000/'+api+'/'+ i +'/face/png"' +
          ' data-apiurl-profile-png="'+window.location.hostname+':3000/'+api+'/'+ i +'/png"><div>' + 
          ' <span class="em-face">' + nbFace + '</span><h3 class="em-name">'+nbName+'</h3></div></div>'

      document.body.querySelector('#'+api ).innerHTML += template;

      var profiles = document.querySelectorAll('.em-block');
 
for (i = 0; i < profiles.length; ++i) {
  
  profiles[i].addEventListener('click', function(){
    var apiProfile,
        apiProfileFace,
        apiProfileName,
        apiProfileJob,
        apiProfileFacePng,
        apiProfilePng;
    apiProfile = this.dataset.apiurl;
    apiProfileFace = this.dataset.apiurlFace;
    apiProfileName = this.dataset.apiurlName;
    apiProfileJob = this.dataset.apiurlJob;
    apiProfileFacePng = this.dataset.apiurlFacePng;
    apiProfilePng = this.dataset.apiurlProfilePng;

    console.log(apiProfile + '\n' + apiProfileFace, apiProfileName, apiProfilePng, apiProfileFacePng);
    /// API MODULE TEMPLATE 
    var apiModuleTemplate = '<div class="api-module">'+
    '<span data-label="Api profile :"><a target="_blank" href="http://'+apiProfile+'">'+ apiProfile + '</a></span>'+
    '<span data-label="Api profile face :"><a target="_blank" href="http://'+apiProfileFace+'">'+ apiProfileFace + '</a></span>'+
    '<span data-label="Api profile name :"><a target="_blank" href="http://'+apiProfileName+'">'+ apiProfileName +'</a></span>'+
    '<span data-label="Api profile job :"><a target="_blank" href="http://'+apiProfileJob+'">'+ apiProfileJob +'</a></span>'+
    '<span data-label="Api profile (png) :"><a target="_blank" href="http://'+apiProfilePng+'">'+ apiProfilePng +'</a></span>'+
    '<span data-label="Api profile face (png) :"><a target="_blank" href="http://'+apiProfileFacePng+'">'+ apiProfileFacePng +'</a></span></div>';

    document.getElementById('api-module').innerHTML = apiModuleTemplate;
  })

}
      }

  }, function(status) { 
  console.log('You fucked up, Jimmy.' + status)
});






})

