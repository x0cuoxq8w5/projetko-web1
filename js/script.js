function addSection() {
    const caixa = document.getElementById('addSBox');
    const overlay = document.getElementById('overlay');
    if(caixa.classList.contains('hidden')) {
        caixa.classList.replace('hidden', 'visible');
        overlay.classList.replace('hidden', 'visible');
    } else {
        window.alert('Uma seção já está sendo adicionada');
    }
}

function closeBoxes() {
    const caixa = document.getElementById('addSBox');
    const overlay = document.getElementById('overlay');
    caixa.classList.replace('visible', 'hidden');
    overlay.classList.replace('visible', 'hidden');
}

function addS() {
    const caixa = document.getElementById('addSBox');
    const overlay = document.getElementById('overlay');
    caixa.classList.replace('visible', 'hidden');
    overlay.classList.replace('visible', 'hidden');
    const sectionName = document.getElementById('SectionName').value;
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let section = {
        id : sections.length,
        name : sectionName
    }
    sections.push(section);
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function updateAll() {
    const sectionsDiv = document.getElementById('sections-div');
    const sections = JSON.parse(localStorage.getItem('sections')) || [];
    if(sections.length > 0){
        sectionsDiv.innerHTML = "";
        for(i in sections){
            let section = sections[i];
            const sectionDiv = document.createElement('div');
            const sectionName = document.createElement('h2');
            sectionName.innerHTML = section.name;
            sectionDiv.id = section.id;
            sectionDiv.className = 'section';
            sectionDiv.appendChild(sectionName);
            sectionsDiv.appendChild(sectionDiv);
        }
    }
}

document.getElementById("addSForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita qualquer ação de envio ou outra
    }
});