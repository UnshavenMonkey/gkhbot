const { Telegraf, Markup, Scenes, session} = require('telegraf');
require('dotenv').config();
const messageScene = require('./scenes/message');
const text = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([messageScene]);
bot.use(session());
bot.use(stage.middleware());

bot.action('info', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML('Управляющая организация ООО "ЖКХ" \nАдрес: г. Заречный проезд Демакова д. 5 \nТелефон call-центрa круглосуточно: 60-44-00')
    } catch(e) {
        console.error(e);
    }
});

bot.action('create_msg', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML('Введите название улицы \n<i>Например: "Ленина, Зеленая, 30-летия Победы"</i>');
        await ctx.scene.enter('messageScene');
    } catch(e) {
        console.error(e);
    }
});

bot.start(async (ctx) => {
    await ctx.reply(`Здравствуйте ${ctx.message.from.first_name ? ctx.message.from.first_name : ''}, меня зовут Валера. Я помогу Вам обратиться в ООО "ЖКХ"`);
    await ctx.replyWithHTML('<b>Выберите действие</b>', Markup.inlineKeyboard([
        [Markup.button.callback('Информация о ЖКХ', 'info')],
        [Markup.button.callback('Создать заявку', 'create_msg')]
    ]))
});

bot.help((ctx) => ctx.reply(text.commands));

bot.command('message', async (ctx) => {
    await ctx.replyWithHTML('<b>Создать заявку в ООО "ЖКХ"</b>', Markup.inlineKeyboard([
        [Markup.button.callback('Создать заявку', 'create_msg')]
    ]))
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));