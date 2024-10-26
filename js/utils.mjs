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

        // Access the correct path for SearchResultItems
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
          <p class="qualifications">${job.MatchedObjectDescriptor.QualificationSummary}</p>
          <a href="${job.MatchedObjectDescriptor.PositionURI}" class="apply-button">Apply Now</a>
        </div>`;

        resultsDiv.innerHTML += template;
    });
}