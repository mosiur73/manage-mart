import { resend, EMAIL_FROM } from "./resend"

function orderItemsHtml(items) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.name} &times; ${item.quantity}</td>
          <td style="padding:8px 0; text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("")
}

function orderEmailHtml(title, order, introHtml) {
  const orderNumber = order._id.toString().slice(-8).toUpperCase()
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h2 style="margin-bottom: 4px;">${title}</h2>
      ${introHtml}
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; border-top: 1px solid #e5e7eb;">
        ${orderItemsHtml(order.items)}
      </table>
      <p style="text-align: right; font-weight: bold; margin-top: 8px; border-top: 1px solid #e5e7eb; padding-top: 8px;">
        Total: $${order.total.toFixed(2)}
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Order #${orderNumber}</p>
    </div>
  `
}

/**
 * Both send functions are best-effort — email is a side effect of order
 * fulfillment, never a gate on it. Failures are logged, not thrown, so a
 * misconfigured Resend key can never break checkout or order-status updates.
 */
export async function sendOrderConfirmationEmail(order) {
  if (!order.shippingAddress?.email) return
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: order.shippingAddress.email,
      subject: "Your Manage Mart order is confirmed",
      html: orderEmailHtml(
        `Thanks, ${order.shippingAddress.name || "there"}!`,
        order,
        `<p>We've received your payment and your order is being prepared.</p>`
      ),
    })
  } catch (error) {
    console.error("Failed to send order confirmation email:", error)
  }
}

export async function sendShippingNotificationEmail(order) {
  if (!order.shippingAddress?.email) return
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: order.shippingAddress.email,
      subject: "Your Manage Mart order has shipped",
      html: orderEmailHtml(
        `Your order is on its way, ${order.shippingAddress.name || "there"}!`,
        order,
        `<p>Good news — your order has shipped.</p>`
      ),
    })
  } catch (error) {
    console.error("Failed to send shipping notification email:", error)
  }
}
