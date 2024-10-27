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
    renderVisits();
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

        // Access the correct path for SearchResultItems
        const jobArray = Array.isArray(data.SearchResult.SearchResultItems) ? data.SearchResult.SearchResultItems : [];

        return jobArray;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return [];
    }
}

export function getSkills() {
    document.getElementById('searchButton').addEventListener('click', async () => {
        const skillUuid = "2c77c703bd66e104c78b1392c3203362"; // Replace this with dynamic UUID lookup based on user input
        const apiUrl = `/path/to/api/v1/skills/${skillUuid}/related_jobs`;

        try {
            const response = await fetch(apiUrl);
            if (response.status === 200) {
                const data = await response.json();
                displayJobs(data.jobs);
            } else {
                document.getElementById('results').innerText = 'No jobs found for this skill.';
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    });
    
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
          <p class="qualifications">${job.MatchedObjectDescriptor.QualificationSummary}</p>
          <a href="${job.MatchedObjectDescriptor.PositionURI}" class="apply-button">Apply Now</a>
        </div>`;

        resultsDiv.innerHTML += template;
    });
}

export function renderVisits() {
    const visitsDisplay = document.querySelector("#pagevisits");
    let numVisits = Number(window.localStorage.getItem("numVisits-ls")) || 0;
    if (numVisits !== 0) {
        visitsDisplay.textContent = numVisits;
    } else {
        visitsDisplay.textContent = `This is your first visit. 😉😎 Welcome! 👌`;
    }
    numVisits++;
    localStorage.setItem("numVisits-ls", numVisits);
}