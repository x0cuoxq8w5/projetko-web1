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
    
}

function updateAll() {
    
}

document.getElementById("addSForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita qualquer ação de envio ou outra
    }
});