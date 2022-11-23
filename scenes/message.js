const { Markup, Composer, Scenes } = require('telegraf');

const startStep = new Composer();
startStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('Введите текст заявки')
        return ctx.scene.leave()
    } catch (e) {
        console.log(e)
    }
})

const messageScene = new Scenes.WizardScene('messageScene', startStep);
module.exports = messageScene;