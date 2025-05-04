var crunch = document.getElementById("crunchsound");
var music = document.getElementById("music");
var swoosh = document.getElementById("swoosh");
var click = document.getElementById("click");
var coin = document.getElementById("coin");
var error = document.getElementById("error");
var bell = document.getElementById("bell");
var baking = document.getElementById("baking");
var ding = document.getElementById("ding");
var menu = document.querySelector(".menu");
var returnButton = document.querySelector("#decision .return");
var purchase = document.querySelector(".purchase");
var thankyou = purchase.querySelector(".thankyou");
var bakingDisplay = document.querySelector(".bakingDisplay");
var ovencontainer = bakingDisplay.querySelector(".ovencontainer");
var stats = document.querySelector(".stats");
var message = stats.querySelector("#message");
var msgtext = message.querySelector("#msgtext");
var dialogue = document.querySelector("#dialogue");
var nextBtn = document.querySelector("#next");
var prevBtn = document.querySelector("#previous");
var seeds = document.getElementById("seeds-amt");
var fullnessamt = document.getElementById("hunger-amt");
var gameTimeElement = document.getElementById("gameTime");
var seconds = 0;
var timerInterval;

// INITIALIZE VALUES
document.addEventListener('DOMContentLoaded', function() {
    seeds.textContent = 20;
    fullnessamt.textContent = "100% FULLNESS";
    fullness = 100;
    startTimer();
});

let volume = document.getElementById('volume-slider');
volume.addEventListener("change", function(e) {
    music.volume = e.currentTarget.value / 100;
})


const notifContainer = document.getElementById("notif-cont");

const currentCookie = {
    dough: null,
    addons: {
        aroma: null,
        crunch: null,
        flavor: null
    },
    stats: {
        taste: 0,
        aroma: 0,
        crunch: 0,
        satisfaction: 0
    }
};

var consumed = [];
var musicplaying = false;

var GAMEOVER = document.querySelector("#gameover");
GAMEOVER.style.display = "none";

stats.style.display = "none";

var display = true;
var displayedCookie = "";
var bites = 0;

document.addEventListener('click', function() {
    if (!musicplaying) {
        music.play();
        musicplaying = true;
    }
});

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }  

let slideIndex = 1;
showSlides(slideIndex);

// next / previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
    boop.play();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let sections = [
        document.getElementById("section1"),
        document.getElementById("section2"),
        document.getElementById("section3"),
        document.getElementById("section4"),
        document.querySelector(".bakingDisplay"),
        document.getElementsByClassName("stats")
    ];
    
    if (n > sections.length) {slideIndex = 4} // stop at 4
    if (n < 1) {slideIndex = 1} // stop at 1
    
    // First show the menu container
    menu.style.display = "block";
    
    // Hide all sections
    for (i = 0; i < 4; i++) {
        if (sections[i]) {
            sections[i].style.display = "none";
        }
    }
    
    sections[slideIndex-1].style.display = "block"; // show the current slide
    
    const sectionTitles = [
        "[ 1 ] base : dough",
        "[ 2 ] add-on : scent",
        "[ 3 ] add-on : crunchiness",
        "[ 4 ] add-on : flavor"
    ];
    document.getElementById("sectiontitle").textContent = sectionTitles[slideIndex-1];

    // first and last slide -> change nav btns =========

    const signature = document.querySelector("#signature");
    if (slideIndex === 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        signature.classList.remove("hide");
        signature.classList.add("show");
    } else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
        signature.classList.remove("show");
        signature.classList.add("hide");
    }
    if (slideIndex === 4) {
        nextBtn.classList.add("bake-style"); // add "start baking" btn
        nextBtn.textContent = "Start Baking →";
        nextBtn.onclick = bakeCookie; 
    }
    else {
        nextBtn.classList.remove("bake-style"); // remove "start baking" btn
        nextBtn.textContent = "Skip →";
        nextBtn.onclick = function() { plusSlides(1); };
    }
}

// =============================== FOOTER ======================

function hideShow() {
  if (display) {
    bottomContainer.style.display = "none";
    boop.play();
  }
  else {
    bottomContainer.style.display = "block";
  }
  display = !display;
}


