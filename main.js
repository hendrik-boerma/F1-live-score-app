fetch("https://ergast.com/api/f1/2023/driverStandings")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    console.log(xml);

    let text = "";
    for (let i=0; i < 21; i++){
        text += "<tr><td>" + (i + 1) + "</td><td>" + xml.querySelectorAll('GivenName')[i].textContent + " " + xml.querySelectorAll('FamilyName')[i].textContent + "</td><td>" + xml.querySelectorAll('DriverStanding')[i].getAttribute('points') + "</td></tr>"; 
    }
    document.getElementById("driverlist").innerHTML = text;
  })
  .catch(console.error);


  fetch("https://ergast.com/api/f1/2023/constructorStandings")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    console.log(xml);

    let text = "";
    for (let i=0; i < 10; i++){
        text += "<tr><td>" + (i + 1) + "</td><td>" + xml.querySelectorAll('Name')[i].textContent + "</td><td>" + xml.querySelectorAll('ConstructorStanding')[i].getAttribute('points') + "</td></tr>"; 
    }
    document.getElementById("constructorlist").innerHTML = text;
  })
  .catch(console.error);


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