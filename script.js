var footer = document.querySelector(".footer");
var crunch = document.getElementById("crunchsound");
var music = document.getElementById("music");
var swoosh = document.getElementById("swoosh");
var click = document.getElementById("click");
var menu = document.querySelector(".menu");
var purchase = document.querySelector(".purchase");
var thankyou = purchase.querySelector(".thankyou");
var cookieImage = purchase.querySelector(".cookieDisplay .cookieimg");
var returnButton = document.querySelector(".receipt-top .return");
var cookieDisplay = purchase.querySelector(".cookieDisplay");
var bagcontainer = cookieDisplay.querySelector(".bagcontainer");
var cookieimg = cookieDisplay.querySelector(".cookieimg");
var stats = document.querySelector(".stats");
var message = stats.querySelector("#message");
var msg_text = message.querySelector("#msgtext");


var consumed = [];
var musicplaying = false;

stats.style.display = "none";

var display = true;
var displayedCookie = "";
var bites = 0;

window.onload = function() {
  window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
  });
}

document.addEventListener('click', function() {
    if (!musicplaying) {
        music.play();
        musicplaying = true;
    }
});

// hide and show footer ===================================================== 

function hideShow() {
  if (display) {
    footer.style.display = "none";
    boop.play();
  }
  else {
    footer.style.display = "block";
  }
  display = !display;
}

// item click listener -> bite cookie =============================================

document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("click", function() {
      const name = this.querySelector(".name").textContent.trim(); // get cookie
      showPurchase(name); // show purchase div w selected cookie
  });
});

// bite cookie function =====================================================

cookieImage.addEventListener("click", biteCookie);

function biteCookie() {
    if (!displayedCookie) return;
    
    bites++;
    new Audio(crunchsound.src).play();
    
    if (bites === 1) {
        cookieImage.src = `assets/${displayedCookie}2.png`;
    } else if (bites === 2) {
        cookieImage.src = `assets/${displayedCookie}3.png`;
    } else if (bites === 3) {
        consumed.push(displayedCookie);
        cookieImage.style.display = "none";
        generator();
        
        bites = 0;
        displayedCookie = "";
        stats.style.display = "block";
        returnButton.style.display = "block";
        thankyou.style.display = "none";
        purchase.style.display = "none";

    } else {
        stats.style.display = "none";
    }
}

function generator() {
    var satisfaction = stats.querySelector("#satisfaction_value");
    var flavor = stats.querySelector("#flavor_value");
    var crunch = stats.querySelector("#crunch_value");
    var aroma = stats.querySelector("#aroma_value");

    var flavor_progress = stats.querySelector("#flavor_progress");
    var crunch_progress = stats.querySelector("#crunch_progress");
    var aroma_progress = stats.querySelector("#aroma_progress");
    
    // set extreme values
    flavor_progress.max = 10;
    crunch_progress.max = 10;
    aroma_progress.max = 10;
    var min_value = 0;
    var max_value = 10;
    
    // generates a random value for each stat 1-10
    
    if (flavor) {
        flavor.value = Math.floor(Math.random() * (max_value + 1) + min_value);
        console.log("flavor: " + flavor.value);
        flavor_progress.value = flavor.value;
    }
    
    if (crunch) {
        crunch.value = Math.floor(Math.random() * (max_value + 1) + min_value);
        console.log("crunch: " + crunch.value);
        crunch_progress.value = crunch.value;
        console.log("crunch progress: " + crunch_progress.value);
    }
    
    if (aroma) {
        aroma.value = Math.floor(Math.random() * (max_value + 1) + min_value);
        console.log("aroma: " + aroma.value);
        aroma_progress.value = aroma.value;
        console.log("aroma progress: " + aroma_progress.value);
    }
    
    if (satisfaction) {
        satisfaction.value = Math.floor((flavor.value + crunch.value + aroma.value) / 3);
        satisfaction_value.textContent = satisfaction.value;
        console.log("satisfaction: " + satisfaction.value);
    }

    if (msg_text) {
        if (satisfaction.value >= 9) {
            msg_text.textContent = '"that was a great cookie!"';
        } else if (satisfaction.value >= 7) {
            msg_text.textContent = '"not bad, tasty."';
        } else if (satisfaction.value >= 4) {
            msg_text.textContent = '"it\'s not horrible..."';
        } else {
            msg_text.textContent = '"is this even edible?"';
        }
    }
}

function showPurchase(selectedCookie) {
    menu.style.display = "none";
    purchase.style.display = "block";
    thankyou.style.display = "block";
    cookieDisplay.style.display = "block";
    cookieimg.style.display = "none";
    click.play();

    // part one - show the bag
    bagcontainer.style.display = "block";
    thankyou.textContent = `packing cookie...`;
    
    // part two - after 3 seconds show cookie
    setTimeout(function() {
        thankyou.textContent = `thanks for purchasing. enjoy your ${selectedCookie} cookie!`;
        
        bagcontainer.style.display = "none";
        cookieimg.style.display = "block";
        swoosh.play();
        
        // cookie + log
        bites = 0;
        
        if (selectedCookie === "choco chip") {
            cookieImage.src = "assets/choco.png";
            displayedCookie = "choco";
        } else if (selectedCookie === "sugar frost") {
            cookieImage.src = "assets/sugar.png";
            displayedCookie = "sugar";
        } else if (selectedCookie === "oatmeal crunch") {
            cookieImage.src = "assets/oatmeal.png";
            displayedCookie = "oatmeal";
        }

        document.getElementById("cookiename_value").textContent = displayedCookie; // for receipt later
        console.log("cookie consumed:", displayedCookie);
        
    }, 3000); // 3 seconds timing
}

// consumed cookies (wip) =====================================================

function showConsumed() {
  console.log("cookies consumed:", consumed);
}

document.querySelector(".receiptbutton").addEventListener("click", function() {
  showConsumed();
});

// return message =====================================================

returnButton.addEventListener("click", function() {
    menu.style.display = "block";
    purchase.style.display = "none";
    stats.style.display = "none";
    returnButton.style.display = "none";
    boop.play();
});

