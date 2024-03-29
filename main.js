const elementsWithSkeletonClass = document.querySelectorAll('.skeleton');

function fetchAndProcessData(url, processDataCallback) {
  setTimeout(() => {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      processDataCallback(xml);
    })
    .catch(console.error)
    .finally(function () {
      elementsWithSkeletonClass.forEach(function (element) {
          element.classList.remove('skeleton');
      });
  });  
});
}

function updateDriverStandings(xml) {
  let text = "";
  let totalDrivers = xml.querySelector('MRData').getAttribute('total');
  for (let i = 0; i < totalDrivers; i++) {
    text += `<tr><td class=${xml.querySelectorAll('Name')[i].textContent.replace(/\s+/g, '-').toLowerCase()}></td><td>${i + 1}</td><td>${xml.querySelectorAll('GivenName')[i].textContent} ${xml.querySelectorAll('FamilyName')[i].textContent}</td><td>${xml.querySelectorAll('DriverStanding')[i].getAttribute('points')}</td></tr>`;
  }
  const standingsListElement = xml.querySelector("StandingsList");
  const round = `<span>Season: ${standingsListElement.getAttribute('season')}</span><span>Round: ${standingsListElement.getAttribute('round')}</span>`;
  document.getElementById("driverlist").innerHTML = text;
  document.getElementById("round").innerHTML = round;
  document.getElementById("leader").innerHTML = xml.querySelectorAll('GivenName')[0].textContent + " " + xml.querySelectorAll('FamilyName')[0].textContent;
  document.getElementById("team").innerHTML = xml.querySelectorAll('Name')[0].textContent;
  
}

function updateConstructorStandings(xml) {
  let text = "";
  let totalConstructors = xml.querySelector('MRData').getAttribute('total');
  for (let i = 0; i < totalConstructors; i++) {
    text += `<tr><td class=${xml.querySelectorAll('Name')[i].textContent.replace(/\s+/g, '-').toLowerCase()}></td><td>${i + 1}</td><td>${xml.querySelectorAll('Name')[i].textContent}</td><td>${xml.querySelectorAll('ConstructorStanding')[i].getAttribute('points')}</td></tr>`;
  }
  document.getElementById("constructorlist").innerHTML = text;
}

function updateCurrentRound(xml) {
  let listelement = xml.querySelector("StandingsList");
  let currentRound = listelement.getAttribute('round');
  updateNextRace(currentRound);
}

function lastSunday(month) {
  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, month, 1, 12);
  let weekday = date.getDay();
  let dayDiff = weekday === 0 ? 7 : weekday;
  let lastSunday = date.setDate(date.getDate() - dayDiff);
  return new Date(lastSunday).toDateString();
}

function updateNextRace(i) {
  fetch("https://ergast.com/api/f1/current")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const race = xml.querySelectorAll("Race")[i];

      if (race === undefined) {
        document.getElementById("nextrace").innerHTML = 'End of season';
        document.getElementById("coma").innerHTML = '';
      } else {
        const year = new Date().getFullYear();
        const inputDate = race.querySelectorAll("Date")[0].textContent.replace(`${year}-`, "");
        const [month, day] = inputDate.split('-');
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const abbreviatedMonth = monthNames[parseInt(month) - 1];
        const raceDate = new Date(race.querySelectorAll("Date")[0].textContent.replace())
        const inputValue = race.querySelectorAll("Time")[0].textContent.replace(":00Z", "");
        const [hours, minutes] = inputValue.split(":").map(Number);
        const formattedMinutes = String(minutes).padStart(2, "0");

        if (raceDate > new Date(lastSunday(3)) && raceDate < new Date(lastSunday(10))) {
          const time = (hours + 2 + ":" + formattedMinutes);
          document.getElementById("time").innerHTML = time;
        } else {
          const time = (hours + 1 + ":" + formattedMinutes);
          document.getElementById("time").innerHTML = time;
        }

        const racename = xml.querySelectorAll("RaceName")[i].textContent;
        const location = xml.querySelectorAll("Country")[i].textContent;
        document.getElementById("nextrace").innerHTML = racename;
        document.getElementById("month").innerHTML = abbreviatedMonth;
        document.getElementById("day").innerHTML = day;
        document.getElementById("location").innerHTML = location;
      }
    })
}

function toggleList(listType) {
  const constructorStandings = document.getElementById('constructors');
  const driverStandings = document.getElementById('drivers');
  const driverTab = document.getElementById('drivertab');
  const constructorTab = document.getElementById('constructortab');

  if (listType === 'constructor') {
    constructorStandings.style.display = 'block';
    driverStandings.style.display = 'none';

    driverTab.classList.remove('active');
    constructorTab.classList.add('active');
  } else if (listType === 'driver') {
    constructorStandings.style.display = 'none';
    driverStandings.style.display = 'block';

    driverTab.classList.add('active');
    constructorTab.classList.remove('active');
  }
}

fetchAndProcessData("https://ergast.com/api/f1/current/driverStandings", function(xml) {
    updateDriverStandings(xml);
    updateCurrentRound(xml);
});

window.addEventListener("load", function(){
  fetchAndProcessData("https://ergast.com/api/f1/current/constructorStandings", updateConstructorStandings);
})