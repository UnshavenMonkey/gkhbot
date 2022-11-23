const { Telegraf, Markup, Scenes, session} = require('telegraf');
require('dotenv').config();
const messageScene = require('./scenes/message');
// const text = require('./const');
// const main = require('./statemebtFunc');

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([messageScene]);
bot.use(session());
bot.use(stage.middleware());

bot.action('info', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML('здесь будет информация')
    } catch(e) {
        console.error(e);
    }
});

bot.action('create_msg', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.scene.enter('messageScene')
    } catch(e) {
        console.error(e);
    }
});

bot.start(async (ctx) => {
    await ctx.replyWithHTML('<b>Выберите действие</b>', Markup.inlineKeyboard([
        [Markup.button.callback('Информация о ЖКХ', 'info')],
        [Markup.button.callback('Создать заявку', 'create_msg')]
    ]))
});
// bot.start((ctx) => ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : ''}, меня зовут Валера.`));
// bot.help((ctx) => ctx.reply(text.commands));
//
// bot.command('message', async (ctx) => {
//     try {
//         await ctx.replyWithHTML('<b>Создать заявку в ЖКХ</b>', Markup.inlineKeyboard(
//             [
//                 [Markup.button.callback('Заявка', 'btn_zav')]
//             ]
//         ))
//     } catch(e) {
//         console.error(e);
//     }
//     main().catch((error) => console.error(error));
// })

// addActionBot('btn_zav', text.textStatement)

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));