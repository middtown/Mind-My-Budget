//set up modules for javascript... utilize closures and an ifee
//simply an anonymous function rapped in parenthisis.
//keeps variables private and have stand alone functionality if needed to expand logic

//Budget Controller
const budgetController = (function () {
  //some code
})();

//another module - closure and ifee
//keeps variables private and have stand alone functionality if needed to expand logic

//UI Controller
const UIController = (function () {

  const domClassesOrIds = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(domClassesOrIds.inputType).value, //will be either inc or exp
        description: document.querySelector(domClassesOrIds.inputDesc).value,
        value: document.querySelector(domClassesOrIds.inputValue).value,
      };
    },

    getClassOrId: function () {
      return domClassesOrIds;
    },
  };

})();

//yep... another module / controller based off of closers

//Overall global app controller
const controller = (function (budgetCtrl, UICtrl) {

  //bringing in availablitiy of query selectors to UI controller
  let DOM = UICtrl.getClassOrId();

  let ctrlAddItem = function () {

    //get field input data upon click
    let input = UICtrl.getinput();
    console.log(input);

    //add item to budget controller

    //add item to user interface for view

    //calculate the budget or ehat pap

    //display the budget in the UI
  };

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
