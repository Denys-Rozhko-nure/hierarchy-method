// Імпортуємо бібліотеку React задля корректної роботи рендерингу
import React, {useState} from "react";


// Функція, що повертає розмітку для елементу виробу важливості
// Приймає напис лівого та другого елементу вибору
// Та ідентифікатор, которий треба встановити для елементу 
// select, щоб потім мати змогу легко считати його значення
function ImportanceCriterion({leftLabel, rightLabel, selectId}) {
  return (
    <div className="criterion">{leftLabel} 
        <select id={selectId}>
          <option value="0.111111">Принципово важливіше за</option>
          <option value="0.142957">Значно важливіше за</option>
          <option value="0.200000">Важливіше за </option>
          <option value="0.333333">Трохи важливіше за </option>
          <option disabled>─────────────────────</option>
          <option value="1">Приблизно рівне з </option>
          <option disabled>─────────────────────</option>
          <option value="3">Трохи менш важливе за </option>
          <option value="5">Менш важливе за </option>
          <option value="7">Значно менш важливе за </option>
          <option value="9">Принципово менш важливе за </option>
        </select>
        {rightLabel}</div>
  )
}

// Те саме, що і минула функція, але трохи змінені написи з "важливіше" на "краще" наприклад
function QualityCriterion({leftLabel, rightLabel, selectId}) {
  return (
    <div className="criterion">{leftLabel} 
        <select id={selectId}>
          <option value="0.111111">Принципово гірше за</option>
          <option value="0.142957">Значно гірше за</option>
          <option value="0.200000">Гірше за </option>
          <option value="0.333333">Трохи гірше за </option>
          <option disabled>─────────────────────</option>
          <option value="1">Приблизно рівий з </option>
          <option disabled>─────────────────────</option>
          <option value="3">Трохи краще за </option>
          <option value="5">Краще за </option>
          <option value="7">Значно краще за </option>
          <option value="9">Принципово краще за </option>
        </select>
        {rightLabel}</div>
  )
}

// Функція, що повертає розмітку таблиці вибору разом із
// виводом сумми кожного стовпця
// Приймає матрицю порівнянь, масив підписів свтовпців та рядків таблиці
// Напис, що буде у кутку таблиці
// Масив сум стовпців
// у відповідному порядку
function SumTable({arr, labels, edgeHeader, sums}) {
  return (
    <table>
      <tbody>
        <tr>
        <td><strong>{edgeHeader || ""}</strong></td>
        {labels.map(label => 
          <td key={label}>{label}</td>
        )} 
        </tr>
        
        {labels.map((label, i) =>
          <tr key={`row${i}`}>
            <td>{label}</td>
            {[0, 1, 2].map(j =>
              <td key={`cell${i}${j}`}>{arr[i][j].toFixed(2)}</td>
            )}
          </tr>
        )}
        <tr>
          <td><strong>Сумма:</strong></td>
          {sums.map(sum =>
            <td key={`cellSum${sum}`}>{sum.toFixed(2)}</td>
          )}
        </tr>
      </tbody>
    </table>
  )
}

