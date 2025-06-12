document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector('.input-row input[type="text"]');
  const addButton = document.querySelector('.input-row button.add');
  const itemList = document.querySelector('.card.left');

  function updateStats() {
    const rightPanel = document.querySelector('.card.right');
    const leftItems = document.querySelectorAll('.card.left .item');

    const tags = rightPanel.querySelectorAll('.tag');
    tags.forEach(tag => tag.remove());

    const leftSection = rightPanel.querySelectorAll('.section-title')[0];
    const rightSection = rightPanel.querySelectorAll('.section-title')[1];

    const leftList = document.createElement('div');
    const rightList = document.createElement('div');

    const notBought = {};
    const bought = {};

    leftItems.forEach(item => {
      const nameDiv = item.querySelector('.item-name');
      const name = nameDiv.textContent.trim();
      const count = parseInt(item.querySelectorAll('.circle')[1].textContent);
      const isBought = nameDiv.classList.contains('strike');

      const dict = isBought ? bought : notBought;
      dict[name] = (dict[name] || 0) + count;
    });

    for (let [name, count] of Object.entries(notBought)) {
      const tag = document.createElement('div');
      tag.classList.add('tag');
      tag.innerHTML = `${name} <span class="count">${count}</span>`;
      leftList.appendChild(tag);
    }

    for (let [name, count] of Object.entries(bought)) {
      const tag = document.createElement('div');
      tag.classList.add('tag');
      tag.innerHTML = `<span class="strike">${name}</span> <span class="count">${count}</span>`;
      rightList.appendChild(tag);
    }

    rightPanel.insertBefore(leftList, rightSection);
    rightPanel.appendChild(rightList);
  }

  function setupItem(itemDiv) {
    const itemNameDiv = itemDiv.querySelector('.item-name');
    const controlsDiv = itemDiv.querySelector('.count-controls');
    const deleteButton = controlsDiv.querySelector('.delete');
    const actionButton = controlsDiv.querySelector('.action-btn');
    const minusBtn = controlsDiv.querySelector('.minus');
    const plusBtn = controlsDiv.querySelector('.plus');
    const countSpan = controlsDiv.querySelectorAll('.circle')[1];

    function updateMinusButtonState(count) {
      if (count <= 1) {
        minusBtn.classList.add('disabled');
      } else {
        minusBtn.classList.remove('disabled');
      }
    }

    if (plusBtn) {
      plusBtn.onclick = () => {
        let count = parseInt(countSpan.textContent);
        count++;
        countSpan.textContent = count;
        updateMinusButtonState(count);
        updateStats();
      };
    }

    if (minusBtn) {
      minusBtn.onclick = () => {
        let count = parseInt(countSpan.textContent);
        if (count > 1) {
          count--;
          countSpan.textContent = count;
          updateMinusButtonState(count);
          updateStats();
        }
      };
    }

    if (deleteButton) {
      deleteButton.onclick = () => {
        itemDiv.remove();
        updateStats();
      };
    }

    if (actionButton) {
      actionButton.onclick = () => {
        const isBought = itemNameDiv.classList.toggle('strike');
        if (isBought) {
          actionButton.textContent = 'Не куплено';
          if (deleteButton) deleteButton.remove();
        } else {
          actionButton.textContent = 'Куплено';
          if (deleteButton && !controlsDiv.contains(deleteButton)) {
            controlsDiv.appendChild(deleteButton);
          }
        }
        updateStats();
      };
    }

    itemNameDiv.addEventListener('click', () => {
      if (itemNameDiv.classList.contains('strike')) return;

      const currentName = itemNameDiv.textContent;
      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.value = currentName;
      inputEdit.classList.add('edit-input');

      itemDiv.replaceChild(inputEdit, itemNameDiv);
      inputEdit.focus();

      inputEdit.addEventListener('blur', () => {
        const newName = inputEdit.value.trim() || currentName;
        const newNameDiv = document.createElement('div');
        newNameDiv.classList.add('item-name');
        newNameDiv.textContent = newName;

        itemDiv.replaceChild(newNameDiv, inputEdit);
        setupItem(itemDiv);
        updateStats();
      });
    });

    if (itemNameDiv.classList.contains('strike') && deleteButton) {
      deleteButton.remove();
      if (actionButton) actionButton.textContent = 'Не куплено';
    }

    if (countSpan && minusBtn) {
      updateMinusButtonState(parseInt(countSpan.textContent));
    }
  }

  function createItem(name) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const itemNameDiv = document.createElement('div');
    itemNameDiv.classList.add('item-name');
    itemNameDiv.textContent = name;

    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('count-controls');

    const minusBtn = document.createElement('span');
    minusBtn.classList.add('circle', 'minus');
    minusBtn.setAttribute('data-tooltip', 'Зменшити кількість');
    minusBtn.textContent = '−';

    const countSpan = document.createElement('span');
    countSpan.classList.add('circle');
    countSpan.textContent = '1';

    const plusBtn = document.createElement('span');
    plusBtn.classList.add('circle', 'plus');
    plusBtn.setAttribute('data-tooltip', 'Збільшити кількість');
    plusBtn.textContent = '+';

    const actionButton = document.createElement('button');
    actionButton.classList.add('action-btn');
    actionButton.setAttribute('data-tooltip', 'Куплені товари');
    actionButton.textContent = 'Куплено';

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('circle', 'delete');
    deleteButton.setAttribute('data-tooltip', 'Видалити товар');
    deleteButton.textContent = '✖';

    controlsDiv.append(minusBtn, countSpan, plusBtn, actionButton, deleteButton);
    itemDiv.append(itemNameDiv, controlsDiv);
    itemList.appendChild(itemDiv);

    setupItem(itemDiv);
    updateStats();
  }

  function addItem() {
    const name = input.value.trim();
    if (name !== '') {
      createItem(name);
      input.value = '';
    }
    input.focus();
  }

  addButton.addEventListener('click', addItem);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addItem();
  });

  const defaultItems = document.querySelectorAll('.card.left .item');
  defaultItems.forEach(setupItem);
  updateStats();
});
