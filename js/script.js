const overlay = document.getElementById('overlay');

function addSection() {
    const caixa = document.getElementById('addSBox');
    if(caixa.classList.contains('hidden')) {
        caixa.classList.replace('hidden', 'visible');
        overlay.classList.replace('hidden', 'visible');
    } else {
        window.alert('Uma seção já está sendo adicionada');
    }
}

function closeBoxes() {
    const caixas = document.getElementsByClassName('box');
    for (c in caixas){
        let caixa = caixas[c];
        if(caixa.classList.contains('visible')){
            hideBox(caixa);
            break;
        }
    }
}

function addS() {
    hideBox(document.getElementById('addSBox'));
    const sectionName = document.getElementById('SectionName').value;
    if(sectionName.trim() == "" || sectionName == null){
        window.alert('Nome inválido!');
        return;
    }
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let section = {
        id : sections.length,
        name : sectionName,
        cards : []
    }
    sections.push(section);
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function addC(sectionId) {
    hideBox(document.getElementById('addCBox'));
    const cardName = document.getElementById('CardName').value;
    if(cardName.trim() == "" || cardName == null){
        window.alert('Nome inválido!');
        return;
    }
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let card = {
        parentId : sectionId,
        id : sections[sectionId].cards.length,
        name : cardName
    }
    sections[sectionId].cards.push(card);
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function updateAll() {
    const sectionsDiv = document.getElementById('sections-div');
    const sections = JSON.parse(localStorage.getItem('sections')) || [];
    document.getElementById('SectionName').value = '';
    document.getElementById('CardName').value = '';
    if(sections.length > 0){
        sectionsDiv.innerHTML = "";
        for(i in sections){
            let section = sections[i];
            let sectionDiv = document.createElement('div');
            let sectionName = document.createElement('h2');
            let addCardButton = document.createElement('button');
            addCardButton.innerHTML = 'Adicionar Card +';
            addCardButton.addEventListener('click', (e) => {
                const caixa = document.getElementById('addCBox');
                const caixaButton = document.getElementById('addCButton');
                showBox(caixa);
                caixaButton.onclick = () => {
                    addC(parseInt(e.target.parentElement.id));
                }
            });
            sectionName.innerHTML = section.name;
            sectionDiv.id = section.id;
            sectionDiv.className = 'section';
            sectionDiv.appendChild(sectionName);

            let cards = section.cards
            for(c in cards) {
                let card = cards[c];
                let cardDiv = document.createElement('div');
                let cardName = document.createElement('p');
                cardDiv.className = 'card';
                cardName.innerHTML = card.name;

                let rightArrow = document.createElement('img');
                let leftArrow = document.createElement('img');

                if(sections.length > 1){
                    if(card.parentId == 0) {
                        rightArrow.src = '../images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        leftArrow.className = 'hidden';
                    } else if(card.parentId == (sections.length)-1) {
                        leftArrow.src = '../images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        rightArrow.className = 'hidden';
                    } else {
                        rightArrow.src = '../images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        leftArrow.src = '../images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                    }
                } else {
                    rightArrow.className = 'hidden';
                    leftArrow.className = 'hidden';
                }

                cardDiv.appendChild(leftArrow);
                cardDiv.appendChild(cardName);
                cardDiv.appendChild(rightArrow);
                sectionDiv.appendChild(cardDiv);
            }

            sectionDiv.appendChild(addCardButton);
            sectionsDiv.appendChild(sectionDiv);
        }
    }
}

function showBox(box) {
    box.classList.replace('hidden', 'visible');
    overlay.classList.replace('hidden', 'visible');
}

function hideBox(box) {
    box.classList.replace('visible', 'hidden');
    overlay.classList.replace('visible', 'hidden');
}

function goRight(sections, card) {
    let sectionsAmount = sections.length;
    for(let s=0; s<sectionsAmount; s++){
        let section = sections[s];
        if(section.id === card.parentId){
            section.cards.splice(findIdIndex(section.cards, card), 1);
            card.parentId++;
            sections[s+1].cards.push(card);
            break;
        }
    }
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function goLeft(sections, card){
    let sectionsAmount = sections.length;
    for(let s=0; s<sectionsAmount; s++){
        let section = sections[s];
        if(section.id === card.parentId){
            section.cards.splice(findIdIndex(section.cards, card), 1);
            card.parentId--;
            sections[s-1].cards.push(card);
            break;
        }
    }
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function findIdIndex(array, idObject) {
    for(i in array) {
        let object = array[i];
        if(object.id == idObject.id) return parseInt(i);
    }
}

document.getElementById("addSForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita qualquer ação de envio ou outra
    }
});

document.getElementById("addCForm").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita qualquer ação de envio ou outra
    }
});