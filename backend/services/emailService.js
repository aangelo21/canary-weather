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

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'info@canaryweather.xyz',
      to: [email],
      subject: 'Reset Your Password - Canary Weather',
      html: `<strong>Hello!</strong><br><br>You requested a password reset. Click the link below to reset your password:<br><br><a href="${resetLink}">Reset Password</a><br><br>If you did not request this, please ignore this email.`,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending password reset email:', err);
    return { success: false, error: err };
  }
};

export const sendPoiCreatedEmail = async (email, username, poiName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'info@canaryweather.xyz',
      to: [email],
      subject: 'New POI Created - Canary Weather',
      html: `<strong>Hello, ${username}!</strong><br><br>You have successfully created a new Point of Interest: <strong>${poiName}</strong>.<br><br>Thank you for contributing!`,
    });

    if (error) {
      console.error('Error sending POI created email:', error);
      return { success: false, error };
    }

    console.log('POI created email sent:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending POI created email:', err);
    return { success: false, error: err };
  }
};

export const sendPoiUpdatedEmail = async (email, username, poiName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'info@canaryweather.xyz',
      to: [email],
      subject: 'POI Updated - Canary Weather',
      html: `<strong>Hello, ${username}!</strong><br><br>The Point of Interest <strong>${poiName}</strong> has been updated successfully.`,
    });

    if (error) {
      console.error('Error sending POI updated email:', error);
      return { success: false, error };
    }

    console.log('POI updated email sent:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending POI updated email:', err);
    return { success: false, error: err };
  }
};

export const sendPoiDeletedEmail = async (email, username, poiName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'info@canaryweather.xyz',
      to: [email],
      subject: 'POI Deleted - Canary Weather',
      html: `<strong>Hello, ${username}!</strong><br><br>The Point of Interest <strong>${poiName}</strong> has been deleted successfully.`,
    });

    if (error) {
      console.error('Error sending POI deleted email:', error);
      return { success: false, error };
    }

    console.log('POI deleted email sent:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending POI deleted email:', err);
    return { success: false, error: err };
  }
};
