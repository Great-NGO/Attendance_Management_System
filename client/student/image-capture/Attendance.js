async function getWebCam(){
    try{
        const videoSrc = await navigator.mediaDevices.getUserMedia({video:true});
        var video = document.getElementById('video');
        video.srcObject= videoSrc;
    }catch(e){
        console.log(e);
    }
}
var capture = document.getElementById('capture')
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
capture.addEventListener('click', function(){
    context.drawImage(video,0,0,600,480)
});

function next(){
    document.getElementById('anchor').setAttribute("href","CapturePage.html");
   
}

getWebCam();


var d = new Date();
var DoW = ["sunday", "monday", " tuesday", " wednesday" ," thursday" , "friday", "saturday"];
var day = DoW[d.getDay()];
var date = d.getDate();
var MoY =[" january", "febuary","march","april","may","June","july","august","september","october","november"+"december"];
var month = MoY[d.getMonth()];
var year = d.getFullYear();
document.getElementById('today').innerHTML = day + " " + date + ", " +month +" "+year;

let clock = document.getElementById("time");
setInterval(function(){
   let date = new Date();
   clock.innerHTML = date.toLocaleTimeString();
},1000);