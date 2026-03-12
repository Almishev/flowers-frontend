import nodemailer from "nodemailer";

// Изпраща имейл с обобщение на поръчката
export async function sendOrderEmail({ order, lineItems }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.ORDER_NOTIFY_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass || !toEmail) {
    console.warn("SMTP credentials or ORDER_NOTIFY_EMAIL are not configured. Skipping order email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const itemsHtml =
    Array.isArray(lineItems) && lineItems.length > 0
      ? `<ul>${lineItems
          .map((item) => {
            const name = item.price_data?.product_data?.name || "Продукт";
            const qty = item.quantity || 1;
            const amount = (item.price_data?.unit_amount || 0) / 100;
            return `<li>${name} × ${qty} – ${amount.toFixed(2)} EUR</li>`;
          })
          .join("")}</ul>`
      : "<p>Няма детайли за продукти.</p>";

  const total = typeof order.total === "number" ? order.total.toFixed(2) : "N/A";

  const html = `
    <h2>Нова поръчка от Flowers Boutique MIA</h2>
    <p><strong>Име:</strong> ${order.name || ""}</p>
    <p><strong>Имейл:</strong> ${order.email || ""}</p>
    <p><strong>Телефон:</strong> ${order.phone || ""}</p>
    <p><strong>Адрес за доставка:</strong><br/>
      ${order.streetAddress || ""}<br/>
      ${order.postalCode || ""} ${order.city || ""}<br/>
      ${order.country || ""}</p>
    <h3>Продукти:</h3>
    ${itemsHtml}
    <p><strong>Общо:</strong> ${total} EUR</p>
    <p><strong>Метод на плащане:</strong> ${order.paymentMethod || "cash"}</p>
    <p><strong>Статус на плащане:</strong> ${order.paid ? "Платена" : "Наложен платеж / неплатена"}</p>
    <hr/>
    <p>Този имейл е генериран автоматично от онлайн магазина.</p>
  `;

  await transporter.sendMail({
    from: `"Flowers Boutique MIA" <${smtpUser}>`,
    to: toEmail,
    subject: `Нова поръчка #${order._id.toString()}`,
    html,
  });
}

