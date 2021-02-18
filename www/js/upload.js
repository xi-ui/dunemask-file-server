function doesQueryStringContainAValue(field,url){
  if(url.indexOf('?' + field + '=') != -1)
      return true;
  else if(url.indexOf('&' + field + '=') != -1)
      return true;
  return false
};


function setUpProgressBar(){
  const form = document.getElementById('fileinput');
  const userInput = document.getElementById('userInput');
  const progressBarFill= document.querySelector('#uploadPB > .progress-bar-fill');
  const progressBarText=progressBarFill.querySelector('.progress-bar-text');
  form.addEventListener('submit',handleUpload);
  function handleUpload(e){
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST","/upload",true);
    xhr.upload.addEventListener("progress", e =>{
      const percent = e.lengthComputable ? (e.loaded/e.total) *100 :0.00;
      progressBarFill.style.width = percent.toFixed(2)+"%";
      progressBarFill.textContent = percent.toFixed(2)+"%";
    })
    xhr.upload.addEventListener("loadstart", e =>{
        document.getElementById('uploadPB').style.display='block';
        document.getElementById('optserve').disabled=true;
        document.getElementById('userInput').disabled=true;
        document.getElementById('submitUpload').disabled=true;
    })
    xhr.upload.addEventListener("timeout", e =>{
        notifyError('Upload Timed Out!')
    })
    xhr.upload.addEventListener("load", e =>{
        document.querySelector('.processing').style.display='inline-flex';
    })
    xhr.upload.addEventListener("error", e =>{
      notifyError('Unkown Error Occurred!');
    })
    xhr.upload.addEventListener("abort", e =>{
      notifyError('File upload Canceled!');
    })


    xhr.setRequestHeader("x-filename", document.getElementById('userInput').value)
    xhr.onreadystatechange = function () {
     if (xhr.readyState == 4) {
       if (xhr.status == 200) {
           var data = xhr.responseText;
           document.open();
         document.write(data);
         document.close();
       }else{
        notifyError('Unkown Error Occurred!');
       }
     }
   };
    xhr.send(new FormData(form));
  }
}

function notifyError(msg){
    const topBar = document.querySelector('.topBar');
  topBar.innerHTML='<div class="statusIndicatorFail"><h1>'+msg+'</h1></div>'+topBar.innerHTML
  let message= document.querySelector('.statusIndicatorFail');
  message.classList.remove("statusIndicatorFail");
  void message.offsetWidth;
  message.classList.add("statusIndicatorFail");
  setTimeout(function() {
    location.reload();
  }, 1000);
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
      return uri + separator + key + "=" + value;
  }
}

function fileSelected(){
      let file = document.getElementById('userInput').files[0];
      const defaultFileUploadSize = Math.pow(1024,2)*600;
      let fileDisplay = `<h2>Selected File: ${file.name} </h2>`;
      if (file.size>defaultFileUploadSize){
        document.getElementById('fileError').innerHTML='<h3>Cannot be over 600MB</h3>'
        fileDisplay = '<h2>No File Selected!</h2>';
        document.getElementById('userInput').value='';
      }else{
        document.getElementById('fileError').innerHTML='';
      }
      document.getElementById('selectedFile').innerHTML = fileDisplay;


    }


document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('fileinput').addEventListener('change',fileSelected);
  setUpProgressBar();
});
