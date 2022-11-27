const { Markup, Composer, Scenes } = require('telegraf');
const main = require('../statemebtFunc.js')

const streetStep = new Composer();
streetStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.ticket = {}
        ctx.wizard.state.ticket.street = ctx.message.text
        await ctx.replyWithHTML('Введите номер дома');
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
})

const msgTextStep = new Composer();
msgTextStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.ticket.build = ctx.message.text
        await ctx.replyWithHTML('Введите текст заявки');
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
})

const buildStep = new Composer();
buildStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.ticket.text = ctx.message.text
        await ctx.replyWithHTML('<b>Отправить заявку</b>', Markup.inlineKeyboard([
            [Markup.button.callback('Отправить', 'send')],
        ]))
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }

})

const sendMsgStep = new Composer();
sendMsgStep.action('send', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        const ticket = await main(ctx.wizard.state.ticket).catch((error) => console.error(error));
        await ctx.replyWithHTML(`Ваша заявка зарегестрирована под номером ${ticket.createTicket.number}`);
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }

})

const messageScene = new Scenes.WizardScene('messageScene', streetStep, msgTextStep, buildStep, sendMsgStep);
module.exports = messageScene;