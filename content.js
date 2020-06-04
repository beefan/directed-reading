const timer = (waitTime) => 
  new Promise(resolve => setTimeout(resolve, waitTime ));
let isReading = false;

/**
 * Tries to start reading text inside HTMLElement
 * Reads through all text and then nextSibling
 * text in a loop until there is no nextSibling
 * 
 * @param {HTMLElement} target element user clicks to be read
 */
async function beginReading(target) {
  while (target && isReading) {

    if (target.nodeName === "#text") {
      target = target.nextSibling;
      continue;
    }

    // console.log for dev/debugging
    console.log('beginReading function called: ')
    console.log(target)

    const options = await getOptions();
    if (options.disable) { 
      isReading = false;
      break;
     }

    // read through the text
    const targetCopy = target.cloneNode(true);
    await doChunkRead(target, options);
    target.insertAdjacentElement('beforebegin', targetCopy);

    // update the value of target
    // to be its next sibling 
    if (!target.nextSibling && target.parent) {
      target = target.parent.nextSibling;
      target.previousSibling.lastChild.remove();
    } else {
      target = target.nextSibling;
      target.previousSibling.remove();
    }
  }
}

  // loop through the text, one word at
  // a time, moving the <span> tag to 
  // highlight 
function doChunkRead(elem, options) {
  if (!elem.textContent) { return }

  elem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
  const words = elem.textContent.split(" ");
  
  // initialize recursive highlight function
  focusWord(words, 0, elem, options);
  return timer(options.speed * words.length + 1)
}

async function focusWord(words, word, elem, options) {
  // if done reading the section
  // or the user has clicked again
  if (word > words.length - 1) { 
    elem.innerHTML = words.join(" ");
    return 
  }else if (!isReading) { return }

  elem.innerHTML = renderHTML(words, word, options);

  await timer(options.speed);

  focusWord(words, word + 1, elem, options);
}

function renderHTML(words, word, options) {
  const chunkA = words
                .filter( (v, i) => i < word )
                .join(" ");
  const chunkB = words
                .filter( (v, i) => i > word )
                .join(" ");

  let result = "";
  switch(options.style) {
    case "yellow-hi":
      result = `${chunkA} 
                <span style="background-color: yellow; border-radius: 3px;">
                ${words[word]}
                </span>
                ${chunkB}`;
      break;
    case "bold-text":
      result = `<span style="font-weight: bold;">
                ${chunkA} ${words[word]}
                </span>
                <span style="color: grey">
                ${chunkB}
                </span>`
      break;
  } 

  return result;
}

async function getOptions() {
  let options = null;
  chrome.storage.sync.get({
    speed: 150,
    style: "yellow-hi",
    disable: false
  }, (items) => {options =  items;}
  );

  await timer(200);

  return options;
}

document.addEventListener('dblclick', e => { 
  isReading = true;
  beginReading(e.target);
});

document.addEventListener('click', e => isReading = false );