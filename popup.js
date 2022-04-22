(async function () {
  const switchBtn = document.querySelector('.switch')
  const { autoSkip } = await chrome.storage.sync.get('autoSkip')
  if (autoSkip) {
    switchBtn.classList.add('active')
  }

  switchBtn.addEventListener('click', () => {
    if (switchBtn.classList.contains('disabled')) return
    const isActive = switchBtn.classList.contains('active')
    if (isActive) {
      switchBtn.classList.remove('active')

    } else {
      switchBtn.classList.add('active')
    }
    chrome.storage.sync.set({
      autoSkip: !isActive
    })
  })

})()
