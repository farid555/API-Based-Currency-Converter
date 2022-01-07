// fetch(`https://free.currconv.com/api/v7/countries?apiKey=e96d28210dfdc6798217`)
//     .then(response => response.json())
//     .then(data => console.log(data))

// fetch(`https://free.currconv.com/api/v7/convert?q=EUR_BDT,BDT_EUR&compact=ultra&apiKey=e96d28210dfdc6798217`)
//     .then(response => response.json())
//     .then(data => console.log(data))

const getApiData = {
  async fetchData() {
    try {
      const response = await fetch(
        `https://free.currconv.com/api/v7/countries?apiKey=e96d28210dfdc6798217`
      );
      return await response.json();
    } catch (err) {
      console.log(err.message);
    }
  },
  async getResult(receivedIo) {
    try {
      const selected1 = document.getElementById("form-selectOne");
      const selected2 = document.getElementById("form-selectTwo");
      const selectedValue1 = selected1.options[selected1.selectedIndex].value;
      const selectedValue2 = selected2.options[selected2.selectedIndex].value;
      console.log(selectedValue1);

      const response = await fetch(
        `https://free.currconv.com/api/v7/convert?q=${selectedValue1}_${selectedValue2},${selectedValue2}_${selectedValue1}&compact=ultra&apiKey=e96d28210dfdc6798217`
      );

      const data = await response.json();
      const result = await data[`${selectedValue1}_${selectedValue2}`];

      return result;
    } catch (err) {
      console.log(err.message);
    }
  },
};

const UI = {
  loadSelector() {
    let formElm = document.querySelector("#form");
    let inputNumberElm = document.querySelector("#number1");
    let inputNumberElm2 = document.querySelector("#number2");
    let headlineH1 = document.querySelector("#headline");

    return { formElm, inputNumberElm, inputNumberElm2, headlineH1 };
  },

  heading(result) {
    console.log(result);
    const { headlineH1 } = this.loadSelector();
    const headElm = `<h1>${result.toFixed(2)}</h2>`;
    headlineH1.insertAdjacentHTML("afterbegin", headElm);
  },

  receviedNumber() {
    const { inputNumberElm } = this.loadSelector();
    let getValue = Number(inputNumberElm.value);
    return getValue;
  },

  async addSelectDrop() {
    const data = await getApiData.fetchData();

    for (const item of Object.entries(data)) {
      const obj = item[1];
      // console.log(obj);

      let loopItem = Object.entries(obj);

      let selectCountries1Elm = document.querySelector("#form-selectOne");
      let selectCountries2Elm = document.querySelector("#form-selectTwo");
      let selectitem;

      loopItem.forEach(([key, value]) => {
        selectitem += `<option value="${value.currencyId}"> ${value.currencyName}</option>`;
      });
      selectCountries1Elm.innerHTML = selectitem;
      selectCountries2Elm.innerHTML = selectitem;
    }
  },

  init() {
    const { formElm } = this.loadSelector();
    formElm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const io1 = UI.receviedNumber();
      const { inputNumberElm2 } = UI.loadSelector();
      inputNumberElm2.value = "";

      const val2 = await getApiData.getResult(io1);

      console.log(val2);
      const result = io1 * Number(val2);
      inputNumberElm2.value = result;
      UI.heading(result);
    });

    document.addEventListener("DOMContentLoaded", (e) => {
      // const selectDrop = document.querySelector('#countries-b')

      this.addSelectDrop();
    });
  },
};

UI.init();
