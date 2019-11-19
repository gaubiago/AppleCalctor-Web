let display_input = document.getElementById("display");
const clear_div = document.getElementById("clear");
const inversion_div = document.getElementById("inversion");
const percentage_div = document.getElementById("percentage");
const division_div = document.getElementById("division");
const seven_div = document.getElementById("seven");
const eight_div = document.getElementById("eight");
const nine_div = document.getElementById("nine");
const multiplication_div = document.getElementById("multiplication");
const four_div = document.getElementById("four");
const five_div = document.getElementById("five");
const six_div = document.getElementById("six");
const subtraction_div = document.getElementById("subtraction");
const one_div = document.getElementById("one");
const two_div = document.getElementById("two");
const three_div = document.getElementById("three");
const summation_div = document.getElementById("summation");
const zero_div = document.getElementById("zero");
const point_div = document.getElementById("point");
const equal_div = document.getElementById("equal");

let accum = 0;
let op1 = 0;
let op1Taken = false;
let op2 = 0;
let optorContainer = ""; // stores *, /, +, -, and =
let display = ""; // stores number string meant to be shown on the display
let optor;
let operandBase;
let accumUsed = false;
let charTracker = ""; // stores every character ever typed
let dblBinOptorHit = false;
let inversionHit = false;
let invertColors = false;
let delay = 100;
let binaryOptor_div;
let firstChar = true;

function truncateDisplay(value) {
  let base4Rounding;
  let decimalPart;
  value = value.toString();
  if (value.includes(".") && value[0]==="-") { // 11 chars (negative decimal)
	if (value.length>=12) { // last char used to round up number
	  decimalPart = 10 - value.indexOf(".");
	  base4Rounding = value[11]; // 12th char
	  base4Rounding = parseInt(base4Rounding);
	  value = value.substring(0,11);
	  value = parseFloat(value);
	  if (base4Rounding>5 && value<0) value += Decimal.mul((-1), Math.pow(10, (-1)*decimalPart)); // otherwise, round it down (remain the same)
	}	  
  }
  else if (value[0]==="-" || (value.includes(".") && value[0]!=="-")) { // 10 chars (or negative, or positive decimal)
	if (value.length>=11) {
	  if (value.includes(".")) decimalPart = 9 - value.indexOf(".");
	  base4Rounding = value[10]; // 11th char
	  base4Rounding = parseInt(base4Rounding);
	  value = value.substring(0,10);
	  value = parseFloat(value);
	  if (base4Rounding>5 && value>0) value = Decimal.add(value, Math.pow(10, (-1)*decimalPart));
	  else if (base4Rounding>5 && value<0) value = Decimal.sub(value,1);
	}
  }
  else { // 9 chars (positive)
	if (value.length>=10) {
	  base4Rounding = value[9];
	  base4Rounding = parseInt(base4Rounding);
	  value = value.substring(0,9);
	  value = parseFloat(value);
	  if (base4Rounding>5 && value>0) value = Decimal.add(value, 1);
	}
  }
  return value;
}

function resizeFont(displayStr) {
  if (displayStr.length<=6) display_input.style.fontSize = "6em";
  else if (displayStr.length>6 && displayStr.length<=7) display_input.style.fontSize = "5.30em";
  else if (displayStr.length>7 && displayStr.length<=8) display_input.style.fontSize = "4.70em";
  else if (displayStr.length>8 && displayStr.length<=9) display_input.style.fontSize = "4.20em";
  else if (displayStr.length>9 && displayStr.length<=10) display_input.style.fontSize = "3.80em";
  else if (displayStr.length>10 && displayStr.length<=11) display_input.style.fontSize = "3.60em";
  else if (displayStr.length>11 && displayStr.length<=12) display_input.style.fontSize = "3.50em";
  else if (displayStr.length>12 && displayStr.length<=13) display_input.style.fontSize = "3.40em";
}

