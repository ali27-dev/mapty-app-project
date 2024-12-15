'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPlace();
  }

  calcPlace() {
    this.place = this.duration / this.distance;
    return this.place;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const run1 = new Running([23, -67], 5.2, 24, 167);
const cycling1 = new Cycling([23, -67], 5.2, 24, 167);
console.log(run1, cycling1);

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkOut.bind(this));

    inputType.addEventListener('change', this._toggleElevation);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not found your location');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(
      `https://google.com/maps/place/Ningolai+Village,+Swat,+Khyber+Pakhtunkhwa,+Pakistan/@${latitude},${longitude}`
    );

    const coords = [latitude, longitude];

    // console.log(this);

    this.#map = L.map('map').setView(coords, 11);
    console.log(this.#map);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleElevation() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkOut(e) {
    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));

    const allPositiveNum = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //Get data from Form
    const type = +inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if workot running,create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInput(distance, duration, cadence) ||
        !allPositiveNum(distance, duration, cadence)
      )
        return alert('Input have to be positive number!');

      Workout = new Running([lat, lng], distance, duration, cadence);
    }
    // if workot cycling,create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInput(distance, duration, elevation) ||
        !allPositiveNum(distance, duration)
      );

      return alert('Input have to be positive number!');

      Workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('workout')
      .openPopup();

    // Render workout on list

    // Hide form + clear input files

    // clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }
}

const app = new App();
// App._getPosition()
