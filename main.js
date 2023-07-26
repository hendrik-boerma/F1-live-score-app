fetch("https://ergast.com/api/f1/2023/driverStandings")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    console.log(xml);

    let text = "";
    for (let i=0; i < 21; i++){
        text += "<li>" + (i + 1) + ". " + xml.querySelectorAll('GivenName')[i].textContent + " " + xml.querySelectorAll('FamilyName')[i].textContent + "</li>"; 
    }
    document.getElementById("demo").innerHTML = text;
  })
  .catch(console.error);