// =============================== FULLNESS COUNTER ===============================

var fullness = 100;
function startHunger() {
    var hungerInterval;
    hungerInterval = setInterval(function() {
        if (fullness > 0) {
            fullness--;
            fullnessamt.textContent = fullness + "% FULLNESS";
        } else {
            gameOver();
        }
    }, 1500);
}

// =============================== DOUGH CLICK LISTENER ===============================

document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", function() {
        const name = this.querySelector(".name").textContent.trim();
        // match name
        let selectedDough = null; // reset
        for (let type in dough) {
            if (dough[type].name === name) {
                selectedDough = type;
                break; // exit loop
            }
        }
        if (selectedDough) {
            updateCookie(selectedDough);
            click.play();
            slideIndex = 2;
            showSlides(slideIndex);
        }
    });
});


// ====================== COOKIE SELECTION PROCESS ============================

const dough = {
    choco: {
        name: 'chunk o\' double choco',
        image: 'assets/dough/chocolatechunk.png'
    },
    pecan: {
        name: 'brown sugar with pecan',
        image: 'assets/dough/pecansugar.png'
    },
    vanilla: {
        name: 'soft vanilla and chocolate',
        image: 'assets/dough/softvanilla.png'
    },
    cinnamon: {
        name: 'vegan salty cinnamon',
        image: 'assets/dough/cinnamon.png'
    }
};

// define add on items for category
const aroma_ao = [null, 'mist', 'jar'];
const crunch_ao = [null, 'chill', 'heat'];
const flavor_ao = [null, 'filling', 'dust'];

const addOns = {
    mist: {
        name: 'mystic mist',
        category: 'aroma',
        price: 3
    },
    jar: {
        name: 'magic jar',
        category: 'aroma',
        price: 1
    },
    chill: {
        name: 'chill',
        category: 'crunch',
        price: 2
    },
    heat: {
        name: 'higher temp',
        category: 'crunch',
        price: 1
    },
    filling: {
        name: 'filling',
        category: 'flavor',
        price: 3
    },
    dust: {
        name: 'fairy dust',
        category: 'flavor',
        price: 2
    }
};

const type = {
    aroma: ['mist', 'jar'],
    crunch: ['chill', 'heat'],
    flavor: ['filling', 'toppings']
};

// ====================== DOUGH SELECTION ======================

function updateCookie(selectedDough) {
    currentCookie.dough = selectedDough;
    currentCookie.addons = {
        aroma: null,
        crunch: null,
        flavor: null,
    };
    currentCookie.stats = {
        taste: 0,
        aroma: 0,
        crunch: 0,
        satisfaction: 0
    };

    console.log("Selected dough:", currentCookie.dough);

    // add notification
    const newNotif = document.createElement("div");
    newNotif.className = "notif";
    newNotif.innerHTML = `
        <div class="notif-text">
            <p>new cookie with ${currentCookie.dough} dough</p>
        </div>`;
    notifContainer.insertBefore(newNotif, notifContainer.firstChild); // first child = notif item
    notifContainer.scrollTop = 0;

    // reset navigation buttons
    prevBtn.classList.remove("hide");
    nextBtn.classList.remove("hide");
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
        
}

// ==================== ADDON FUNCTION ==================

let aroma_index = 0;
let crunch_index = 0;
let flavor_index = 0;
let totalprice = document.querySelector("#total-price");
totalprice.textContent = 0;

console.log('Setting up addon event listeners');
const addons = document.querySelectorAll(".addon");
console.log('Found addons:', addons.length);

