let width = Math.floor((window.innerWidth - 60) / 14);
let height = Math.floor((window.innerHeight - 90) /14);
// console.log(width, height);

let horizontalTotal = height;
let verticalTotal = width;

let playing = false;

let grid = new Array(verticalTotal);
let nextGrid = new Array(verticalTotal);

let timer;
let reproductionTime = 300;

function initialize() { 												// intialize
	createTable();
	setupControlButtons();
	initializeGrids();
	resetGrids();
}

function createTable() {												// creating the table
	let gridContainer = document.getElementById('gridContainer');
	if (!gridContainer) {												// throw error
		console.error("gridContainer does not exist");
	}												
	let table = document.createElement("table");
	for (var h = 0; h < horizontalTotal; h++) {
		let tr = document.createElement("tr");
		for (var v = 0; v < verticalTotal; v++) {
			let cell = document.createElement("td");
			cell.setAttribute("id", h + "_" + v);
			cell.setAttribute("class", "dead");
			cell.onclick = cellClickHandler;
			tr.appendChild(cell);
		}
		table.appendChild(tr);
	}
	gridContainer.appendChild(table)
}

function cellClickHandler() {											// the click on any cell
	let coordinates = this.id.split("_");
	let x = coordinates[0];
	let y = coordinates[1];
	let classes = this.getAttribute("class");
	if (classes.indexOf("live") > -1) {
		this.setAttribute("class", "dead");
		grid[x][y] = 0;
	} else {
		this.setAttribute("class", "live");
		grid[x][y] = 1;
	}
}

function setupControlButtons() {										
	let startButton = document.getElementById("start");					// start button setup
	startButton.onclick = startButtonHandler;
	let clearButton = document.getElementById("clear");					// clear button setup
	clearButton.onclick = clearButtonHandler;						
	let randomButton = document.getElementById("random");				// random button setup
	randomButton.onclick = randomButtonHandler;							
}

function clearButtonHandler() {											// clear button functionality
	console.log("cleared");
	playing = false;
	let startButton = document.getElementById("start");
	startButton.innerHTML = "start";
	clearTimeout(timer);
	for (let h = 0; h < horizontalTotal; h++) {
		for (let v = 0; v < verticalTotal; v++) {
			cell = document.getElementById(h + "_" + v);
			cell.setAttribute("class", "dead")
		}
	}
	resetGrids();
}

function startButtonHandler() {											// start button functionality
	if (playing) {
		console.log("paused");
		playing = false;
		this.innerHTML = "continue";
		clearTimeout(timer);
	} else {
		console.log("playing");
		playing = true;
		this.innerHTML = "pause";
		play();
	}
}

function randomButtonHandler() {										// random button functionality
	if (playing) return;
	clearButtonHandler();
	for (let h = 0; h < horizontalTotal; h++) {
		for (let v = 0; v < verticalTotal; v++) {
			cell = document.getElementById(h + "_" + v);
			let random = Math.round(Math.random());
			if (random == 1) {
					cell.setAttribute("class", "live");
					grid[h][v] = 1;
			}
		}
	}									
}

function play() {
	computeNextGen();
	if (playing) {
		timer = setTimeout(play, reproductionTime);
	} 
}

function initializeGrids() {
	for (let h = 0; h < horizontalTotal; h++) {
		grid[h] = new Array(verticalTotal);
		nextGrid[h] = new Array(verticalTotal);	
	}
}

function resetGrids() {
	for (let h = 0; h < horizontalTotal; h++) {
		for (let v = 0; v < verticalTotal; v++) {
			grid[h][v] = 0;
			nextGrid[h][v] = 0;
		}
	}
}

function computeNextGen() {
	for (let h = 0; h < horizontalTotal; h++) {
		for (let v = 0; v < verticalTotal; v++) {
			applyRules(h, v);
		}
	}
	copyAndResetGrid();
	updateView();
}

function applyRules(horizontal, vertical) {
	let numNeighbors = countNeighbors(horizontal, vertical);
	// console.log("grid", horizontal, vertical, numNeighbors);
	if (grid[horizontal][vertical] == 1) {							//STANDARD RULES
		if (numNeighbors < 2) {
			nextGrid[horizontal][vertical] = 0;
		} else if (numNeighbors == 2 || numNeighbors == 3) {
			nextGrid[horizontal][vertical] = 1;
		} else if (numNeighbors > 3) {
			nextGrid[horizontal][vertical] = 0;
		}
	} else if (grid[horizontal][vertical] == 0) {
		if (numNeighbors == 3) {
			nextGrid[horizontal][vertical] = 1;
		}
	}



	// if (grid[horizontal][vertical] == 1) {							//DAY AND NIGHT RULES
	// 	if (numNeighbors == 3 || numNeighbors == 4 || numNeighbors > 5) {
	// 		nextGrid[horizontal][vertical] = 1;
	// 	} else { 
	// 		nextGrid[horizontal][vertical] = 0;
	// 	}
	// } else {
	// 	if (numNeighbors == 3 || numNeighbors > 5) {
	// 		nextGrid[horizontal][vertical] = 1;
	// 	}
	// }


}

function countNeighbors(horizontal, vertical) {
	let count = 0;
	if (horizontal - 1 >= 0) {											//checking the above cell
		if (grid[horizontal - 1][vertical] == 1) {
			count++;
		}
	}
	if (horizontal - 1 >= 0 && vertical - 1 >= 0) {						//checking the above left cell
		if (grid[horizontal - 1][vertical - 1] == 1) {
			count++;
		}
	}
	if (horizontal - 1 >= 0 && vertical + 1 < verticalTotal) {			//checking the above right cell
		if (grid[horizontal - 1][vertical + 1] == 1) {
			count++;
		}
	}
	if (vertical - 1 >= 0) {											//checking the left cell
		if (grid[horizontal][vertical - 1] == 1) {						
			count++;
		}
	}
	if (vertical + 1 < verticalTotal) {									//checking the right cell
		if (grid[horizontal][vertical + 1] == 1) {
			count++;
		}
 	}
 	if (horizontal + 1 < horizontalTotal) {								//checking below cell
 		if (grid[horizontal + 1][vertical] == 1) {
 			count++;
 		}
 	}
 	if (horizontal + 1 < horizontalTotal && vertical - 1 >= 0) {		// checking below left cell
 		if (grid[horizontal + 1][vertical - 1] == 1) {
 			count++;
 		}
 	}
 	if (horizontal + 1 < horizontalTotal && vertical + 1 < verticalTotal) {		//checking below right cell
 		if (grid[horizontal + 1][vertical + 1] == 1) {
 			count++;
 		}
 	}
 	return count;
}

function copyAndResetGrid() {
	for (let h = 0; h < horizontalTotal; h++) {
		for (let v = 0; v < verticalTotal; v++) {
			grid[h][v] = nextGrid[h][v];
			nextGrid[h][v] = 0;
		}
	}
}

function updateView() {
	for (let h = 0; h < horizontalTotal; h++) {
		for (let v = 0; v < verticalTotal; v++) {
			let cell = document.getElementById(h + "_" + v)
			if (grid[h][v] == 0) {
				cell.setAttribute("class", "dead");
			} else {
				cell.setAttribute("class", "live");
			}
		}
	}
}

window.onload = initialize;												//start everything


















