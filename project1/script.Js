function changeText(){
    const myText1 = document.getElementById("myText1");
   myText1.innerHTML = "it works";
    const myText2 = document.getElementById("myText2");
    myText2.innerHTML = "It works 2";
    const myinput = document.getElementById("myinput");
        document.body.style.backgroundColor = myinput.value;
}
function changecolor(){
    const myinput2 = document.getElementById("myinput2");
    const color = myinput2.value;
    const myText2 = document.getElementById("myText2");
   myText2.innerHTML = color;
   myText2.style.color = color;
}
function changeColorRandom(){
    const myText1 = document.getElementById("myText1");
    myText1.style.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    document.body.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}
setInterval(changeColorRandom, 100);