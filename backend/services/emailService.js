import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email, username) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'info@canaryweather.xyz',
      to: [email],
      subject: 'Welcome to Canary Weather!',
      html: `<strong>Welcome, ${username}!</strong><br><br>Thank you for creating an account with Canary Weather. We are excited to have you on board.`,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending welcome email:', err);
    return { success: false, error: err };
  }
};

export const sendLoginNotification = async (email, username) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'info@canaryweather.xyz',
      to: [email],
      subject: 'New Login to Canary Weather',
      html: `<strong>Hello, ${username}!</strong><br><br>We detected a new login to your Canary Weather account. If this was you, you can ignore this email.`,
    });

    if (error) {
      console.error('Error sending login notification:', error);
      return { success: false, error };
    }

    console.log('Login notification sent:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending login notification:', err);
    return { success: false, error: err };
  }
};
