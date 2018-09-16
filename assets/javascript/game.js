$(document).ready(function() {

    var characters = {
      "Obi-Wan Kenobi": {
        name: "Obi-Wan Kenobi",
        health: 250,
        attack: 8,
        imageUrl: "assets/images/obi-wan.jpg",
        enemyAttackBack: 15
      },
      "Luke Skywalker": {
        name: "Luke Skywalker",
        health: 125,
        attack: 14,
        imageUrl: "assets/images/luke-skywalker.jpg",
        enemyAttackBack: 5
      },
      "Darth Sidious": {
        name: "Darth Sidious",
        health: 300,
        attack: 8,
        imageUrl: "assets/images/darth-sidious.jpg",
        enemyAttackBack: 20
      },
      "Darth Maul": {
        name: "Darth Maul",
        health: 200,
        attack: 7,
        imageUrl: "assets/images/darth-maul.jpg",
        enemyAttackBack: 25
      }
    };
  
    
    var currSelectedCharacter;
    
    var combatants = [];
    
    var currDefender;
    
    var turnCounter = 1;
    
    var killCount = 0;
  
  

    var renderOne = function(character, renderArea, charStatus) {
  

      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);
  

         if (charStatus === "enemy") {
         $(charDiv).addClass("enemy");
        }
         else if (charStatus === "defender") {
        
         currDefender = character;
         $(charDiv).addClass("target-enemy");
        }
    };
  
    
    var renderMessage = function(message) {
  
    
      var gameMesageSet = $("#game-message");
      var newMessage = $("<div>").text(message);
      gameMesageSet.append(newMessage);
  
    
         if (message === "clearMessage") {
         gameMesageSet.text("");
        }
    };
  

    var renderCharacters = function(charObj, areaRender) {
  

         if (areaRender === "#characters-section") {
         $(areaRender).empty();

         for (var key in charObj) {

         if (charObj.hasOwnProperty(key)) {
         renderOne(charObj[key], areaRender, "");
        }
        }
        }
  

         if (areaRender === "#selected-character") {
         renderOne(charObj, areaRender, "");
        }
  

         if (areaRender === "#available-to-attack-section") {
  
         for (var i = 0; i < charObj.length; i++) {
         renderOne(charObj[i], areaRender, "enemy");
        }
  

        $(document).on("click", ".enemy", function() {
  

        var name = ($(this).attr("data-name"));
  

         if ($("#defender").children().length === 0) {
            renderCharacters(name, "#defender");
            $(this).hide();
            renderMessage("clearMessage");
        }
        });
        }
  

         if (areaRender === "#defender") {
         $(areaRender).empty();
         for (var i = 0; i < combatants.length; i++) {
         if (combatants[i].name === charObj) {
         renderOne(combatants[i], areaRender, "defender");
        }
        }
        }
  

         if (areaRender === "playerDamage") {
         $("#defender").empty();
         renderOne(charObj, "#defender", "defender");
        }
  

         if (areaRender === "enemyDamage") {
         $("#selected-character").empty();
         renderOne(charObj, "#selected-character", "");
        }
  

         if (areaRender === "enemyDefeated") {
         $("#defender").empty();
        var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";

         renderMessage(gameStateMessage);
        }
    };
  

    var restartGame = function(inputEndGame) {
  

        var restart = $("<button>Restart</button>").click(function() {
         location.reload();
    });
  

    var gameState = $("<div>").text(inputEndGame);
  

         $("body").append(gameState);
         $("body").append(restart);
    };
  
  
         renderCharacters(characters, "#characters-section");
  

    $(document).on("click", ".character", function() {
  

        var name = $(this).attr("data-name");
  
         if (!currSelectedCharacter) {

         currSelectedCharacter = characters[name];

         for (var key in characters) {
         if (key !== name) {
         combatants.push(characters[key]);
        }
        }
  
        
         $("#characters-section").hide();
  
         renderCharacters(currSelectedCharacter, "#selected-character");
         renderCharacters(combatants, "#available-to-attack-section");
        }
    });
  

    $("#attack-button").on("click", function() {
  

            if ($("#defender").children().length !== 0) {
  

        var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
        var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
             renderMessage("clearMessage");
  

         currDefender.health -= (currSelectedCharacter.attack * turnCounter);
  

            if (currDefender.health > 0) {
  

             renderCharacters(currDefender, "playerDamage");
  

             renderMessage(attackMessage);
             renderMessage(counterAttackMessage);
  

         currSelectedCharacter.health -= currDefender.enemyAttackBack;
  

             renderCharacters(currSelectedCharacter, "enemyDamage");
  

            if (currSelectedCharacter.health <= 0) {
             renderMessage("clearMessage");
             restartGame("You been defeated...GAME OVER!!!");

            $("#attack-button").unbind("click");
            }
            }

            else {

             renderCharacters(currDefender, "enemyDefeated");

         killCount++;

            if (killCount >= 3) {
             renderMessage("clearMessage");
             restartGame("You Won!!!! GAME OVER!!!");
            }
            }

         turnCounter++;

            }

            else {
             renderMessage("clearMessage");
             renderMessage("No enemy here.");
            }
    });
  
});