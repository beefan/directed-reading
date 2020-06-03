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

document.getElementById("options-toggle").addEventListener('click', toggleOptions);