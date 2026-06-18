console.log("LINKEDIN JS LOADED");


chrome.runtime.onMessage.addListener(

async message=>{

if(message.type==="FILL_LINKEDIN_POST"){

console.log("FILLING POST");


const opened =
await openPostModal();


if(!opened){

console.log("Cannot open modal");
return;
}


const inserted =
await fillPost(
message.post
);


if(!inserted){

console.log(

"Post insertion failed"

);

return;

}


console.log(

"Post inserted"

);


await uploadImages(message.screenshots);
console.log("Images uploaded");

await sleep(3000);
const root =
document.querySelector(
'[data-testid="interop-shadowdom"]'
);
const nextBtn =
root?.shadowRoot?.querySelector(
'button[aria-label="Next"]'
);

console.log("NEXT BTN =", nextBtn);

if(nextBtn){

nextBtn.click();

console.log("Clicked next");

}
}

}

);



async function openPostModal(){


const btn =document.querySelector('[aria-label="Start a post"]');


if(!btn){

console.log("No start button");

return false;

}


btn.click();


await sleep(3000);
return true;

}



async function fillPost(post){

for(let i=0;i<20;i++){

const root =document.querySelector('[data-testid="interop-shadowdom"]');
if(root){

const editor =root.shadowRoot.querySelector('.ql-editor');
if(editor){

// console.log("POST RECEIVED");
// console.log(post);

// console.log(post?.length);
editor.focus();

// console.log(editor.innerHTML);
editor.textContent =post;

editor.innerHTML =
post
.split("\n")
.map(line => `<p>${line || "<br>"}</p>`)
.join("");

// console.log("After insertion:");

// console.log(editor.innerHTML);

editor.dispatchEvent(

new InputEvent(

"input",

{
bubbles:true
}

)

);

await sleep(1000);

console.log(

"After 1 sec"

);

console.log(

editor.innerHTML

);



editor.dispatchEvent(

new Event(

"change",

{

bubbles:true

}

)

);



return true;

}

}


await sleep(500);

}


return false;

}



async function uploadImages(

screenshots

){


const root =

document.querySelector(

'[data-testid="interop-shadowdom"]'

);



const mediaBtn =

root.shadowRoot.querySelector(

'button[aria-label="Add media"]'

);



mediaBtn.click();


console.log(
"Media clicked"
);



let fileInput =null;



for(let i=0;i<20;i++){

fileInput =

root.shadowRoot.querySelector(

'input[type="file"]'

);


if(fileInput){

break;

}


await sleep(500);

}



if(!fileInput){

console.log("No file input");

return;

}



console.log("Input found");



const dt =new DataTransfer();



for(let i=0;i<screenshots.length;i++){


const file =dataURLtoFile(

screenshots[i],

`shot${i}.png`

);



dt.items.add(

file

);


}



fileInput.files =

dt.files;



fileInput.dispatchEvent(

new Event(

"input",

{

bubbles:true

}

)

);



fileInput.dispatchEvent(

new Event(

"change",

{

bubbles:true

}

)

);



fileInput.dispatchEvent(

new Event(

"blur",

{

bubbles:true

}

)

);



fileInput.dispatchEvent(

new Event(

"focus",

{

bubbles:true

}

)

);



console.log(

"Images uploaded"

);

}



function dataURLtoFile(

dataurl,

filename

){

const arr =

dataurl.split(",");


const mime =

arr[0]

.match(

/:(.*?);/

)[1];


const bstr =

atob(
arr[1]

);


let n =

bstr.length;


const u8arr =

new Uint8Array(

n

);


while(

n--

){

u8arr[n] =

bstr.charCodeAt(

n

);

}


return new File(

[u8arr],

filename,

{

type:mime

}

);

}



function sleep(ms){

return new Promise(

resolve=>

setTimeout(

resolve,

ms

)

);

}