addons.forEach(addon => {
    addon.addEventListener("click", function() {
        console.log('Addon clicked:', this.id);
        
        // get addon id (crunch, aroma, flavor)
        const addonId = this.id;
        const addon = addOns[addonId];
        
        // calculate proposed total price
        let proposed_ao = parseInt(totalprice.textContent || 0) + addon.price;
        
        // check if enough seeds for proposed total
        if (parseInt(seeds.textContent) < proposed_ao) {
            error.currentTime = 0;  // reset if spam
            error.play();
            // add notif
            const newNotif = document.createElement("div");
            newNotif.className = "notif";
            newNotif.innerHTML = `
                <div class="notif-text">
                    <p> error: insufficient seeds </p>
                </div>`;
            notifContainer.insertBefore(newNotif, notifContainer.firstChild);
            notifContainer.scrollTop = 0;
            return; // prevent addon selection
        }
        else {
            click.currentTime = 0; // reset if spam
            click.play();
        }
        
        // update addon and calculate new total
        addAddon(addonId);

        // for slide -> 
        if (slideIndex === 2) { // aroma section
            aroma_index = aroma_ao.indexOf(addonId); // find index of item in aroma-ao array ===
            addAddon(addonId);
            console.log('aroma_index:', aroma_index);
            slideIndex++; // next slide
            showSlides(slideIndex);
        } else if (slideIndex === 3) { // crunch section
            crunch_index = crunch_ao.indexOf(addonId);
            addAddon(addonId);
            slideIndex++; // next slide
            showSlides(slideIndex);
        } else if (slideIndex === 4) { // flavor section
            flavor_index = flavor_ao.indexOf(addonId);
            addAddon(addonId);
            // bake action
            const nextBtn = document.querySelector("#next");
            nextBtn.classList.add("bake-style");
            nextBtn.textContent = "Start Baking →";
            nextBtn.onclick = bakeCookie;

            // add notif
            const newNotif = document.createElement("div");
            newNotif.className = "notif";
            newNotif.innerHTML = `
                <div class="notif-text">
                    <p> you may begin baking </p>
                </div>`;
            notifContainer.insertBefore(newNotif, notifContainer.firstChild); // first child = notif item
            notifContainer.scrollTop = 0;
        }

    });
});

function addAddon(addonId) {
    const addon = addOns[addonId];
    if (addon) {
        currentCookie.addons[addon.category] = addonId;
        console.log(`Added ${addon.name} to ${addon.category}`);
        
        // UPDATE CALC IMAGE
        const addonImg = document.querySelector(`#${addon.category}img`);
        if (addonImg) {
            console.log(`Setting image for ${addon.category}: assets/add-ons/${addonId}.png`);
            addonImg.src = `assets/add-ons/${addonId}.png`;
        }

        // CALCULATOR PRICE UPDATE
        const priceDiv = document.querySelector(`[data-addon-id="${addon.category}"]`);
        if (priceDiv) {
            priceDiv.innerHTML = `${addon.price} <img draggable="false" class="price" src="assets/seed.png">`;
        }

        // CALCULATE PRICE TOTAL
        if (totalprice) {
            let total = 0;
            if (currentCookie.addons.aroma) total += addOns[currentCookie.addons.aroma].price;
            if (currentCookie.addons.crunch) total += addOns[currentCookie.addons.crunch].price;
            if (currentCookie.addons.flavor) total += addOns[currentCookie.addons.flavor].price;
            totalprice.textContent = `${total}`;
        }
    }
}

// ============================ BAKE COOKIE =========================

function bakeCookie() {
    
    boop.play();
    // deduct seeds first
    const totalprice = document.querySelector("#total-price");
    if (totalprice && totalprice.textContent) {
        seeds.textContent = parseInt(seeds.textContent) - parseInt(totalprice.textContent);

    // add notif
    const newNotif = document.createElement("div");
    newNotif.className = "notif";
    newNotif.innerHTML = `
        <div class="notif-text">
            <p>paid ${totalprice.textContent} seeds</p>
        </div>`;
    notifContainer.insertBefore(newNotif, notifContainer.firstChild); // first child = notif
    notifContainer.scrollTop = 0;
    }

    // Hide menu and show purchase div
    menu.style.display = "none";
    purchase.style.display = "block";
    bakingDisplay.style.display = "block";
    
    // hide navigation buttons
    document.querySelector("#next").style.display = "none";
    document.querySelector("#previous").style.display = "none";
    
    // Show the oven
    ovencontainer.style.display = "block";
    
    // After 3 seconds
    setTimeout(function() {
        ovencontainer.style.display = "none";
        swoosh.play();
        
        // Show stats
        stats.style.display = "block";
        purchase.style.display = "none";
        generator();
    }, 3000);

}

// ============================ CALCULATES ADDON EFFECT =========================

