"use strict";

class ConstantsObject{

    constructor(){
        //Unicode character for :one:, :two:, ...
        this.poll = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
        this.menuAccepted = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "⬅️", "➡️", "❎"];
        //Accepted colors list
        this.colorok = "DEFAULT, AQUA, GREEN, BLUE, PURPLE, GOLD, ORANGE, RED, GREY, NAVY, DARK_AQUA, DARK_GREEN, DARK_BLUE, DARK_PURPLE, DARK_GOLD, DARK_ORANGE, DARK_RED, DARK_GREY, DARKER_GREY, LIGHT_GREY, DARK_NAVY, BLURPLE, GREYPLE, DARK_BUT_NOT_BLACK, NOT_QUITE_BLACK, RANDOM";
    }
}

let constants = new ConstantsObject();

module.exports = constants;
