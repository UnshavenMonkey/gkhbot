const { Markup, Composer, Scenes } = require('telegraf');
const main = require('../statemebtFunc.js')

const startStep = new Composer();
startStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.user = await main().catch((error) => console.error(error));
        return ctx.scene.leave()
    } catch (e) {
        console.log(e)
    }
})

const messageScene = new Scenes.WizardScene('messageScene', startStep);
module.exports = messageScene;