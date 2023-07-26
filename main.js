fetch("https://ergast.com/api/f1/2023/driverStandings")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    console.log(xml);
    console.log(xml.getElementsByTagName('givenName')[0]);
  })
  .catch(console.error);