function addonRate(baseValue, addonId) {
    if (addonId) {
        const addon = addOns[addonId];
        if (addon) {
            // base value + addon price
            return baseValue + (addon.price) * 1.5; // 1.3 is the rate of increase
        }
    }
    return baseValue;
}

// ============================ STATS GENERATOR =========================

function generator() {
    var satisfaction = stats.querySelector("#satisfaction_value");
    var difference = stats.querySelector("#difference_value");
    var flavor = stats.querySelector("#flavor_value");
    var crunch = stats.querySelector("#crunch_value");
    var aroma = stats.querySelector("#aroma_value");

    var flavor_progress = stats.querySelector("#flavor_progress");
    var crunch_progress = stats.querySelector("#crunch_progress");
    var aroma_progress = stats.querySelector("#aroma_progress");

    ding.play();
    
    // set extreme values
    flavor_progress.max = 10;
    crunch_progress.max = 10;
    aroma_progress.max = 10;
    var min_value = 0;
    var max_value = 10;
    
    // calculate base values (before addonRate)
    let baseFlavor = Math.floor(Math.random() * (max_value + 1)); // [ + 1 is to include 0 ]
    let baseCrunch = Math.floor(Math.random() * (max_value + 1));
    let baseAroma = Math.floor(Math.random() * (max_value + 1));
    
    // calculate base satisfaction
    let baseSatisfaction = Math.floor((baseFlavor + baseCrunch + baseAroma) / 3);
    
    // apply addonRate to get final values
    if (flavor) {
        flavor.value = addonRate(baseFlavor, currentCookie.addons.flavor);
        console.log("flavor: " + flavor.value);
        flavor_progress.value = flavor.value;
    }
    
    if (crunch) {
        crunch.value = addonRate(baseCrunch, currentCookie.addons.crunch);
        console.log("crunch: " + crunch.value);
        crunch_progress.value = crunch.value;
    }
    
    if (aroma) {
        aroma.value = addonRate(baseAroma, currentCookie.addons.aroma);
        console.log("aroma: " + aroma.value);
        aroma_progress.value = aroma.value;
    }
    
    if (satisfaction) {
        //  final satisfaction after addonRate
        let finalSatisfaction = Math.floor((flavor.value + crunch.value + aroma.value) / 3);

        if (finalSatisfaction > 10) {
            satisfaction.textContent = 10;
        } else {
            satisfaction.textContent = finalSatisfaction;
        }

        var points = satisfaction.textContent;
        console.log("points: " + points);
        console.log("satisfaction: " + finalSatisfaction);
        
        // display base satisfaction
        if (difference) {
            let satisfactionDiff = baseSatisfaction;
            difference.textContent = `${satisfactionDiff}`;
        }
    
        var result = stats.querySelector("#result");
        if (points >= 5) {
            result.textContent = "gain";
        } else {
            result.textContent = "loss";
        }
        console.log("points: " + points);

    }

    if (dialogue) {
        if (points >= 9) {
            dialogue.textContent = '"this cookie came out perfect!"';
        } else if (points >= 7) {
            dialogue.textContent = '"not bad!"';
        } else if (points >= 4) {
            dialogue.textContent = '"it\'s not horrible..."';
        } else {
            dialogue.textContent = '"is this even edible?"';
        }
    }


    updateDecisionValues(points);
}

    function clearAddonImages() {
        const aromaImg = document.querySelector('#aromaimg');
        const crunchImg = document.querySelector('#crunchimg');
        const flavorImg = document.querySelector('#flavorimg');
        const totalprice = document.querySelector('#total-price');
        
        if (aromaImg) {
            aromaImg.src = '';
        }
        if (crunchImg) {
            crunchImg.src = '';
        }
        if (flavorImg) {
            flavorImg.src = '';
        }
    
        // clear prices
        const priceDivs = document.querySelectorAll('.addon-item-price');
        priceDivs.forEach(div => {
            div.innerHTML = ``;
        });
        if (totalprice) {
            totalprice.innerHTML = '';
        }
}

    // ========================== DECISION SELL / EAT =======================

    function updateDecisionValues(points) {
    var sellval = document.getElementById("sell_value");
    var eatval = document.getElementById("eat_value");

    if (points >= 5) {
        sellval.textContent = points;
        eatval.textContent = Math.floor(points * 1.5) + "%";
    } else if (points >= 10) {
        sellval.textContent = 15;
        eatval.textContent = Math.floor(15 * 1.5) + "%";
    } else {
        sellval.textContent = -5 - points;
        eatval.textContent = Math.floor((-5 - points) * 1.5) + "%";
    }
    }

    // ========= sell cookie ==============

    document.getElementById("sell").addEventListener("click", function() {
    var sellval = document.getElementById("sell_value");
    var currentSeeds = parseInt(seeds.textContent);
    var newSeeds = currentSeeds + parseInt(sellval.textContent);

    coin.play();
        
        // update seeds amt
        seeds.textContent = Math.max(0, newSeeds); // caps seeds at 0 + returns larger #

        // add notif
        const newNotif = document.createElement("div");
        newNotif.className = "notif";
        newNotif.innerHTML = `
            <div class="notif-text">
                <p>sold cookie for ${sellval.textContent} seeds </p>
            </div>`;
        notifContainer.insertBefore(newNotif, notifContainer.firstChild);
        notifContainer.scrollTop = 0;
    });

    // ========= eat cookie ==============
    
    document.getElementById("eat").addEventListener("click", function() {
    var eatval = document.getElementById("eat_value");
    var currentFullness = parseInt(fullnessamt.textContent);

    crunchsound.play();
    
    // update fullness
    fullness = Math.min(100, currentFullness + parseInt(eatval.textContent)); // caps fullness at 100 + returns smaller #
    fullnessamt.textContent = fullness + "% FULLNESS";

    // add notif
    const newNotif = document.createElement("div");
    newNotif.className = "notif";
    newNotif.innerHTML = `
        <div class="notif-text">
            <p>ate cookie for ${eatval.textContent} fullness</p>
        </div>`;
    notifContainer.insertBefore(newNotif, notifContainer.firstChild);
    notifContainer.scrollTop = 0;
    });