function insertCommas(displayStr) {
  let left, middle, right, decimal;
  let neg = false;
  let index;
  if (!displayStr.includes("e")) { // don't insert commas if there is exponential notation
	if (displayStr[0]==="-") {
	  displayStr = displayStr.substring(1);
	  neg = true;
	}
	if (displayStr.includes(".")) {
	  index = displayStr.indexOf(".");	
	  decimal = displayStr.substring(index);
	  displayStr = displayStr.substring(0, index);
	  if (displayStr.length<=3) {
		right = displayStr.slice(-3);
		displayStr = right+decimal;
	  }
	  else if (displayStr.length>3 && displayStr.length<=6) {
		right = displayStr.slice(-3);
		middle = displayStr.slice(0,-3);
		displayStr = middle+","+right+decimal;
	  }
	  else if (displayStr.length>6) {
		right = displayStr.slice(-3);
		middle = displayStr.slice(-6,-3);
		left = displayStr.slice(0,-6);
		displayStr = left+","+middle+","+right+decimal;
	  }
	}
	else {
	  if (displayStr.length<=3) {
		right = displayStr.slice(-3);
		displayStr = right;
	  }
	  else if (displayStr.length>3 && displayStr.length<=6) {
		right = displayStr.slice(-3);
		middle = displayStr.slice(0,-3);
		displayStr = middle+","+right;
	  }
	  else if (displayStr.length>6) {
		right = displayStr.slice(-3);
		middle = displayStr.slice(-6,-3);
		left = displayStr.slice(0,-6);
		displayStr = left+","+middle+","+right;
	  }
	}
	if (neg) displayStr = "-"+displayStr;
  }
  return displayStr;
}

function countDigits(value) {
  let counter=0;
  for (let i=0; i<value.toString().length; i++) 
	if (value.toString()[i]!=="-" && value.toString()[i]!==".") counter++; 
  return counter;
}

function formatNumber(value) {
  let exp, eIndex, floatNumber;
  if (!value.toString().includes(".")) value = value.toExponential(8); // positive number and has more than 9 digits
  if (parseFloat(value.toString().substring(0,value.toString().indexOf(".")))!==0) { // by default,, formatNumber() is called if it has a "e" or if it has 10 or more digits
	eIndex = value.toString().indexOf("e");
	exp = value.toString().substring(eIndex+1);
	if (parseFloat(exp)<23 && parseFloat(exp)>-23) { // when it has more than 9 digits
	  if (value.toString().substring(0,eIndex).length<=7) floatNumber = value.toString().substring(0,eIndex);
	  else floatNumber = value.toString().substring(0,11-(exp.length+1));
	  value = parseFloat(floatNumber+"e"+exp).toExponential();
	}
	else {
	  value = value.toExponential(9-(exp.length+1)); // exp < -23 or exp > 23
	  floatNumber = value.toString().substring(0,11-(exp.length+1));
	  value = parseFloat(floatNumber+"e"+exp).toExponential();
	}
  }
  else {
	if (value<0) value = value.toString().substring(0,11);
	else value = value.toString().substring(0,10);
  }
  return value;
}

function flushDisplay(value) { 
  let displayStr;
  let eIndex;
  if (isFinite(value)) {
	if (countDigits(value)>9 || value.toString().includes("e")) value = formatNumber(value);
	displayStr = insertCommas(value.toString());
	if (displayStr.includes("+")) {
	  eIndex = displayStr.indexOf("e");
	  displayStr = displayStr.substring(0, eIndex+1) + displayStr.substring(eIndex+2); // remove '+' from scientific notation
	}
	if (displayStr.substring(displayStr.indexOf("e"))==="e0") displayStr = displayStr.substring(0, displayStr.indexOf("e"));
	resizeFont(displayStr); 
	display_input.value = displayStr; 
  } 
  else display_input.value = "Error"; 
}

function updateDisplay(value) { 
  let displayStr;
  value = truncateDisplay(value);
  displayStr = insertCommas(value.toString());
  resizeFont(displayStr); 
  display_input.value = displayStr; 
}

function removeCommas(value){
  let displayStr = "";
  for (let i=0; i<value.length; i++) if (value[i]!==",") displayStr += value[i];
  return displayStr;
}

function retrieveDisplay() { return removeCommas(display_input.value.toString()); } 

function updateAccum(value) { 
  accum = value; 
  accumUsed = true; 
}

function zeroAccum() { accum = 0; }

function retrieveAccum() { return accum; }

function makeOperand() { return parseFloat(retrieveDisplay()); }

