export function qs(selector, parent=document) {
    return parent.querySelector(selector);
}

export async function renderTemplate(partialFileName, parentElement, position='afterbegin'){
    const template = await getTemplate(partialFileName);
    parentElement.innerHTML='';
    parentElement.insertAdjacentHTML(position, template);
}

export async  function loadHeaderFooter(){
    renderTemplate('header.html',qs('#header'));
    renderTemplate('footer.html',qs('#footer'));
}

async function getTemplate(fileName) {
    const path = `templates/${fileName}`;
    return await fetch(path).then((data) => data.text());
}