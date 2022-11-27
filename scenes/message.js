const { Markup, Composer, Scenes } = require('telegraf');
const main = require('../createTicket.js')

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

const buildStep = new Composer();
buildStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.ticket.build = ctx.message.text
        await ctx.replyWithHTML('Введите номер квартиры');
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
})

const unitStep = new Composer();
unitStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.ticket.unit = ctx.message.text
        await ctx.replyWithHTML('Введите текст заявки');
        return ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
})

const msgTextStep = new Composer();
msgTextStep.on('text', async (ctx) => {
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
        const ticket = await main(ctx.wizard.state.ticket)
        await ctx.replyWithHTML(`Ваша заявка принята и зарегестрирована под номером ${ticket.createTicket.number}`);
        return ctx.scene.leave();
    } catch (e) {
        return ctx.replyWithHTML(`Вы ввели неправильный адрес, пожалуйста попробуйте еще раз`)
    }

})

const messageScene = new Scenes.WizardScene('messageScene', streetStep, buildStep, unitStep, msgTextStep, sendMsgStep);
module.exports = messageScene;