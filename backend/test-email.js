const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jonagigi859@gmail.com',
    pass: 'araw anmn hicf xarn'
  }
});

async function testEmail() {
  console.log('Attempting to send email...');
  try {
    const info = await transporter.sendMail({
      from: '"FBLA Hub Test" <jonagigi859@gmail.com>',
      to: 'jonagigi859@gmail.com',
      subject: 'Nodemailer Test',
      text: 'This is a test email to verify credentials.'
    });
    console.log('Success! Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();
