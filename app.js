// Initial functions
document.addEventListener('DOMContentLoaded', function() {
  
  createVitalityDisplay();

  // use stored birthdate if already entered
  chrome.storage.local.get('birthdate', function(data) {
    if (data.birthdate > 0) {
      startVitality(data.birthdate);
    } else {
      createBirthdateForm();
      handleBirthdateForm();
    }
  });
});

function createBirthdateForm () {
  var f = document.createElement("form");
  f.setAttribute('method', "post");
  f.setAttribute('id', 'birthdateForm');
  f.setAttribute('align', "center");
  f.setAttribute('display', "block");

  var bdate = document.createElement("input");
  bdate.setAttribute('name', "bdate");
  bdate.setAttribute('required', '');
  bdate.setAttribute('type', "date");
  // bdate.setAttribute('value', "1989-06-14");
  bdate.setAttribute('class', "unstyled");

  var btn = document.createElement("input");
  btn.setAttribute('type', "submit");
  btn.setAttribute('value', ">>");

  f.appendChild(bdate);
  f.appendChild(btn);

  document.getElementsByClassName('container')[0].appendChild(f);
};

function handleBirthdateForm() {
  var birthdateForm = document.getElementById('birthdateForm');
  if (birthdateForm.attachEvent) {
    birthdateForm.attachEvent("submit", saveBirthdate);
  } else {
    birthdateForm.addEventListener("submit", saveBirthdate);
  };
};

function createVitalityDisplay() {
  var vitWrapper = document.createElement("div");
  vitWrapper.setAttribute('id', "vit-wrapper");
  vitWrapper.setAttribute('align', "center");
  
  var vitText1 = document.createElement("p");
  vitText1.innerHTML = "YOU ARE";
  vitWrapper.appendChild(vitText1);

  var vit = document.createElement("span");
  vit.setAttribute('id', "vitality");
  vitWrapper.appendChild(vit);

  var vitText2 = document.createElement("p");
  vitText2.innerHTML = "YEARS OLD";
  vitWrapper.appendChild(vitText2);

  document.getElementsByClassName('container')[0].appendChild(vitWrapper);
  vitWrapper.style.display = "none"; // hide for now
};

function saveBirthdate(e) {
  if (e.preventDefault) e.preventDefault();

  var birthdateForm = $('#birthdateForm');
  var birthdate = birthdateForm[0].elements[0].valueAsNumber;
  birthdateForm.fadeOut('fast');

  // save
  chrome.storage.local.set({
    'birthdate': birthdate
  });
  startVitality(birthdate);
};

function startVitality(birthdate) {
  var vit = document.getElementById('vitality');
  
  // start timer
  var interval = setInterval(function() {
    var currentVit = (Date.now() - birthdate) / (365*24*60*60*1000);
    vit.innerHTML = currentVit.toFixed(9);
  }, 100);

  // add reset button
  var reset = document.createElement("span");
  reset.setAttribute('id', "reset");
  reset.innerHTML = "reset";
  if (reset.attachEvent) {
    reset.attachEvent("click", handleReset);
  } else {
    reset.addEventListener("click", handleReset);
  }

  // delay slightly for ux
  setTimeout(function() {
    document.getElementById('vit-wrapper').style.display = "block"; // show 
    document.body.appendChild(reset);
  }, 400);
};

function handleReset() {
  chrome.storage.local.remove('birthdate', function() {
    location.reload();
  });
};
