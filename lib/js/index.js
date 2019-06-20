// Set number of milliseconds for longpress
let longpress = 500;

let planets = document.getElementsByClassName("planet");

for (var i = 0; i < planets.length; i++) {
    planets[i].addEventListener("touchstart", function() {
		let planet = this;
		planet.parentElement.classList.add("pause-trajectory");
		planet.classList.add("scout-planet");

		setTimeout(() => {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					let satellitesInOrbit = this.responseText;

					for (let i = 1; i <= satellitesInOrbit; i++) {
						let satellite = document.createElement("div");
						satellite.classList.add(`satellite--${i}`);
						planet.appendChild(satellite);
					}
				}
			};

			if (planet.getAttribute("url")) {
				xhr.open("POST", `scout/${planet.getAttribute("data-id")}`, true);
			} else {
				xhr.open("POST", `../scout/${planet.getAttribute("data-id")}`, true);
			}

			xhr.send();
		}, longpress);
	}, false);

	planets[i].addEventListener("touchend", function() {
		let planet = this;

		planet.parentElement.classList.remove("pause-trajectory");
		planet.classList.remove("scout-planet");
		planet.classList.add("leave-planet");
		let satellites = planet.querySelectorAll("div");

		for (let i = 0; i < satellites.length; i++) {
			satellites[i].classList.add("hide-satellite");
		}

		setTimeout(() => {
			planet.innerHTML = "";
		}, 500);
	}, false);
}