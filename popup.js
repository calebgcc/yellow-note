const toggle = document.getElementById("highlightToggle");
const donwloadBtn = document.getElementById("downloadBtn");

/*chrome.storage.sync.get(["highlightEnabled"], (result) => {
        toggle.checked = result.highlightEnabled || false;
});*/

toggle.checked = (localStorage.getItem("isActive") === "true") || false;

toggle.addEventListener("change", () => {
    let value = toggle.checked;
    /*chrome.storage.sync.set({highlightEnabled: value}, () => {
        console.log("Error Storage: " + chrome.runtime.lastError);
    });*/

    console.log(localStorage.getItem("isActive"));
    localStorage.setItem("isActive", value);

    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, { action: "toggle" });
        }
    });
});

donwloadBtn.addEventListener("click", () => {
    console.log("clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log(tabs)
        chrome.tabs.sendMessage(tabs[0].id, { action: "download" });
    });
});