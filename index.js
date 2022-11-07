const { Telegraf, Markup} = require('telegraf');
require('dotenv').config();
const text = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : ''}, меня зовут Валера.`));
bot.help((ctx) => ctx.reply(text.commands));

bot.command('message', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Обратиться в ЖКХ</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Обращение', 'btn_mes')],
                [Markup.button.callback('Заявка', 'btn_zav')]
            ]
        ))
    } catch(e) {
        console.error(e);
    }
})

function addActionBot(name, text) {
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.replyWithHTML(text)
        } catch(e) {
            console.error(e);
        }
    })
}
addActionBot('btn_mes', text.textMes)
addActionBot('btn_zav', text.textZav)

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));