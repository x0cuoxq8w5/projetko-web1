// PARA EU VER NO FUTURO, O PROBLEMA Q VOU RESOLVER É:
// AJEITAR A ORGANIZAÇÃO DOS IDs (OU EU FAÇO OS IDS SE ORGANIZAREM TODA
// VEZ QUE UMA AÇÃO É FEITA, OU EU SÓ CRIO NO LOCALSTORAGE UM ID FIXO.
// PENSEI TAMBÉM EM FAZER UMA KEY NO LOCALSOTRAGE QUE GUARDA O ÚLTIMO
// ID EXISTENTE E, SE UM CARD FOR DELETADO, ESSE ID FICA RESERVADO EM
// UMA KEY DE "IDs LIBERADOS". ESSA IDEIA AINDA ESTÁ EM STANDBY)

const overlay = document.getElementById('overlay');

function ini(){
    updateAll();
    if(JSON.parse(localStorage.getItem("IDc")) === null){
        localStorage.setItem("IDc", JSON.stringify(0));
    }
    if(JSON.parse(localStorage.getItem("IDcFree")) === null){
        localStorage.setItem("IDcFree", JSON.stringify([]));
    }
    if(JSON.parse(localStorage.getItem("IDs")) === null){
        localStorage.setItem("IDs", JSON.stringify(0));
    }
}

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
    let sectionId = JSON.parse(localStorage.getItem('IDs')) || 0;
    let section = {
        id : sectionId++,
        name : sectionName,
        cards : []
    }
    sections.push(section);
    localStorage.setItem('sections', JSON.stringify(sections));
    localStorage.setItem('IDs', JSON.stringify(sectionId));
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
    let freeIdArray = JSON.parse(localStorage.getItem('IDcFree')) || [];
    let card;
    if(freeIdArray.length !== 0){
        let freeId = freeIdArray.pop();
        card = {
            parentId : sectionId,
            id : freeId,
            name: cardName
        }
        localStorage.setItem('IDcFree', JSON.stringify(freeIdArray));
    } else{
        let cardId = JSON.parse(localStorage.getItem('IDc')) || 0;
        card = {
            parentId : sectionId,
            id : cardId++,
            name : cardName
        }
        localStorage.setItem('IDc', JSON.stringify(cardId));
    }
    sections[sectionId].cards.push(card);
    localStorage.setItem('sections', JSON.stringify(sections));
    updateAll();
}

function delC(parentSectionId, card){
    let sections = JSON.parse(localStorage.getItem('sections')) || [];
    let idFree = JSON.parse(localStorage.getItem('IDcFree')) || [];
    if(!sections[parentSectionId]) return;
    sections[parentSectionId].cards = sections[parentSectionId].cards.filter(x => x.id !== card.id);
    idFree.push(card.id);
    localStorage.setItem('sections', JSON.stringify(sections));
    localStorage.setItem('IDcFree', JSON.stringify(idFree));
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

                let delButton = document.createElement('button');
                let editButton = document.createElement('button');
                delButton.className = 'side-bt delete';
                delButton.innerHTML = 'Del';
                editButton.className = 'side-bt edit';
                editButton.innerHTML = 'Edit';

                delButton.addEventListener('click', (e) =>{
                    delC(card.parentId, card);
                });

                let rightArrow = document.createElement('img');
                let leftArrow = document.createElement('img');

                if(sections.length > 1){
                    if(card.parentId == 0) {
                        rightArrow.src = 'images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        leftArrow.className = 'hidden';
                    } else if(card.parentId == (sections.length)-1) {
                        leftArrow.src = 'images/arrow_left.png' || '<';
                        leftArrow.addEventListener('click', (e) => {
                            goLeft(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        rightArrow.className = 'hidden';
                    } else {
                        rightArrow.src = 'images/arrow_right.png' || '>';
                        rightArrow.addEventListener('click', (e) => {
                            goRight(
                                JSON.parse(localStorage.getItem('sections')),
                                card
                            );
                        });
                        leftArrow.src = 'images/arrow_left.png' || '<';
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
                cardDiv.appendChild(delButton);
                cardDiv.appendChild(editButton);
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