/**
 * Toggle options in the extension view.
 * 
 */
function toggleOptions() {
  const options = document.getElementById("options-form");
  const label = options.previousSibling.previousSibling;
  const thisClass = options.classList[0];

  switch (thisClass) {
    case "hidden":
      options.classList.add("not-hidden");
      options.classList.remove("hidden");

      label.innerText = 'hide options';
      label.classList.add("red");
      label.classList.remove("blue");
    
      break;
    case "not-hidden":
      options.classList.add("hidden");
      options.classList.remove("not-hidden");

      label.innerText = 'show options';
      label.classList.remove("red");
      label.classList.add("blue");

      break;
  }
}

/**
 * save user options from settings in stage.html
 * 
 */
function saveOptions() {
  const speed = document.getElementById('speed-control').value;
  const style = document.querySelector('input[name=style]:checked').value;
  const disable = document.getElementById('disable-control').checked;

  chrome.storage.sync.set({
    speed: speed,
    style: style,
    disable: disable
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    // let status fade after a time
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

/**
 * load options from user storage
 * or use default options
 */
function loadOptions() {
  chrome.storage.sync.get({
    speed: 150,
    style: "yellow-hi",
    disable: false
  }, function(items) {
    document.getElementById('speed-control').value = items.speed;
    document.getElementById(items.style).checked = true;
    document.getElementById('disable-control').checked = items.disable;
  });
}

// load options on dom content loaded
document.addEventListener('DOMContentLoaded', loadOptions);

// add event listeners for options toggle and options form
document.getElementById("options-toggle").addEventListener('click', toggleOptions);
document.getElementById("options-form").addEventListener('change', saveOptions);