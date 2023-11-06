const draggableDiv = document.querySelector(".selectedRoll");

d3.select(draggableDiv).call(
  d3
    .drag()
    .on("start", (event) => {
      const initialXCoordinate = event.x;
      const initialYCoordinate = event.y;
      console.log("selection start - x1:", initialXCoordinate);
      const n = document.querySelector(".selectedSvg");
    })
    .on("drag", (event) => {
      const currentX = parseFloat(draggableDiv.style.left) || 0;
      const currentY = parseFloat(draggableDiv.style.top) || 0;
      draggableDiv.style.left = `${currentX + event.dx}px`;
      draggableDiv.style.top = `${currentY + event.dy}px`;
    })
    .on("end", (event) => {
      console.log("selection end - x2:", event.x);
    })
);
