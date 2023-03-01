import { createTransport } from 'nodemailer';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const runtimeConfig = useRuntimeConfig();

    const transporter = createTransport({
        host: runtimeConfig.smtpHost,
        port: runtimeConfig.smtpPort,
        secure: true,
        auth: {
            user: runtimeConfig.mailUser,
            pass: runtimeConfig.mailPass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = body.message.replace(/\r?\n/g, '<br>');

    const mailOptionsFr = {
        from: body.email,
        to: runtimeConfig.mailUser,
        subject: 'Contact de ' + body.name,
        html: message + ' <br><br> ' + body.name + '<br>' + body.email + (body.tel ? ' <br> ' + body.tel : '')
    };

    const mailOptionsEn = {
        from: body.email,
        to: runtimeConfig.mailUser,
        subject: 'Contact from ' + body.name,
        html: message + ' <br><br> ' + body.name + '<br>' + body.email + (body.tel ? ' <br> ' + body.tel : '')
    };

    try {
        if (body.lang === 'fr') {
            await transporter.sendMail(mailOptionsFr);
        } else {
            await transporter.sendMail(mailOptionsEn);
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Error sending email'
        });
    }

    return {
        statusCode: 200,
        body: 'Email sent'
    };
});