const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("BODY:", req.body);

  const { name, email, phone, question } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Thiếu name hoặc email"
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const zoomLink = "https://zoom.us/j/123456789";

    await transporter.sendMail({
      from: `"Inception Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Xác nhận đăng ký thành công - Workshop: Nhìn lại 2025",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Chào ${name},</h2>

          <p>
            Cảm ơn bạn đã đăng ký tham dự 
            <b>Workshop: Nhìn lại 2025 - Tổng kết thành tích mùa app 2025-2026</b> 
            do <b>Inception</b> tổ chức.
          </p>

          <p><b>Đăng ký của bạn đã được xác nhận thành công.</b></p>

          <h3>📅 Thông tin tham dự:</h3>
          <p>
            <b>Link Zoom:</b><br/>
            <a href="https://us06web.zoom.us/j/84625681229?pwd=bcSKYVItx15uBhn1FiG3y1ZAUUIoQH.1" target="_blank">
              Tham gia tại đây
            </a>
          </p>

          <h3>🎁 Quà tặng dành cho bạn:</h3>
          <p>Inception gửi tặng bạn bộ tài liệu đặc biệt gồm:</p>
          <ul>
            <li>Ebook "Cẩm nang chiến lược chinh phục học bổng Mỹ"</li>
            <li>Ebook "12 bài luận chinh phục học bổng top 10 đại học Mỹ"</li>
          </ul>

          <p>
            👉 <a href="https://drive.google.com/drive/folders/1_0BNjt-VIW7gQOh0-cc5QWyoYf0D5CiI?usp=sharing" target="_blank">
            Tải tài liệu tại đây
            </a>
          </p>

          <p>
            Bạn vui lòng truy cập link Zoom đúng giờ để không bỏ lỡ phần nào của chương trình.
          </p>

          <p>
            Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng mình qua email này 
            hoặc hotline: <b>0869.2003.05</b>
          </p>

          <p>Hẹn gặp bạn tại workshop!</p>

          <br/>
          <p>Trân trọng,</p>
          <p><b>Inception Writing Consultancy</b></p>
        </div>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Gửi mail thất bại"
    });
  }
});

module.exports = router;