// return class =====================================================
document.querySelectorAll("#decision .return").forEach(button => {
    button.addEventListener("click", function() {
        menu.style.display = "block";
        stats.style.display = "none";
        resetCookie();
        slideIndex = 1; // reset to first slide
        showSlides(slideIndex);
        clearAddonImages();

        // dialogue randomizer
        const dialogueOptions = [
            "let's make another cookie!",
            "what's next?",
            "what do you want to make?",
            "what's your favorite cookie?",
            "make sure you don't run out of seeds!",
            "keep an eye on my fullness please...",
            "let's keep baking!",
            "this is tedious labor... at least i get paid",
            "this van is a money machine!",
            "maybe i should write a book called 'cotton and the cookie factory'",
            "you better not just feed me scraps!",

        ];
        dialogue.textContent = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
    });
});

// reset cookei
function resetCookie() {
    currentCookie.dough = null;
    currentCookie.addons = {
        aroma: null,
        crunch: null,
        flavor: null,
    };
    currentCookie.stats = {
        taste: 0,
        aroma: 0,
        crunch: 0,
        satisfaction: 0
    };
    clearAddonImages();
    console.log("cookie reset");
}

// ============================ GAMEOVER =========================

function gameOver() {
    GAMEOVER.style.display = "block";
    stopTimer();
}

function restart() {
    window.location.reload();
}

const restartBtn = document.querySelector("#restart");
if (restartBtn) {
    restartBtn.addEventListener("click", restart);
}

// ============================ START =========================

document.getElementById("cookievan").addEventListener("click", function() {
    document.getElementById("intro").classList.add("hide");
    setTimeout(function() {
        document.getElementById("intro").style.display = "none";
        // start hunger countdown
        startHunger();
    }, 1000);
    bell.play();
});

function directions() {
    document.getElementById("howtoplay").style.display = "block";
    document.getElementById("directions").style.display = "none";
    paper.play();
}

function okbutton() {
    document.querySelector(".bottom-container").style.display = "none";
    boop.play();
}

function startTimer() {
    seconds = 0;
    timerInterval = setInterval(function() {
        seconds++;
        gameTimeElement.textContent = seconds + " seconds";
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}