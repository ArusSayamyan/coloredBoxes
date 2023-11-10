const listsWrapper = document.querySelector('.lists')
const result = document.querySelector('.result')
let selectedItems = [];
const lists = [
    {
        id: 'list1',
        checked: false,
        listName: 'list 1',
        items: [
            {
                name: 'item1',
                checked: false,
                color: '#ff0000',
                count: 5,
                id: 1
            },
            {
                name: 'item2',
                checked: false,
                color: '#dbe019',
                count: 15,
                id: 2
            },
            {
                name: 'item3',
                checked: false,
                color: '#043105',
                count: 7,
                id: 3
            },
            {
                name: 'item4',
                checked: false,
                color: '#121a75',
                count: 10,
                id: 4
            }
        ]
    },
    {
        id: 'list2',
        checked: false,
        listName: 'list 2',
        items: [
            {
                name: 'item1',
                checked: false,
                color: '#59336c',
                count: 5,
                id: 5
            },
            {
                name: 'item2',
                checked: false,
                color: '#95259a',
                count: 15,
                id: 6
            },

        ]

    },
]

lists.forEach(list => {
    // create container for every list
    const container = document.createElement('div')
    container.classList.add('content')
    const listContainer = document.createElement('div')
    const listContent = document.createElement('div')
    listContainer.classList.add('listContainer')
    listContent.classList.add('listContent')
    listContainer.setAttribute('id', list.id)
    listContainer.innerHTML = `<div class="listHeader"><span>${list.listName}</span> </div>`
    // create list for every list element
    const ul = document.createElement("ul");

    // add items to lists
    list.items.forEach(elem => {
        const itemEl = document.createElement('li')
        itemEl.classList.add('listItem')
        itemEl.innerHTML = `<div><input type="checkbox" id="${elem.id}" class="selectedItem"> <label for="${elem.id}" class="checkboxLabel">${elem.name}</label> </div>` + `<div><span class="count ${elem.name}" data-id="${list.id}-${elem.id}">${elem.count}</span><input type="color"  name="colorPicker" data-color="color-${elem.id}" class="colorPicker" value="${elem.color}"></div>`
        ul.appendChild(itemEl);

        container.innerHTML = `
<img src="img/arrowDown.svg" alt="" class="dropDown">
<label for="${list.id}">
<input type="checkbox" class="selectedItem" id="${list.id}">
<span class="listTitle">${list.listName}</span>
</label>

${ul.outerHTML}
`
    })

    listsWrapper.append(container)
    listContent.append(listContainer)
    listContent.innerHTML += `<button class="btn" type="button">random</button>`
    result.append(listContent)
})


// logic of checked  inputs
const inputs = document.querySelectorAll('.selectedItem')
// const wrappers = document.querySelectorAll('.listContainer')

inputs.forEach(input => {
    input.addEventListener('change', (event) => {
        if (event.target.checked) {
            updateChecked(event.target.id)

        } else {
            removeFromList(input.id)
        }

    })
})

function updateChecked(itemId) {
    for (let obj of lists) {
        for (let item of obj.items) {
            if (item.id === +itemId) {
                item.checked = !item.checked
                addToList(item, obj.id)

            } else if (itemId == obj.id && !item.checked) {
                item.checked = !item.checked
                addToList(item, obj.id)
            }
        }
    }
}

const wrappers = document.querySelectorAll('.listContainer')

function addToList(selected, containerId) {
    inputs.forEach(input => {
        if (input.id == selected.id && !input.checked) {
            input.checked = true
        }
    })
    const resultContent = document.createElement('div')
    resultContent.classList.add('resultContent')
    resultContent.setAttribute('id', `elem${selected.id}`)
    for (let i = 0; i < selected.count; i++) {
        const coloredDiv = document.createElement('div')
        coloredDiv.classList.add("coloredElem")
        coloredDiv.classList.add(`elem${selected.id}`)
        coloredDiv.style.backgroundColor = selected.color
        resultContent.innerHTML += `${coloredDiv.outerHTML}`
    }
    // draw in DOM
    wrappers.forEach(wrapper => {
        if (wrapper.id === containerId) {
            wrapper.innerHTML += `${resultContent.outerHTML}`
        }
    })

}

