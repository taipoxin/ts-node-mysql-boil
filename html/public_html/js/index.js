// появление и обработка формы входа
$('input[type="submit"]').mousedown(function () {
  $(this).css('background', '#FF6700');
});
$('input[type="submit"]').mouseup(function () {
  $(this).css('background', '#FF6700');
});

$('#loginform').click(function () {
  $('.login').fadeToggle('slow');
  $(this).toggleClass('green');
});

$('#signInSubmit').click(function () {
  let p = document.getElementById('signInPass').value
  let requestObject = {pass: p};
  console.log(requestObject)
  document.getElementById('toPass').value = p;
  $('#toSubmit').click();
})
let dayIndex = 1;
let newDayIndex = 1;


$("#select_day").on("change", function () {
  // let selector = $('#select_day');
  let value = this.options[this.selectedIndex].value
  // alert(value)
  // let value = selector.options[selector.selectedIndex].value;
  if (value == 4) return;
  newDayIndex = value;
  $.ajax({
    url: `/get/all?day=${value}`, // указываем URL и
    dataType: 'json', // тип загружаемых данных
    success: fillReqOnSuccess,
  });
});


// пропадание формы входа
$(document).mouseup(function (e) {
  var container = $(".login");

  if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0) // ... nor a descendant of the container
  {
    container.hide();
    $('#loginform').removeClass('green');
  }
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

  // if (newDayIndex != dayIndex) {
  clearTrs();
  // }
  dayIndex = newDayIndex;
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


(function init() {
  $.ajax({
    url: '/get/all?day=1', // указываем URL и
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