function fetchAndProcessData(url, processDataCallback) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      processDataCallback(xml);
    })
    .catch(console.error);
}

function updateDriverStandings(xml) {
  let text = "";
  for (let i = 0; i < 21; i++) {
    text += `<tr><td>${i + 1}</td><td>${xml.querySelectorAll('GivenName')[i].textContent} ${xml.querySelectorAll('FamilyName')[i].textContent}</td><td>${xml.querySelectorAll('DriverStanding')[i].getAttribute('points')}</td></tr>`;
  }
  const standingsListElement = xml.querySelector("StandingsList");
  const round = `<span>Season: ${standingsListElement.getAttribute('season')}</span><span>Round: ${standingsListElement.getAttribute('round')}</span>`;
  document.getElementById("driverlist").innerHTML = text;
  document.getElementById("round").innerHTML = round;
  console.log(xml)
}

function updateConstructorStandings(xml) {
  let text = "";
  for (let i = 0; i < 10; i++) {
    text += `<tr><td>${i + 1}</td><td>${xml.querySelectorAll('Name')[i].textContent}</td><td>${xml.querySelectorAll('ConstructorStanding')[i].getAttribute('points')}</td></tr>`;
  }
  document.getElementById("constructorlist").innerHTML = text;
  console.log(xml)
}

function updateCurrentRound(xml) {
  let listelement = xml.querySelector("StandingsList");
  let currentRound = listelement.getAttribute('round');
  updateNextRace(currentRound);
}

function updateNextRace(i) {
  fetch("https://ergast.com/api/f1/current")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    console.log(xml);

    const race = xml.querySelectorAll("Race")[i];
    console.log(race);
    const year = new Date().getFullYear();
    const date = race.querySelectorAll("Date")[0].textContent.replace(`${year}-`, "");
    const inputValue = race.querySelectorAll("Time")[0].textContent.replace(":00Z", "");
    const [hours, minutes] = inputValue.split(":").map(Number);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const time = (hours + 2 + ":" + formattedMinutes);
    const racename = xml.querySelectorAll("RaceName")[i].textContent;
    const location = xml.querySelectorAll("Country")[i].textContent;
    document.getElementById("nextrace").innerHTML = racename;
    document.getElementById("date").innerHTML = date;
    document.getElementById("time").innerHTML = time;
    document.getElementById("location").innerHTML = location;
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

fetchAndProcessData("https://ergast.com/api/f1/current/driverStandings", updateDriverStandings);
fetchAndProcessData("https://ergast.com/api/f1/current/constructorStandings", updateConstructorStandings);
fetchAndProcessData("https://ergast.com/api/f1/current/driverStandings", updateCurrentRound);