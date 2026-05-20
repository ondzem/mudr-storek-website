// Using Deno-compatible nodemailer for email sending with SMTP
import nodemailer from "npm:nodemailer@6.10.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const GMAIL_USER = Deno.env.get('GMAIL_USER');
    const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');
    const BASE_URL = Deno.env.get('BASE_URL') || 'https://mudrstorek.cz';

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error('Missing Gmail credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Email configuration error', 
          details: 'Chybí přihlašovací údaje pro Gmail. Kontaktujte administrátora.',
          configMissing: true 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Parse request body
    const { name, email, appointment_date, appointment_time, reason, cancellation_token } = await req.json();

    if (!email || !cancellation_token) {
      throw new Error('Chybí povinné údaje');
    }

    console.log(`Sending email to ${email} for appointment on ${appointment_date} at ${appointment_time}`);

    // Format date for better readability
    const formattedDate = new Date(appointment_date).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Create email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Warning: Do not reply block -->
    <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 25px; border: 1px solid #ffeeba; font-size: 0.95em; line-height: 1.5;">
      <strong>⚠️ Upozornění:</strong> Na tento e-mail prosím <strong>neodpovídejte</strong>. Je odesílán z automatického systému a schránka není kontrolována. Pro veškerou komunikaci, dotazy nebo změny používejte výhradně e-mail: <strong><a href="mailto:mudr.storek@seznam.cz" style="color: #856404; text-decoration: underline;">mudr.storek@seznam.cz</a></strong>.
    </div>

    <h2 style="color: #0A2463; margin-top: 0;">Potvrzení rezervace u MUDr. Ludvíka Štorka</h2>
    
    <p>Vážený/á ${name},</p>
    
    <p>děkujeme za Vaši rezervaci. Níže naleznete podrobnosti:</p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;">📅 <strong>Datum:</strong> ${formattedDate}</p>
      <p style="margin: 5px 0;">⏰ <strong>Čas:</strong> ${appointment_time}</p>
      <p style="margin: 5px 0;">📋 <strong>Důvod návštěvy:</strong> ${reason}</p>
      <p style="margin: 5px 0;">👤 <strong>Jméno:</strong> ${name}</p>
    </div>

    <p>Pokud budete potřebovat rezervaci zrušit, klikněte na následující odkaz:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${BASE_URL}/zrusit?token=${cancellation_token}"
         style="background-color: #0A2463; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Zrušit rezervaci
      </a>
    </div>
    
    <p style="color: #dc3545; font-size: 0.9em;">
      ⚠️ Neomluvená absence (nejpozději do rána příslušného dne) bude sankcionována poplatkem 300 Kč. Omluva je možná telefonicky nebo e-mailem.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    
    <p style="font-size: 0.9em; color: #666;">
      V případě dotazů nás kontaktujte:<br>
      📧 mudr.storek@seznam.cz<br>
      📞 +420 466 030 435
    </p>
  </div>
</body>
</html>`;

    const textContent = `
⚠️ UPOZORNĚNÍ: NA TENTO E-MAIL NEODPOVÍDEJTE. Je generován automaticky a tato schránka není kontrolována. Pro veškeré dotazy a komunikaci pište výhradně na: mudr.storek@seznam.cz

--------------------------------------------------

Vážený/á ${name},

děkujeme za Vaši rezervaci. Níže naleznete podrobnosti:

- Datum: ${formattedDate}
- Čas: ${appointment_time}
- Důvod návštěvy: ${reason}
- Jméno: ${name}

Pokud budete potřebovat rezervaci zrušit, použijte následující odkaz:
${BASE_URL}/zrusit?token=${cancellation_token}

Zrušení je možné nejpozději 24 hodin před termínem.

V případě dotazů nás kontaktujte na mudr.storek@seznam.cz nebo +420 466 030 435.

S pozdravem,
Ordinace MUDr. Ludvíka Štorka`;

    try {
      // Configure SMTP transporter for Gmail using nodemailer
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      });

      // Send email
      await transporter.sendMail({
        from: `MUDr. Ludvík Štorek <${GMAIL_USER}>`,
        to: email,
        replyTo: "mudr.storek@seznam.cz",
        subject: "Potvrzení rezervace u MUDr. Ludvíka Štorka",
        text: textContent,
        html: htmlContent,
      });

      console.log('Email sent successfully to:', email);

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Check if it's an authentication error
      const errorMsg = emailError.message.toLowerCase();
      if (errorMsg.includes('auth') || errorMsg.includes('login') || errorMsg.includes('password') || errorMsg.includes('credentials')) {
        return new Response(
          JSON.stringify({ 
            error: 'Email authentication error', 
            details: 'Nesprávné přihlašovací údaje pro Gmail. Aktualizujte prosím GMAIL_APP_PASSWORD v .env souboru.',
            authError: true,
            originalError: emailError.message
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
      
      // Other email errors
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: emailError.message,
          originalError: emailError.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});