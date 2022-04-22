chrome.runtime.onInstalled.addListener(() => {
  chrome.webNavigation.onCompleted.addListener(async ({ url, tabId }) => {
    const { autoSkip } = await chrome.storage.sync.get('autoSkip')
    const isBangumiReg = /^https:\/\/www.bilibili.com\/bangumi/
    const epidMatchReg = /ep\d*/
    if (!isBangumiReg.test(url) || !autoSkip) return
    const epid = epidMatchReg.exec(url)[0]
    const { idList } = await chrome.storage.sync.get('idList')
    const opLen = idList.find(item => item.epId === epid)?.time - 0
    if (!opLen) return

    chrome.scripting.executeScript({
      target: { tabId },
      args: [opLen],
      func: function (opLen) {
        const video = document.querySelector('video')
        if (!video) return

        function setSkip() {
          setTimeout(() => {
            const currentTime = video.currentTime
            if (currentTime > 10) return
            video.currentTime = opLen
          }, 1000)
        }
        setSkip()
        const observer = new MutationObserver(() => {
          setSkip()
        })
        observer.observe(video, {
          attributes: true,
          attributeFilter: ['src']
        })
      }
    });
  })

})
