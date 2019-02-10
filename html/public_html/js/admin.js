
// for working update
const authorized = true;

// index of day
let dayIndex = 1;



$("#select_day").on("change", function () {
  // let selector = $('#select_day');
  let value = this.options[this.selectedIndex].value
  // alert(value)
  // let value = selector.options[selector.selectedIndex].value;
  if (value == 4) return;
  
  $.ajax({
    url: `/get/all?day=${value}`, // указываем URL и
    dataType: 'json', // тип загружаемых данных
    success: fillReqOnSuccess,
  });
  dayIndex = value;
});

function clearTrs() {
  const trs = document.getElementsByTagName('tr');

  for (let j = 2; j < trs.length; j++) {
    for (let i = 1; i < trs[j].cells.length; i++) {
      let cell = trs[j].cells[i];
      cell.innerHTML = '';
    }
  }
}


// запрос на заполнение таблицы
function fillReqOnSuccess(data, textStatus) {
  // group: string
  function findTRbyGroupNumber(group) {
    const trs = document.getElementsByTagName('tr');

    for (let j = 2; j < trs.length; j++) {
      const first = trs[j].cells[0];
      if (first.innerText === group) {
        return trs[j];
      }
    }
    return null;
  }

  clearTrs();


  $.each(data, (i, dbElement) => {
    const trSet = findTRbyGroupNumber(dbElement.group_);
    if (trSet) {
      console.log(dbElement);
      if (dbElement.count_number == 0) {
        for (let i = 1; i < trSet.children.length; i++) {
          trSet.children[i].innerHTML = dbElement.subject_;
        }
      } else {
        const elementTd = trSet.children[dbElement.count_number];
        // Ин Язык<div>Кузнецова Клемято Нестеренко<div>418 420 420а</div></div>
        elementTd.innerHTML = `${dbElement.subject_}<div>${dbElement.teacher}<div>${dbElement.cabinet}</div></div>`;
        console.log(elementTd);
        console.log(typeof (elementTd));
      }
    } else {
      console.log(`no groups with group_name = ${dbElement.group_}`);
    }
  });
}


function showPrompt(text, callback) {
  // Показать полупрозрачный DIV, затеняющий всю страницу
  // (а форма будет не в нем, а рядом с ним, чтобы не полупрозрачная)
  function showCover() {
    const coverDiv = document.createElement('div');
    coverDiv.id = 'cover-div';
    document.body.appendChild(coverDiv);
  }

  function hideCover() {
    document.body.removeChild(document.getElementById('cover-div'));
  }

  function complete(value) {
    hideCover();
    container.style.display = 'none';
    document.onkeydown = null;
    callback(value);
  }


  showCover();
  const form = document.getElementById('prompt-form');
  var container = document.getElementById('prompt-form-container');
  document.getElementById('prompt-message').innerHTML = text;


  form.elements.submit.onclick = function () {
    const cellNumber = document.getElementById('cellNumber');
    const vals = {};
    // console.log(form.elements)
    // console.log(form.parentElement.parentElement)

    const count_number = cellNumber.value.split(';')[1];

    const group = document.getElementById('groupNumber').value;
    vals.count_number = count_number;
    vals.group_ = group;
    vals.options = document.getElementById('formConfig').value;

    const inputSubject = form.elements.inputSubject.value;
    console.log(inputSubject);
    // if (selectPredmet == '') return false; // игнорировать пустой submit
    vals.subject_ = inputSubject;

    const inputTeacher = form.elements.inputTeacher.value;
    console.log(inputTeacher);
    // if (selectPrepod == '') return false; // игнорировать пустой submit
    vals.teacher = inputTeacher;

    const text1str = form.elements.text1.value;
    console.log(text1str);
    // if (text1str == '') return false; // игнорировать пустой submit
    vals.cabinet = text1str;
    // alert('shit')
    vals.day_of_week = dayIndex;

    const old = document.getElementById(cellNumber.value);
    const arr = old.innerHTML.split('</div></div>')[0].split('<div>');

    console.log(arr);
    const l = arr.length;
    for (let i = 0; i < 3 - l; i++) {
      arr.push('');
    }

    console.log(arr);
    console.log(vals);

    if (arr[0] == vals.subject_ && arr[1] == vals.teacher && arr[2] == vals.cabinet) {
      complete(null);
      return false;
    }
    console.log('docomplete')
    complete({oldElement: old, requestObject: vals});
    return false;
  };

  form.elements.cancel.onclick = function () {
    complete(null);
  };

  document.onkeydown = function (e) {
    if (e.keyCode == 27) { // escape
      complete(null);
    }
  };

  const lastElem = form.elements[form.elements.length - 1];
  const firstElem = form.elements[0];

  lastElem.onkeydown = function (e) {
    if (e.keyCode == 9 && !e.shiftKey) {
      firstElem.focus();
      return false;
    }
  };

  firstElem.onkeydown = function (e) {
    if (e.keyCode == 9 && e.shiftKey) {
      lastElem.focus();
      return false;
    }
  };
  container.style.display = 'block';
}

// принимает данные из формы
function handleSubmitCallback(o) {
  if (!o) {
    return;
  }
  let oldElement = o.oldElement
  let requestObject = o.requestObject
  console.log('value: ');
  console.log(requestObject);
  oldElement.innerHTML = `${requestObject.subject_}<div>${requestObject.teacher}<div>${requestObject.cabinet}</div></div>`;
    
  // elementTd.innerHTML 
  
  $.post('/lessons', requestObject)
    .done((data, textStatus) => {
      console.log(data);
      console.log(textStatus);
    });
}


function cellClick() {
  if (!authorized) {
    return;
  }
  const config = document.getElementById('formConfig');
  config.value = '';

  const group_ = this.parentElement.children[0].innerHTML;
  const count_number = this.id;
  console.log(group_);
  console.log(count_number);
  document.getElementById('groupNumber').value = group_;
  document.getElementById('cellNumber').value = count_number;

  config.value += this.innerHTML == '' ? 'toUpdate:false;' : 'toUpdate:true;';


  const b = this.innerHTML.split('</div></div>')[0].split('<div>');
  if (b[0]) {
    document.getElementById('inputSubject').value = b[0];
  }
  if (b[1]) {
    document.getElementById('inputTeacher').value = b[1];
  }
  if (b[2]) {
    document.getElementById('text1').value = b[2];
  }

  // верхняя колонка
  showPrompt('Предмет:', handleSubmitCallback);
}

(function init() {
  $.ajax({
    url: `/get/all?day=${dayIndex}`, // указываем URL и
    dataType: 'json', // тип загружаемых данных
    success: fillReqOnSuccess,
  });

  const trs = document.getElementsByTagName('tr');
  console.log(trs);
  // init changing
  for (let j = 2; j < trs.length; j++) {
    const a = trs[j].cells;
    for (let i = 1; i < a.length; i++) {
      a[i].onclick = cellClick;
      a[i].id = `${j};${i}`;
    }
  }
}());
