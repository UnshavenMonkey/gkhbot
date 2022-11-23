const { Markup, Composer, Scenes } = require('telegraf');
const main = require('../statemebtFunc.js')

const startStep = new Composer();
startStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.user = await main().catch((error) => console.error(error));
        ctx.wizard.state.adress = ctx.message.text
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
})

const messageScene = new Scenes.WizardScene('messageScene', startStep);
module.exports = messageScene;