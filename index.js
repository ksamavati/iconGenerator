// Variables to hold references to HTML elements
const dropZone = document.getElementById("dropZone");
const iconsDisplay = document.getElementById("iconsDisplay");
const downloadBtn = document.getElementById("downloadBtn");

// Resolutions for the icons we want to generate
const resolutions = [16, 32, 48, 128];

// Drag and Drop Event Listeners
dropZone.addEventListener("dragover", (e) => {
	e.preventDefault();
	dropZone.style.backgroundColor = "#e9e9e9";
});

dropZone.addEventListener("dragleave", () => {
	dropZone.style.backgroundColor = "transparent";
});

dropZone.addEventListener("drop", (e) => {
	e.preventDefault();
	dropZone.style.backgroundColor = "transparent";

	// Get the files that were dragged
	let files = e.dataTransfer.files;
	if (files.length) {
		convertToIcons(files[0]);
	}
});

function convertToIcons(file) {
	const reader = new FileReader();

	reader.onload = function (event) {
		let img = new Image();
		img.src = event.target.result;

		img.onload = function () {
			iconsDisplay.innerHTML = ""; // Clear any previous icons

			resolutions.forEach((res) => {
				// Create a canvas to draw the resized image
				let canvas = document.createElement("canvas");
				canvas.width = res;
				canvas.height = res;
				let ctx = canvas.getContext("2d");

				// Apply smoother interpolation methods
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";

				// Check if the user has opted to crop the image to a circle
				if (document.getElementById("cropCircle").checked) {
					ctx.beginPath();
					ctx.arc(res / 2, res / 2, res / 2, 0, Math.PI * 2, false);
					ctx.clip();
				}

				ctx.drawImage(img, 0, 0, res, res);

				// Create an image element to display the resized image
				let iconImg = document.createElement("img");
				iconImg.src = canvas.toDataURL("image/png");

				let iconDiv = document.createElement("div");
				iconDiv.classList.add("icon");
				iconDiv.appendChild(iconImg);
				iconDiv.innerHTML += `<br>${res}x${res}`;

				iconsDisplay.appendChild(iconDiv);
			});
		};
	};

	reader.readAsDataURL(file);
}

downloadBtn.addEventListener("click", function () {
	let zip = new JSZip();
	const icons = document.querySelectorAll(".icons img");

	icons.forEach((icon, index) => {
		let imgData = icon.src.split(",")[1];
		let fileName = `icon${resolutions[index]}.png`;
		zip.file(fileName, imgData, { base64: true });
	});

	zip.generateAsync({ type: "blob" }).then(function (blob) {
		let link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "icons.zip";
		link.click();
	});
});