function isBinaryOptor(char) { return (char==="/" || char==="*" || char==="-" || char==="+"); }

function clear() {
  if (isBinaryOptor(charTracker[charTracker.length-2])) {
	if (display.length!==0) clear_div.innerHTML = "C";
    flushDisplay(0);
    display = "";
  }
  else {
	clear_div.innerHTML = "AC";
    zeroAccum();
    flushDisplay(0);
    display = "";
    op1Taken = false;
	dblBinOptorHit = false;
    optorContainer = "";
	charTracker = "";
	firstChar = true;
  }
}

function percent(op) {
  op = Decimal.div(op,100);
  flushDisplay(op);
  display = "";
  return op;
}

function execExpression (optor, op1, op2) {
  switch (optor) {
  case "/":
    updateAccum(Decimal.div(op1, op2));
    break;
  case "*":
    updateAccum(Decimal.mul(op1, op2));
    break;
  case "-":
    updateAccum(Decimal.sub(op1, op2));
    break;
  case "+":
    updateAccum(Decimal.add(op1, op2));
    break;
  }
}

function evalOptor(char) {
  if (char==="c") {
	if (op1Taken && !accumUsed) {
	  console.log(binaryOptor_div);
	  console.log(convertCh2El(binaryOptor_div));
	  //(convertCh2El(binaryOptor_div) + '_div.addEventListener("mouseup", function() { setTimeout(function() {' + convertCh2El(binaryOptor_div) + "_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() {" + convertCh2El(binaryOptor_div) + "_div.classList.add('invertClrOButtons') }, delay); invertColors = true; })");
	  if (binaryOptor_div==="/") { setTimeout(function() { division_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { division_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "/"; }
	  else if (binaryOptor_div==="*") { setTimeout(function() { multiplication_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { multiplication_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "*"; }
	  else if (binaryOptor_div==="-") { setTimeout(function() { subtraction_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { subtraction_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "-"; }
	  else if (binaryOptor_div==="+") { setTimeout(function() { summation_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { summation_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "+"; }
	  clear_div.innerHTML = "AC";
	  flushDisplay(0);
	  display = "";
	}
	else clear();
  }
  else if (char==="!") {
	if (charTracker[charTracker.length-2]==="%") { // when 2nd to last char is percentage
	  value = Decimal.mul(-1, parseFloat(retrieveDisplay()));
	  if (countDigits(value)>9 || value.toString().includes("e")) value = formatNumber(value);
	  display = value.toString();
	  if (display.includes("+")) {
		eIndex = display.indexOf("e");
		display = display.substring(0, eIndex+1) + display.substring(eIndex+2); // remove '+' from scientific notation
	  }
	  updateDisplay(display);
    }
    else if (charTracker[charTracker.length-2]==="=") { // handles it when sign inversion succeeds an "=" 
	  value = Decimal.mul(-1,retrieveAccum());
	  if (countDigits(value)>9 || value.toString().includes("e")) value = formatNumber(value);
	  display = value.toString();
	  if (display.includes("+")) {
		eIndex = display.indexOf("e");
		display = display.substring(0, eIndex+1) + display.substring(eIndex+2); // remove '+' from scientific notation
	  }
	  updateDisplay(display);
    }
    // scenario 1
    else if (isBinaryOptor(charTracker[charTracker.length-2])) { // handles it when sign inversion succeeds a binary operator
      display = "-0";
      updateDisplay(display);
    }
    // scenario 2
    else if (display==="0." || display===".") { // handles it when typed 1) "." or 2) "0."
      display = "-0.";
      updateDisplay(display);
    }
    else if ((retrieveDisplay()==="0" && !accumUsed) || display==="0") { // handles 1) the very start stage or 2) when typed "0"
      display = "-0";
      updateDisplay(display);
    }
	else if (display==="-") {
	  display = "0"; 
	  updateDisplay(display);
	}
    else if (display==="-0") {
      charTracker = charTracker.substring(0, charTracker.length-2);
      display = "";
      updateDisplay("0");
    }
    else if (display==="-0.") {
      charTracker = charTracker.substring(0, charTracker.length-2);
      display = "0.";
      updateDisplay(display);
    }
	else if (display[0]==="-") {
	  display = display.substring(1);
	  updateDisplay(display);
	}
	else {
	  display = "-"+display;
	  updateDisplay(display);
	}
	inversionHit = true;
  }
  else if (char==="%") {
    if (!op1Taken) {
      op1 = makeOperand();
	  op1 = percent(op1);
    }
    else {
      op2 = makeOperand();
	  op2 = percent(op2);
    } 
  }
  else if (char!=="=") { // either one of the ramainder: *, /, +, or -
	optorContainer += char;
	// handling the inversion operation
	if (!op1Taken && inversionHit) {
	  op1 = makeOperand();
	  inversionHit = false;
	}
	else if (op1Taken && inversionHit) {
	  op2 = makeOperand();
	  inversionHit = false;
	}     
	// handling the remaning cases in this scenario
    if (!op1Taken) {
      op1 = makeOperand();
      op1Taken = true;   
	  display = "";
    } 
	if (optorContainer[optorContainer.length-2]!=="=" && optorContainer.length>1 && optorContainer[optorContainer.length-1]!=="=" && isBinaryOptor(optorContainer[optorContainer.length-1]) && isBinaryOptor(optorContainer[optorContainer.length-2]) && !isBinaryOptor(charTracker[charTracker.length-2])) { // handles: (op)+(op)+(op)+(op)-(op)-(op)*(op)*(op)/...
	  console.log(dblBinOptorHit);
      if (dblBinOptorHit) {
        dblBinOptorHit = false;
        display = "";
      } 
	  else {
        optor = optorContainer[optorContainer.length-2];
        op2 = makeOperand(); execExpression(optor, op1, op2); flushDisplay(retrieveAccum());
        op1 = retrieveAccum();
        display = "";
	  }
      console.log(1);
    }
  }
  else { // if char is =
    optorContainer += char; //optorContainer will be flushed only whenever clear() is called
    if (!op1Taken) { // takes effect whenever (op) appears in the sequence (op)x=====(op)==
      op1 = makeOperand();
      updateAccum(0);
      op1Taken = true;   
      display = "";
    } 
    if (optorContainer[0]==="=") { // when equal sign is the first operator hit
      op1 = makeOperand();
      flushDisplay(op1);
      op1Taken = false;   
      display = "";
      optorContainer = "";
      console.log(2);
    }
    if (op1Taken) {
      if (optorContainer[optorContainer.length-2]==="=") { // handles: (op1)x=, =, =, =..., where x is a binary operator
        if (isBinaryOptor(optorContainer[optorContainer.length-3])) {
          optor = optorContainer[optorContainer.length-3];
          operandBase = op2;
        } 
        execExpression(optor, op1, operandBase);
        op1 = retrieveAccum();
        console.log(3);
      }
      else { // handles: (op1)x(op2)=, x(op2)=, x(op2)..., where x is a binary operator 
        // OR op1 x op2 = , op1 x op2 = ..., where x is a binary operator (overwriting accum)
        optor = optorContainer[optorContainer.length-2];
        op2 = makeOperand();
        execExpression(optor, op1, op2);
        op1 = retrieveAccum();
        console.log(4);
      }
      flushDisplay(retrieveAccum());
      display = "";
    }
  }
}

function isOperator(char) { return (char==="c" || char==="!" || char==="%" || char==="/" || char==="*" || char==="-" || char==="+" || char==="="); }

function convertCh2El(char) {
  let element;
  if (char==="c") element = "clear";
  else if (char==="!") element = "inversion";
  else if (char==="%") element = "percentage";
  else if (char==="/") element = "division";
  else if (char==="*") element = "multiplication";
  else if (char==="-") element = "subtraction";
  else if (char==="+") element = "summation";
  else if (char==="=") element = "equal";
  else if (char===".") element = "point";
  else if (char==="0") element = "zero";
  else if (char==="1") element = "one";
  else if (char==="2") element = "two";
  else if (char==="3") element = "three"
  else if (char==="4") element = "four";
  else if (char==="5") element = "five";
  else if (char==="6") element = "six";
  else if (char==="7") element = "seven";
  else if (char==="8") element = "eight";
  else if (char==="9") element = "nine";
  return element;
}

function isInvOrPer(char) { // digit, point, or equal
  return (char==="c" || char==="0" || char==="1" || char==="2" || char==="3" || char==="4" || char==="5" || char==="6" || char==="7" || char==="8"  || char==="9"  || char==="."  || char==="=" || char==="*" || char==="/" || char==="+" || char==="-");
}

function setChar(char) {
  charTracker += char;
  if ((firstChar && (isBinaryOptor(char) || char==="=")) || (!op1Taken && char==="!" && char==="%")) {
	if (char==="!") {
	  if (retrieveDisplay()==="0") {
		display = "-";
		updateDisplay("-0");
	  }
	  else {
		display = "";
		updateDisplay("0");
	  }
	} 
	clear();
	if (isInvOrPer(char) && invertColors) {
	  if (binaryOptor_div==="/") setTimeout(function() { division_div.classList.remove('invertClrOButtons'); }, delay); 
	  else if (binaryOptor_div==="*") setTimeout(function() { multiplication_div.classList.remove('invertClrOButtons'); }, delay); 
	  else if (binaryOptor_div==="-") setTimeout(function() { subtraction_div.classList.remove('invertClrOButtons'); }, delay); 
	  else if (binaryOptor_div==="+") setTimeout(function() { summation_div.classList.remove('invertClrOButtons'); }, delay); 
	  invertColors = false;
	}
  }
  else {
	firstChar = false;
	// 1st 3 lines handles the situation (op)x(op)x(op)xxx(op)xxxx, where x is a binaray optor 
	if (charTracker[charTracker.length-2]===charTracker[charTracker.length-1]) dblBinOptorHit = true;
	if (!dblBinOptorHit && charTracker.length>1) charTracker = charTracker.slice(-2); // preserve only the last 2 elements of the string (2nd to last is needed for op1 x op2 =, op1 x op2 =)
	if (accumUsed && charTracker[charTracker.length-2]==="=") {
	  op1Taken = false; // overwrite accumulator (op1 receives new No instead of accum)
	  accumUsed = false;
	}
	if (isInvOrPer(char) && invertColors) {
	  if (binaryOptor_div==="/") setTimeout(function() { division_div.classList.remove('invertClrOButtons'); }, delay); 
	  else if (binaryOptor_div==="*") setTimeout(function() { multiplication_div.classList.remove('invertClrOButtons'); }, delay); 
	  else if (binaryOptor_div==="-") setTimeout(function() { subtraction_div.classList.remove('invertClrOButtons'); }, delay); 
	  else if (binaryOptor_div==="+") setTimeout(function() { summation_div.classList.remove('invertClrOButtons'); }, delay); 
	  invertColors = false;
	}
	if (isOperator(char)) evalOptor(char);
	else {
	  clear_div.innerHTML = "C"; // change from AC to C in the calculator
	  if ((display.includes(".") && display[0]==="-" && display.length<11) || ((display[0]==="-" || (display.includes(".") && display[0]!=="-")) && display.length<10) || (display.length<9)) {
		if (char==="." && !display.includes(".")) { // just print one "." onto the display
		  if (display.length===0) display += "0.";
		  else display += char;
		  updateDisplay(display);
		} 
		else if (char!==".") {
		  if (display==="-0") display = "-"; 
		  if (char==="0" && retrieveDisplay()==="0") {  }
		  else {
			display += char;
			updateDisplay(display);
		  }
		}
	  }
	}
  }
  console.log("chars: ", charTracker);
  console.log("optors: ", optorContainer);
} 

clear_div.addEventListener("mousedown", function() { setChar("c"); clear_div.classList.add('transpGButtons'); })
inversion_div.addEventListener("mousedown", function() { setChar("!"); inversion_div.classList.add('transpGButtons'); })
percentage_div.addEventListener("mousedown", function() { setChar("%"); percentage_div.classList.add('transpGButtons'); })
division_div.addEventListener("mousedown", function() { setChar("/"); division_div.classList.add('transpOButtons'); })
multiplication_div.addEventListener("mousedown", function() { setChar("*"); multiplication_div.classList.add('transpOButtons'); })
subtraction_div.addEventListener("mousedown", function() { setChar("-"); subtraction_div.classList.add('transpOButtons'); })
summation_div.addEventListener("mousedown", function() { setChar("+"); summation_div.classList.add('transpOButtons'); })
equal_div.addEventListener("mousedown", function() { setChar("="); equal_div.classList.add('transpOButtons'); })
point_div.addEventListener("mousedown", function() { setChar("."); point_div.classList.add('transpBButtons'); })
zero_div.addEventListener("mousedown", function() { setChar("0"); zero_div.classList.add('transpBButtons'); })
one_div.addEventListener("mousedown", function() { setChar("1"); one_div.classList.add('transpBButtons'); })
two_div.addEventListener("mousedown", function() { setChar("2"); two_div.classList.add('transpBButtons'); })
three_div.addEventListener("mousedown", function() { setChar("3"); three_div.classList.add('transpBButtons'); })
four_div.addEventListener("mousedown", function() { setChar("4"); four_div.classList.add('transpBButtons'); })
five_div.addEventListener("mousedown", function() { setChar("5"); five_div.classList.add('transpBButtons'); })
six_div.addEventListener("mousedown", function() { setChar("6"); six_div.classList.add('transpBButtons'); })
seven_div.addEventListener("mousedown", function() { setChar("7"); seven_div.classList.add('transpBButtons'); })
eight_div.addEventListener("mousedown", function() { setChar("8"); eight_div.classList.add('transpBButtons'); })
nine_div.addEventListener("mousedown", function() { setChar("9"); nine_div.classList.add('transpBButtons'); })
clear_div.addEventListener("mouseup", function() { setTimeout(function() { clear_div.classList.remove('transpGButtons'); }, delay); }) 
inversion_div.addEventListener("mouseup", function() { setTimeout(function() { inversion_div.classList.remove('transpGButtons'); }, delay); })
percentage_div.addEventListener("mouseup", function() { setTimeout(function() { percentage_div.classList.remove('transpGButtons'); }, delay); })
division_div.addEventListener("mouseup", function() { setTimeout(function() { division_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { division_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "/"; })
multiplication_div.addEventListener("mouseup", function() { setTimeout(function() { multiplication_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { multiplication_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "*"; })
subtraction_div.addEventListener("mouseup", function() { setTimeout(function() { subtraction_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { subtraction_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "-"; })
summation_div.addEventListener("mouseup", function() { setTimeout(function() { summation_div.classList.remove('transpOButtons'); }, delay); setTimeout( function() { summation_div.classList.add('invertClrOButtons') }, delay); invertColors = true; binaryOptor_div = "+"; })
equal_div.addEventListener("mouseup", function() { setTimeout(function() { equal_div.classList.remove('transpOButtons'); }, delay); })
point_div.addEventListener("mouseup", function() { setTimeout(function() { point_div.classList.remove('transpBButtons'); }, delay); })
zero_div.addEventListener("mouseup", function() { setTimeout(function() { zero_div.classList.remove('transpBButtons'); }, delay); })
one_div.addEventListener("mouseup", function() { setTimeout(function() { one_div.classList.remove('transpBButtons'); }, delay); })
two_div.addEventListener("mouseup", function() { setTimeout(function() { two_div.classList.remove('transpBButtons'); }, delay); })
three_div.addEventListener("mouseup", function() { setTimeout(function() { three_div.classList.remove('transpBButtons'); }, delay); })
four_div.addEventListener("mouseup", function() { setTimeout(function() { four_div.classList.remove('transpBButtons'); }, delay); })
five_div.addEventListener("mouseup", function() { setTimeout(function() { five_div.classList.remove('transpBButtons'); }, delay); })
six_div.addEventListener("mouseup", function() { setTimeout(function() { six_div.classList.remove('transpBButtons'); }, delay); })
seven_div.addEventListener("mouseup", function() { setTimeout(function() { seven_div.classList.remove('transpBButtons'); }, delay); })
eight_div.addEventListener("mouseup", function() { setTimeout(function() { eight_div.classList.remove('transpBButtons'); }, delay); })
nine_div.addEventListener("mouseup", function() { setTimeout(function() { nine_div.classList.remove('transpBButtons'); }, delay); })
