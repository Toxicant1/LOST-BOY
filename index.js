// LOST-BOY MD - POWERED BY ISHAQ IBRAHIM

require('./config')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    Browsers,
} = require('@whiskeysockets/baileys');
const {
    Boom
} = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const {
    serialize,
    WAConnection,
    sleep
} = require('./lib/myfunc')
const {
    smsg
} = require('./lib/myfunc')
const FileType = require('file-type');
const path = require('path');
const _ = require('lodash');
const moment = require('moment-timezone')
const {
    exec
} = require("child_process");
const PhoneNumber = require('awesome-phonenumber');
const { version, isLatest } = require('./lib/update')
const {
    color
} = require('./lib/color')
const { banner } = require('./lib/banner')
const connectToWhatsApp = async () => {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState('./session')
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()
    const client = makeWASocket({
        logger: pino({
            level: 'silent'
        }),
        printQRInTerminal: true,
        browser: Browsers.macOS('LostBoy'),
        auth: state,
        version
    })

    client.ev.on('creds.update', saveCreds)

    client.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete Session and Scan Again`);
                process.exit();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                connectToWhatsApp();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                process.exit();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Scan Again And Run.`);
                process.exit();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                connectToWhatsApp();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                connectToWhatsApp();
            } else {
                console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
                connectToWhatsApp();
            }
        } else if (connection === "open") {
            console.log(chalk.green.bold('✅ LOSTBOY is now connected!'));
        }
    })

    client.ev.on('messages.upsert', async (m) => {
        try {
            mek = m.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!client.public && !mek.key.fromMe) return
            const mtype = Object.keys(mek.message)[0]
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const quoted = mek.quoted ? mek.quoted : mek
            const body = (mtype === 'conversation') ? mek.message.conversation :
                (mtype == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption :
                    (mtype == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption :
                        (mtype == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text :
                            (mtype == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ?
                                mek.message.buttonsResponseMessage.selectedButtonId :
                                (mtype == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId ?
                                    mek.message.listResponseMessage.singleSelectReply.selectedRowId :
                                    (mtype == 'templateButtonReplyMessage') && mek.message.templateButtonReplyMessage.selectedId ?
                                        mek.message.templateButtonReplyMessage.selectedId :
                                        (mtype === 'messageContextInfo') ? (mek.message.buttonsResponseMessage?.selectedButtonId || mek.message.listResponseMessage?.singleSelectReply.selectedRowId || '') :
                                            ''
            const budy = (typeof mek.message.conversation === 'string') ? mek.message.conversation : ''
            mek.msg = mek.message
            mek.sender = mek.key.fromMe ? client.user.id.split(':')[0] + '@s.whatsapp.net' : mek.key.participant ? mek.key.participant : mek.key.remoteJid
            mek.from = mek.key.remoteJid
            mek.isGroup = mek.key.remoteJid.endsWith('@g.us')
            mek.groupMetadata = mek.isGroup ? await client.groupMetadata(mek.from) : ''
            mek.groupName = mek.isGroup ? mek.groupMetadata.subject : ''
            mek.participant = mek.isGroup ? mek.key.participant : ''
            mek.pushName = mek.pushName || 'No Name'
            mek.args = body.trim().split(/ +/).slice(1)
            mek.text = body
            mek.command = body.startsWith(global.prefix) ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null

            require('./message/msg')(client, mek, m)
        } catch (err) {
            console.log(err)
        }
    })

    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ', err)
    })
}

connectToWhatsApp()