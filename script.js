const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImag = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");
//global vriables with default value
let prevMouseX,
  prevouseY,
  snapshot,
  isDrawing = false;
(selectedTool = "brush"), (brushWidth = 5), (selectedColor = "#000");

const setCanvasBackground=()=>{
  //setting whole canvas background to white, so the download img background will be white 
ctx.fillStyle="#fff";
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle=selectedColor;//setting fillstyle back to the selectedcolor,it'll be the brush color 
}

window.addEventListener("load", () => {
  //seting canvas width/height.. offsetwidth/height returns viewable width of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});
const drawRect = (e) => {
  //if fillColor isn't checked draw a rect with border else draw rect with background
  if (!fillColor.checked) {
    //creating circle acording to the  mouse pointer
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); //creting new path to draw circle
  //getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //creating circle according to the pointer
  fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is circle else draw border circle
};

const drawTriangle = (e) => {
  ctx.beginPath(); //creting new path to draw circle
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); //creating first according to the mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
  ctx.closePath(); //closing path of a triangle so the draw automatically
  fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fill triangle else draw border
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passin current mouseX position as prevMouseX value
  prevMouseY = e.offsetY; //passin current mouseY position as prevMouesy value
  ctx.beginPath(); //creating new path to draw
  ctx.lineWidth = brushWidth; //passing brushSize as line width
  ctx.strokeStyle = selectedColor; //passing selectedColor as stroke style
  ctx.fillStyle = selectedColor; //passing selectedColor as fill style

  //copying canvas data & passing as snapshot value .. this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return; //if isDrowing is false returns here
  ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas

  if (selectedTool === "brush" || selectedTool === "eraser") {
    //if selected tool is eraser than set strokeStyle to while
    //to pain white color on the existing content else set the stroke color to selected color
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); //creating line according to the pointer
    ctx.stroke(); //drawing/filing line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    //adding click event to all tool option
    //removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); //passing slider value as brushSize

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    //adding click to all color button
    //removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    //Passing selected btn background color as selectedColor value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  //passing picked color value from color picker to last color btn background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
  setCanvasBackground();
});
saveImag.addEventListener("click", () => {
   const link= document.createElement("a");//create <a> element
   link.download=`${Date.now()}.jpg`;//passing current data as link download value
   link.href=canvas.toDataURL();//passing canvasData as link href value 
   link.click();//clicking link to download imge
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));

//29:59
//33:05
//46:27
