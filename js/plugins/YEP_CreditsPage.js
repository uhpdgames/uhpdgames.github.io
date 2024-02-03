/*:
* @plugindesc v1.02 Adds a 'Credits' command to the title screen that
* will take the player to a credits scene.
* @author Yanfly Engine Plugins
*
* @param Note
* @desc
* @type note
* @default
*/
(function () {
    function Window_CreditsPage() {
        this.initialize.apply(this, arguments);
    }

    Window_CreditsPage.prototype = Object.create(Window_Command.prototype);
    Window_CreditsPage.prototype.constructor = Window_CreditsPage;

    Window_CreditsPage.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.openness = 0;
    };

    Window_CreditsPage.prototype.windowWidth = function () {
        return Graphics.boxWidth;
    };

    Window_CreditsPage.prototype.windowHeight = function () {
        return Graphics.boxHeight / 1.5;
    };

  //  const credit = String(PluginManager.parameters('YEP_CreditsPage')['Note']);

    const credit = `\\c[17]Chưa biết đặt tựa đề trò chơi | \\c[2]Phát hành sớm 2022
\\c[6]Thứ tự cốt truyện game: NightMare < ? < OutSchool

\\c[8]Copyright © 2019 UHPD Games
\\c[29]Developed by:\\c[2]UHPD Games

\\c[29]Written/GDD by me
\\c[29] and Parallax Mapping/Code:\\c[2]Ung Hoang Phi Dang

\\c[29]Graphics: \\c[2]nanikasiratkool, Kadokawa
\\c[29]Art: \\c[2]nanikasiratkool
\\c[29]Illustration: \\c[2]Remos Turcuman
\\c[29]Effect Animation: \\c[2]Hadecynn
\\c[29]Character animation: \\c[2]Ung Hoang Phi Dang

\\c[29]Coder: \\c[2]AlBiud436, \\c[2]Quxios, Yanfly, Iavra, and Galv.
\\c[29]The softwares: \\c[2]RPG Maker,
\\c[2]PyxelEdit, Draw.io, Tilde, Twine and Spriter pro.
\\c[29]JS Libraries : \\c[2]Pixijs v5, TWEEN, CrytoJS, EasyStar.js

\\c[29]Background Music: \\c[2]johnleonardfrench and maoudamashii
\\c[29]Sound FX: \\c[2]Imphenzia`;
    Window_CreditsPage.prototype.makeCommandList = function () {
        const CreditsLine = credit.split('\n');
        for (const t of CreditsLine) {
            //if(t){
            this.addCommand(t, 'credit', false, false);
//      }
        }
    };

    Window_CreditsPage.prototype.drawItem = function (index) {
        const rect = this.itemRectForText(index);
        const align = this.itemTextAlign();
        const text = this.commandName(index);
        this.resetTextColor();
        this.changePaintOpacity(1);
        this.drawTextEx(text, rect.x, rect.y, rect.width, align);
    };

    //=============================================================================
// Scene_Title
//=============================================================================

Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    //this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    //this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

    const Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        Scene_Title_createCommandWindow.call(this);
        this.createCreditsWindow();
        this._commandWindow.setHandler('credits', this.commandCredits.bind(this));
    };

    Scene_Title.prototype.createCreditsWindow = function () {
        this._creditsWindow = new Window_CreditsPage();
        this._creditsWindow.setHandler('cancel', this.onCreditsCancel.bind(this));
        this._creditsWindow.setHandler('ok', this.onCreditsOk.bind(this));
        this.addWindow(this._creditsWindow);
    };

    Scene_Title.prototype.commandCredits = function () {
        this._commandWindow.close();
        this._creditsWindow.select(0);
        this._creditsWindow.activate();
        this._creditsWindow.open();
    };

    Scene_Title.prototype.onCreditsCancel = function () {
        this._creditsWindow.close();
        this._commandWindow.activate();
        this._commandWindow.open();
    };

    Scene_Title.prototype.onCreditsOk = function () {
        this._creditsWindow.activate();
    };
    const Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        Window_TitleCommand_makeCommandList.call(this);
        this.addCommand('Credits',"credits",true,false)
    };

})();