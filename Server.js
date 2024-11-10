const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 5000;

const transporter = nodemailer.createTransport({
    service: 'mail.ru',
    host: 'smtp.mail.ru',
    port: 25,
    auth: {
        user: 'myemail@mail.ru', // Почта с которой будут отправляться письма
        pass: 'myemailpassword', // Пароль для внешних приложений
    },
});

// для разбора `application/json`
app.use(express.json());
// для разбора application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const headers = function (_req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Credentials');
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); - для fetch credentials: 'include',
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};

app.use(headers);

// TODO: Проверка аутентификации и загрузка данных пользователя:
// app.all('*', requireAuthentication, loadUser)

app.post('/sendEmail', function (req, res) {
    // Данные приходящие с полей формы
    const { name, phone, email, message, title } = req.body;

    const mailOptions = {
        from: `${title} <eltebi@mail.ru>`,
        to: 'eltebi@mail.ru', // Целевая почта для отправки (в данном случае отправляем себе)
        subject: title,
        html: `
	 			<p><b>Name:</b> ${name}</p>
	 			<p><b>Phone:</b> ${phone}</p>
	 			<p><b>Email:</b> ${email}</p>
	 			<p><b>Message:</b> ${message}</p>`,
        text: `Name: ${name}; Phone: ${phone}; Email: ${email}; Message: ${message}`,
        replyTo: email,
    };

    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.error('error: ', error);
            res.status(500).send({ isLetterSent: false, error });
        } else {
            console.log('Letter sent: ' + JSON.stringify(req.body));
            res.status(200).send({ isLetterSent: true });
        }
    });
});

app.listen(port, () => console.log(`Email_server is running on ${port}`));
