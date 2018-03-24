//set up modules for javascript... utilize closures and an ifee
//simply an anonymous function rapped in parenthisis.
//keeps variables private and have stand alone functionality if needed to expand logic

//BUDGET CONTROLLER
const budgetController = (function () {

  //function constructor to create objects of info for expenses
  let Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expenses.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expenses.prototype.getPercentage = function () {
    return this.percentage;
  };

  //function constructor to create objects of info  for income
  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function (type) {
    let sum = 0;

    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });

    data.totals[type] = sum;
  };

  //stores income and expenses into an object data structure for simlper and easier storage
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1, //set to -1 to say it is non exsistant, the numerical v. of false
  };

  //allow other modules to add to the data structure
  return {
    addItem: function (type, desc, val) {
      var newItem, Id;

      //create new id
      if (data.allItems[type].length > 0) {
        Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        Id = 0;
      }

      // create new item based on inc or exp type
      if (type === 'exp') {
        newItem = new Expenses(Id, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(Id, desc, val);
      }

      // push it into our data structure
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      let newids = data.allItems[type].map(function (current) {
        return current.id;
      });

      let index = newids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {

      //calculate total income and expensesLabel
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget: income - expensesLabel
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the percentage of income that we setupEventListeners
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function () {
      let allPercentages = data.allItems.exp.map(function (current) {
        return current.getPercentage();
      });

      return allPercentages;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,

      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

//another module - closure and ifee
//keeps variables private and have stand alone functionality if needed to expand logic

//UI Controller
const UIController = (function () {
  const domClassesOrIds = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(domClassesOrIds.inputType).value, //will be either inc or exp
        description: document.querySelector(domClassesOrIds.inputDescription).value,
        value: parseFloat(document.querySelector(domClassesOrIds.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
        let html, newHtml, element;

        // Create HTML string with placeholder text
        if (type === 'inc') {
          element = domClassesOrIds.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
          element = domClassesOrIds.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

    deleteListItem: function (selectorId) {
      let element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);
    },

    clearFields: function () {
      let fields = document.querySelectorAll(domClassesOrIds.inputDescription +
      ', ' + domClassesOrIds.inputValue);

      //trick list being returned from querySelectorAll as a list into becoming
      //an array in order to work with and array.
      let fieldsArray = Array.prototype.slice.call(fields);

      //loop over the newly created array of fields and clear fields after
      fieldsArray.forEach(function (currentVal, index, array) {
        currentVal.value = '';
      });

      fieldsArray[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(domClassesOrIds.budgetLabel).textContent = obj.budget;
      document.querySelector(domClassesOrIds.incomeLabel).textContent = obj.totalInc;
      document.querySelector(domClassesOrIds.expensesLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(domClassesOrIds.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(domClassesOrIds.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function (percentages) {
      let fields = document.querySelectorAll(domClassesOrIds.expensesPercentageLabel); //will return a node list.

      let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      //nodelist forEach array.
      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });

    },

    getdomClassOrId: function () {
      return domClassesOrIds;
    },
  };
})();

//yep... another module / controller based off of closers / this tells everything what to do

//Overall global app controller
const controller = (function (budgetCtrl, UICtrl) {

  //bringing in availablitiy of query selectors to UI controller
  let DOM = UICtrl.getdomClassOrId();

  //all eventlisteners placed here
  let setupEventListeners = function () {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    //event listenter deligate as one listener v. having listners on multilple items.
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  let updateBudget = function () {

        //calculate the budget
        budgetCtrl.calculateBudget();

        //return th budget
        let budget = budgetCtrl.getBudget();

        //display the budget in the UI
        UICtrl.displayBudget(budget);
  };

  let updatePercentages = function () {

    //calculate percentages
    budgetCtrl.calculatePercentages();

    //read percentages from the budget controller
    let percentages = budgetCtrl.getPercentage();

    //update the UI with the new percentages.
    UICtrl.displayPercentages(percentages);

  };

  //what happens once button is clicked
  let ctrlAddItem = function () {
    console.log('ctrlAddItem called');

    //get field input data upon click
    let input = UICtrl.getinput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //add item to budget controller
      let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //add item to user interface for view
      UICtrl.addListItem(newItem, input.type);

      //clear fields
      UICtrl.clearFields();

      //updateBudget and calculateBudget function call
      updateBudget();

      //calculate and up date percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function (event) {
    let itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {

      //find inc-1
      let splitId = itemId.split('-');
      let type = splitId[0];
      let Id = parseInt(splitId[1]);

      //delte item from data structure
      budgetCtrl.deleteItem(type, Id);

      //delete the itiem from the ui
      UICtrl.deleteListItem(itemId);

      //update and show the new budget
      updateBudget();

      //calculate and up date percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('application has started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });

      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
