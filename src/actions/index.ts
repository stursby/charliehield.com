import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const server = {
  sendContactForm: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
      message: z.string().min(10, 'Message must be at least 10 characters')
    }),
    handler: async ({ name, email, message }) => {
      try {
        console.log('📧 Attempting to send email...')
        console.log('From:', import.meta.env.SENDER_EMAIL)
        console.log('To:', import.meta.env.RECIPIENT_EMAIL)

        const { data, error } = await resend.emails.send({
          from: import.meta.env.SENDER_EMAIL,
          to: import.meta.env.RECIPIENT_EMAIL,
          replyTo: email,
          subject: `Contact Form: ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        })

        if (error) {
          console.error('❌ Resend API error:', error)
          throw new Error(error.message)
        }

        console.log('✅ Email sent successfully:', data)
        return { success: true, data }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('❌ Failed to send email:', errorMessage)
        throw new Error(`Failed to send email: ${errorMessage}`)
      }
    }
  })
}