function removeFromList(itemId) {
    lists.forEach(list => {
        const uncheckedElem = list.items.find(elem => elem.id == itemId)
        if (list.items.includes(uncheckedElem)) {
            uncheckedElem.checked = false;
            document.querySelector(`#${list.id}`).checked = false
            selectedItems = selectedItems.filter(elem => elem.id !== +itemId)
            const removed = document.querySelectorAll(`.elem${itemId}`)
            removed.forEach(removeElem => {
                removeElem.remove();
            })
        }
        if (itemId === list.id) {
            list.items.forEach(element => {
                const unchecked = document.getElementById(`${element.id}`)
                unchecked.checked = false
                element.checked = false
                const removedEl = document.querySelector(`#elem${element.id}`)
                removedEl.remove();
            })
        }
    })
}


// toggle dropdown
const dropDown = document.querySelectorAll('.dropDown')

dropDown.forEach(arrow => {
    arrow.addEventListener('click', (event) => {
        if (!arrow.closest('.content').classList.contains('active') && !arrow.classList.contains('rotate')) {
            arrow.closest('.content').classList.add('active')
            arrow.classList.add('rotate')
        } else {
            arrow.closest('.content').classList.remove('active')
            arrow.classList.remove('rotate')
        }

    })
})


// sort colored boxes randomly
const sortBtns = document.querySelectorAll('.btn')
sortBtns.forEach(btn => {
    btn.id = 'random'
    btn.addEventListener('click', () => {
        for (let list of lists) {
            if (btn.previousSibling.id === list.id && btn.id === 'random') {
                const checkedItems = list.items.filter(item => item.checked)
                let array = []
                checkedItems.forEach(obj => {
                    for (let i = 0; i < obj.count; i++) {
                        array.push(obj)
                    }
                })
                generateRandomBoxes(array, list.id)
                btn.id = 'sort'
                btn.textContent = 'sort'
            } else if (btn.previousSibling.id === list.id && btn.id === 'sort') {
                sortBoxes(list.id)
                btn.id = 'random'
                btn.textContent = 'random'
            }
        }


    })
})

function generateRandomBoxes(array, id) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    const randomResult = document.createElement('div')
    randomResult.classList.add('result')
    // result.setAttribute('id', `elem${selected.id}`)
    for (let i = 0; i < array.length; i++) {
        const coloredDiv = document.createElement('div')
        coloredDiv.classList.add('coloredElem')
        coloredDiv.style.backgroundColor = array[i].color
        randomResult.innerHTML += `${coloredDiv.outerHTML}`
        const mainContent = result.querySelector(`#${id}`)
        randomResult.className = 'randomContent'
        mainContent.append(randomResult)
        const disappearedElems = mainContent.querySelectorAll('.resultContent')
        disappearedElems.forEach(item => {
            item.style.display = 'none'
        })
    }

}


function sortBoxes(id) {
    const mainContent = result.querySelector(`#${id}`)
    const appearedElems = mainContent.querySelectorAll('.resultContent')
    const disappearedElems = mainContent.querySelectorAll('.randomContent')
    appearedElems.forEach(item => {
        item.style.display = 'flex'
    })
    disappearedElems.forEach(item => {
        item.style.display = 'none'
    })
}


function changeItemCount(event) {
}

const counts = document.querySelectorAll('.count')
const colorPickers = document.querySelectorAll('.colorPicker')
counts.forEach(count => {
    count.addEventListener('click', (event) => {
        let newValue = prompt('Change count of colored boxes')
        const dataValue = event.target.getAttribute('data-id')
        for (let list of lists) {
            list.items.forEach(item => {
                if(dataValue == list.id + '-' + item.id) {
                    event.target.textContent = +newValue
                    item.count = +newValue
                    if (item.checked) {
                        document.querySelector(`#elem${item.id}`).remove()
                        addToList(item, list.id)
                    }
                }
            })
        }
    })
})


colorPickers.forEach(color => {
    color.addEventListener('change', (event) => {
        const dataValue = event.target.getAttribute('data-color')
        for (let list of lists) {
            list.items.forEach(item => {
                if(dataValue == 'color-' + item.id) {
                    item.color = event.target.value
                    if (item.checked) {
                        document.querySelector(`#elem${item.id}`).remove()
                        addToList(item, list.id)
                    }
                }
            })
        }
    })
})



