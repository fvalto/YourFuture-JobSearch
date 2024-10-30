export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

export async function renderTemplate(partialFileName, parentElement, position = 'afterbegin') {
    const template = await getTemplate(partialFileName);
    parentElement.innerHTML = '';
    parentElement.insertAdjacentHTML(position, template);
}

export async function loadHeaderFooter() {
    await renderTemplate('header.html', qs('#header'));
    await renderTemplate('footer.html', qs('#footer'));
}

async function getTemplate(fileName) {
    const path = `templates/${fileName}`;
    return await fetch(path).then((data) => data.text());
}

export async function getJobs(position = "developer") {
    const url = `https://data.usajobs.gov/api/Search?PositionTitle=${position}`;
    const apiKey = "WWhlpLnBlTlNZnfUtfTTOOedsQkbThEjvuZ7sd/W0NE=";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Response was not ok');
        }

        const data = await response.json();

        const jobArray = Array.isArray(data.SearchResult.SearchResultItems) ? data.SearchResult.SearchResultItems : [];

        return jobArray;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return [];
    }
}

export function getPosition() {
    const positionInput = qs("#position-input");
    positionInput.addEventListener("change", async function () {
        let positionValue = positionInput.value;
        const jobs = await getJobs(positionValue);
        showResults(jobs);
    });
}

export function showResults(jobArray) {
    const resultsDiv = qs("#results");
    resultsDiv.innerHTML = '';

    jobArray.forEach(job => {
        let template = 
        `<div class="job-card">
          <h3 class="job-title">${job.MatchedObjectDescriptor.PositionTitle}</h3>
          <p class="company-name">${job.MatchedObjectDescriptor.OrganizationName}</p>
          <p class="location">Location: ${job.MatchedObjectDescriptor.PositionLocationDisplay}</p>
          <button type="button" class="city-button" id="${job.MatchedObjectDescriptor.PositionLocationDisplay.split(',')[0]}">Get City Information</button>
          <p class="qualifications">${job.MatchedObjectDescriptor.QualificationSummary}</p>
          <a href="${job.MatchedObjectDescriptor.PositionURI}" class="apply-button">Apply Now</a>
        </div>`;

        resultsDiv.innerHTML += template;
    });

    const cityButtons = resultsDiv.querySelectorAll('.city-button');
    cityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cityName = button.id;
            getCityData(cityName);
        });
    });
}

async function getCityData(city) {
    const url = `https://api.api-ninjas.com/v1/city?name=${city}&country=US`;
    const options = {
        method: 'GET',
        headers: {
            'x-api-key': '0+TJvcQcf3i52szV3xdHvA==BUp4uG96Q1aJlE0S'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        displayCityDetails(result);
    } catch (error) {
        console.error(error);
    }
}

function displayCityDetails(cityData) {
    const cityOverlay = document.getElementById("city-overlay");
    cityOverlay.innerHTML = '';

    const closeButton = `<span class='card-close'>❌</span>`;

    if (cityData.length > 0) {
        let template = 
            `<div class="city-card">
              ${closeButton}
              <h3 class="city-name">${cityData[0].name}</h3>
              <p class="state">State: ${cityData[0].region}</p>
              <p class="latitude">Latitude: ${cityData[0].latitude}</p>
              <p class="longitude">Longitude: ${cityData[0].longitude}</p>
              <p class="population">Population: ${cityData[0].population}</p>
            </div>`;
        cityOverlay.innerHTML += template;
    } else {
        let noDataTemplate = 
            `<div class="city-card">
              ${closeButton}
              <p>No city data found.</p>
            </div>`;
        cityOverlay.innerHTML += noDataTemplate;
    }

    cityOverlay.style.display = 'flex';

    const cardCloseButton = cityOverlay.querySelector('.card-close');
    cardCloseButton.addEventListener('click', () => {
        cityOverlay.style.display = 'none';
    });
}