// Функція, що повертає розмітку зваженої вибору разом із
// виводом середньої ваги кожного рядку
// Приймає матрицю порівнянь, масив підписів свтовпців та рядків таблиці
// Напис, що буде у кутку таблиці
// Масив ваг рядків
// Масив сум стовпців
// у відповідному порядку
function WieghtTable({arr, labels, edgeHeader, weights, sums}) {
  return (
    <table>
      <tbody>
        <tr>
        <td><strong>{edgeHeader || ""}</strong></td>
        {labels.map(label => 
          <td key={label}>{label}</td>
        )} 
        <td><strong>Середня вага</strong></td>
        </tr>
        
        {labels.map((label, i) =>
          <tr key={`row${i}`}>
            <td>{label}</td>
            {[0, 1, 2].map(j =>
              <td key={`cell${i}${j}`}>{(arr[i][j] / sums[j]).toFixed(2)}</td>
            )}
            <td>{weights[i].toFixed(2)}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

// Функція, що приймає матрицю і повертає масив сум стовпців
function getSums(arr) {
  const result = [];
  for(let j = 0; j < 3; ++j) {
    result.push(arr.reduce((ac, val) => ac + val[j], 0));
  } 
  return result;
}

// Функція, що приймає матрицю, масив сум її стовпців
// та повертає середню вагу кожного рядку матриці
function getWeights(arr, sums) {
  const result = [];
  for(let i = 0; i < 3; ++i) {
    let wSum = 0;
    for(let j = 0; j < 3; ++j) {
      wSum += arr[i][j]/sums[j];
    }
    result.push(wSum);
  }
  return result;
}

// Наш компонент, що повертає розмітку програми
function App() {

  // useState - функція із React, що дозволяє реактивно змінювати значення змінних
  // У функції ми завжди отримуємо поточне значенн змінної (a, sumsA і т.д.)
  // Встановлюємо ми значення через особливу функцію(наступну після змінної), що встановлює
  // актуальне значення і запускає перемальовку розмітки з уже актуальними даними
  let [a, setA] = useState(null);
  let [sumsA, setSumsA] = useState(null);
  let [weightsA, setWeightsA] = useState(null);
  let [criteria, setCriteria] = useState(null);
  let [itemResults, setItemResults] = useState(null);

  // Масив підписів критеріїв 
  const criterionLables = ["Ціна", "Операціна система", "Якість дисплею"];
  // Масив підписів альтернатив
  const itemLabels = ["Телефон 1", "Телефон 2", "Телефон 3"];

  // Функція, що запускає вирахування результатів
  function startCalculating() {
    // Створюємо шаблон масиву матриці порівнянь критеріїв
    const newA = [
      [1, 1, 1], 
      [1, 1, 1], 
      [1, 1, 1],
    ];

    // Ініціалізуємо матрицю порівнянь критеріїв
    // за допомогою знаходження елементу, у котрому користувач визначає важливість критерію,
    for(let i = 0; i < 2; ++i) {
      for(let j = 1 + i; j < 3; ++j) {
        // і знаходження його значення
        newA[i][j] = Number.parseFloat(document.getElementById(`a${i}${j}`).value);
        // Тут встановлюєму симетричне відносно головної діагоналі елемент
        newA[j][i] = 1 / newA[i][j];
      }
    }

    // Усі змінні, що починаються з t - тимчасові змінні - аналоги відповідних об'явлених вище
    // Отримуємо сумму рядків матриці порівнянь критеріїв
    const tSums = getSums(newA);
    // Отримуємо значення відносних ваг критеріїв
    const tWeights = getWeights(newA, tSums);

    // Встановлюємо усі значення щодо критеріїі
    setSumsA(tSums);
    setWeightsA(tWeights);
    setA(newA);

    // Створюємо шаблон масиву критеріїв
    const tCriteria = [];
    for(let k = 0; k < 3; ++k) {
      // Створюємо елемент критерії
      const criterion = {
        // Матриця порівнянь альтернатив з даного критерію
        arr: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        // Сумми стовпців попередньої матриці
        sums: null,
        // Ваги рядків попередньої матриці
        weights: null,
        // Назва критерію
        label: criterionLables[k],
      };

      // Знаходимо матрицю порівнянь альтернатив з даного критерію
      // Так само, як у рядку 171
      for(let i = 0; i < 2; ++i) {
        for(let j = 1 + i; j < 3; ++j) {
          criterion.arr[i][j] = Number.parseFloat(document.getElementById(`k${k+1}_${i}${j}`).value);
          criterion.arr[j][i] = 1 / criterion.arr[i][j];
        }
      }
      
      // Знаходимо сумму стовпців нашої матриці порівнянь
      criterion.sums = getSums(criterion.arr);
      // Знаходимо вагу рядків нашої матриці порівнянь
      criterion.weights = getWeights(criterion.arr, criterion.sums);

      // Додаємо наш критерій до масиву критеріїв
      tCriteria.push(criterion);
    }
    // Встановлюємо масив критеріїв
    setCriteria(tCriteria);

    // Створюємо шаблон масиву альтернатив і їх ваг
    const tItemsResults = [];
    for(let i = 0; i < 3; ++i) {
      let itemResult = 0;
      for(let j = 0; j < 3; ++j) {
        // Фактично множимо вектор ваг критеріїв на матрицю ваг альтернатив 
        itemResult += tWeights[j] * tCriteria[j].weights[i];
      }
      tItemsResults.push(itemResult);
    }
    // Встановлюємо масив альтернатив і їх ваг
    setItemResults(tItemsResults);
  }

  return (
   <>
   {/* Коментарі тут пишуться так, а не через "//", як у джаваскрипт  */}
    <h2>Уведіть дані, після чого натисніть розрахувати</h2>  

    {/*Створюємо блок вводу даних відносної важливості критеріїв*/}
    <div className="logical-block">
      <h3>Уведіть відносну важливість критеріїв відносну один одного</h3>
      <div>
        <ImportanceCriterion leftLabel={"Ціна"} rightLabel={"Операційну систему"} selectId={"a01"} />
        <ImportanceCriterion leftLabel={"Ціна"} rightLabel={"Якість дисплею"} selectId={"a02"} />
        <ImportanceCriterion leftLabel={"Якість дисплею"} rightLabel={"Ціну"} selectId={"a12"} />
      </div>
    </div>

    {/*Створюємо блок вводу даних відносної важливості альтернатів за критерієм "ціна"*/}
    <div className="logical-block">
      <h3>Уведіть відносну оцінку телефонів відносну один одного за критерієм "ціна"</h3>
      <div>
        <QualityCriterion leftLabel={"Телефон 1"} rightLabel={"Телефон 2"} selectId={"k1_01"} />
        <QualityCriterion leftLabel={"Телефон 1"} rightLabel={"Телефон 3"} selectId={"k1_02"} />
        <QualityCriterion leftLabel={"Телефон 2"} rightLabel={"Телефон 3"} selectId={"k1_12"} />
      </div>
    </div>

    {/*Створюємо блок вводу даних відносної важливості альтернатів за критерієм "операціна система"*/}
    <div className="logical-block">
      <h3>Уведіть відносну оцінку телефонів відносну один одного за критерієм "операціна система"</h3>
      <div>
        <QualityCriterion leftLabel={"Телефон 1"} rightLabel={"Телефон 2"} selectId={"k2_01"} />
        <QualityCriterion leftLabel={"Телефон 1"} rightLabel={"Телефон 3"} selectId={"k2_02"} />
        <QualityCriterion leftLabel={"Телефон 2"} rightLabel={"Телефон 3"} selectId={"k2_12"} />
      </div>
    </div>

    {/*Створюємо блок вводу даних відносної важливості альтернатів за критерієм "якість дисплею"*/}
    <div className="logical-block">
      <h3>Уведіть відносну оцінку телефонів відносну один одного за критерієм "якість дисплею"</h3>
      <div>
        <QualityCriterion leftLabel={"Телефон 1"} rightLabel={"Телефон 2"} selectId={"k3_01"} />
        <QualityCriterion leftLabel={"Телефон 1"} rightLabel={"Телефон 3"} selectId={"k3_02"} />
        <QualityCriterion leftLabel={"Телефон 2"} rightLabel={"Телефон 3"} selectId={"k3_12"} />
      </div>
    </div>

    {/*Створюємо кнопку, натискання на яку запустить розрахунок*/}
    <button onClick={startCalculating}>Розрахувати</button>
     
    {/* Конструкція з фігурних скобок означає, що ми щось динамічно вписуємо
        Нижче, ми беремо масив і для кожного з його елементів повераємо JSX розмітку
        Це створено для рендерингу списку однотипних елементів
        У даному випадку усі, окрім верхньої рядки таблиці 
    */} 

    {/*Виводимо таблиці щодо відносної важливості критеріїв*/}
    {a && 
      <SumTable labels={criterionLables} arr={a} sums={sumsA}/>
    }

    {a &&
      <WieghtTable labels={criterionLables} arr={a} sums={sumsA} weights={weightsA} />
    }

    {/*Для кожного критерію масиву виводимо матриці порівнянь альтернатив*/}
    {criteria?.map(criterion =>
      <>
        <SumTable 
          labels={itemLabels} 
          arr={criterion.arr} 
          sums={criterion.sums}
          edgeHeader={criterion.label}
        />

        <WieghtTable 
          labels={itemLabels} 
          arr={criterion.arr} 
          sums={criterion.sums} 
          weights={criterion.weights} 
          edgeHeader={criterion.label}
        />
      </>
    )}
    <hr />
    {/*Виводимо фінальні значення ваг кожної альтернативи за кожним критерієм*/}
    {criteria && 
      <table>
        <tbody>
          <tr>
            <td><strong>Підсумкові параметри альтернатив</strong></td>
            {criterionLables.map(label =>
              <td key={`result${label}`}>{label}</td>
            )}
          </tr>
          {[0, 1, 2].map(i =>
            <tr key={`resultRow${i}`}>
              <td>{itemLabels[i]}</td>
              {[0, 1, 2].map(j =>
                <td key={`resultCell${i}${j}`}>{criteria[j].weights[i].toFixed(2)}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    }
    <hr />
    {/*Виводимо фінальні значення ваг кожної альтернативи*/}
    {itemResults &&
      <table>
        <tr>
          <td></td>
          <td>Підсумкова відносна вага кожної альтернативи</td>
        </tr>
        {[0, 1, 2].map(i =>
          <tr>
            <td>{itemLabels[i]}</td>
            <td>{itemResults[i].toFixed(2)}</td>
          </tr>
        )}
      </table>
    }
    <h4>Альтернатва із найбільшою відносною вагою і є найкращим вибором для заданих критеріїв</h4>
   </>
  );
}

export default App;
