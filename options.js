// let page = document.getElementById("buttonDiv");
// let selectedClassName = "current";
// const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// // Reacts to a button click by marking the selected button and saving
// // the selection
// function handleButtonClick(event) {
//   // Remove styling from the previously selected color
//   let current = event.target.parentElement.querySelector(
//     `.${selectedClassName}`
//   );
//   if (current && current !== event.target) {
//     current.classList.remove(selectedClassName);
//   }

//   // Mark the button as selected
//   let color = event.target.dataset.color;
//   event.target.classList.add(selectedClassName);
//   chrome.storage.sync.set({ color });
// }

// // Add a button to the page for each supplied color
// function constructOptions(buttonColors) {
//   chrome.storage.sync.get("color", (data) => {
//     let currentColor = data.color;
//     // For each color we were provided…
//     for (let buttonColor of buttonColors) {
//       // …create a button with that color…
//       let button = document.createElement("button");
//       button.dataset.color = buttonColor;
//       button.style.backgroundColor = buttonColor;

//       // …mark the currently selected color…
//       if (buttonColor === currentColor) {
//         button.classList.add(selectedClassName);
//       }

//       // …and register a listener for when that button is clicked
//       button.addEventListener("click", handleButtonClick);
//       page.appendChild(button);
//     }
//   });
// }

// // Initialize the page by constructing the color options
// constructOptions(presetButtonColors);
let tbody;
let form;
let idList;
function createCol(epId, time) {
  const tr = document.createElement("tr");
  const epIdTd = document.createElement("td");
  const timeTd = document.createElement("td");
  const actionTd = document.createElement("td");
  epIdTd.innerText = epId;
  timeTd.innerText = time;
  const deleteBtn = document.createElement("button");
  deleteBtn.addEventListener('click', delChange)
  deleteBtn.innerText = "删除";
  actionTd.appendChild(deleteBtn);
  tr.appendChild(epIdTd);
  tr.appendChild(timeTd);
  tr.appendChild(actionTd);
  return tr;
}
function initList(list) {
  const fg = document.createDocumentFragment()
  list.forEach((item, index) => {
    const tr = createCol(item.epId, item.time);
    tr.setAttribute('data-index', index);
    fg.appendChild(tr);
  })
  return fg;
}
function delChange(event) {
  const tr = this.parentElement.parentElement;
  const index = parseInt(tr.getAttribute('data-index'), 10);
  idList.splice(index, 1);
  chrome.storage.sync.set({ idList });
  tbody.removeChild(tr)
}
(async function () {
  tbody = document.querySelector('table tbody')
  form = document.querySelector('form')
  const { idList: list } = await chrome.storage.sync.get('idList')
  idList = list || []
  const tbodyList = initList(idList)
  tbody.appendChild(tbodyList)
  form.addEventListener('submit', (e) => {
    const idIpt = form.querySelector('input[name=epId]')
    const timeIpt = form.querySelector('input[name=time]')
    const epId = idIpt.value
    const time = timeIpt.value
    if (idList.find(item => item.epId === epId)) return e.preventDefault()
    if (!epId || !time) return e.preventDefault()
    idList.push({ epId, time })
    chrome.storage.sync.set({ idList })
    const tr = createCol(epId, time)
    tr.setAttribute('data-index', idList.length - 1)
    tbody.appendChild(tr)
    idIpt.value = ''
    timeIpt.value = ''
    e.preventDefault()
  })
})();
