var d = new Date();
var DoW = ["sunday", "monday", " tuesday", " wednesday" ," thursday" , "friday", "saturday"]
var day = DoW[d.getDay()];
var date = d.getDate();
var MoY =[" january", "febuary","march","april","may","June","july","august","september","october","november"+"december"]
var month = MoY[d.getMonth()];
var year = d.getFullYear();
document.getElementById('today').innerHTML = day + " " + date + ", " +month +" "+year

let clock = document.getElementById("time");
clock.innerHTML = date.getHours;
// setInterval(function(){
//    clock.innerHTML = date.toLocaleTimeString();
// },1000)
// var d = new Date(); // for now
// console.log(d.getHours()); // => 9
// console.log(d.getMinutes()); // =>  30
// d.getSeconds(); // => 51