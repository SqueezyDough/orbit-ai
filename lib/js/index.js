// planets are in your orbit, satellites are in a planets orbit
// orbit => planet => satellite

// Set number of milliseconds for longpress
let longpress = 300;

// get all planets in orbit
let planets = document.getElementsByClassName("planet");

// add event listener for all planets
for (var i = 0; i < planets.length; i++) {
    planets[i].addEventListener("touchstart", function() {
		let planet = this;

		// pause planet's trajectory for the duration of the event
		planet.parentElement.classList.add("pause-trajectory");

		// scale planet
		planet.classList.add("scout-planet");

		// disable context menu for this event
		window.oncontextmenu = function() { return false; };

		// set a small timeout so we don't make this request on just a normal click event
		setTimeout(() => {
			// create new xhr request
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					// if response is OK, save the amount of satellites in orbit
					let satellitesInOrbit = this.responseText;

					// for every satellite, create a satellite element in the DOM
					for (let i = 1; i <= satellitesInOrbit; i++) {
						let satellite = document.createElement("div");
						satellite.classList.add(`satellite--${i}`);
						planet.appendChild(satellite);
					}
				}
			};

			// xhr url depends on which page you are making the request.
			if (planet.getAttribute("url")) {
				xhr.open("POST", `scout/${planet.getAttribute("data-id")}`, true);
			} else {
				xhr.open("POST", `../scout/${planet.getAttribute("data-id")}`, true);
			}

			xhr.send();
		}, longpress);
	}, false);

	// undo everything for the touchstart event
	planets[i].addEventListener("touchend", function() {
		let planet = this;

		// remove scout animations and add new leave animations
		planet.parentElement.classList.remove("pause-trajectory");
		planet.classList.remove("scout-planet");
		planet.classList.add("leave-planet");
		let satellites = planet.querySelectorAll("div");

		for (let i = 0; i < satellites.length; i++) {
			satellites[i].classList.add("hide-satellite");
		}

		// set timeout so animation has time to complete
		setTimeout(() => {
			planet.innerHTML = "";
		}, 500);

		// enable context menu again
		window.oncontextmenu = function() { return true; };
	}, false);
}