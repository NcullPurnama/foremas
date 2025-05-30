const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Semua field harus diisi!' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Auto-reply: ${subject}`,
    html: `
      <div style="background-color:#111827; color:white; padding:30px; font-family:Arial,sans-serif;">
        <img src="https://foremas.vercel.app/logo.jpg" alt="Foremas" style="height:40px; margin-bottom:20px;" />
        <h1 style="color:#facc15; font-size:32px; margin-bottom:10px;">Auto-reply :</h1>
        <p style="font-size:18px;">Hello ${name}, Terima Kasih sudah mengirimkan pertanyaan mengenai ${subject}. Kami akan segera menghubungi Anda. Terima Kasih!</p>
        <br />
        <footer style="font-size:12px; margin-top:40px; color:#d1d5db;">
          &copy; Foremas @2025<br />
          email ini dikirim untuk ${email}
        </footer>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email berhasil dikirim' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengirim email' });
  }
};
