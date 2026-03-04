interface Env {
  // No bindings needed — uses MailChannels free integration
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const formData = await context.request.formData();
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        { status: 400, headers }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers }
      );
    }

    // Send email via MailChannels (free for Cloudflare Workers/Pages)
    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'office@jacoballen.co', name: 'Jacob Allen' }],
          },
        ],
        from: {
          email: 'noreply@jacoballen.co',
          name: `${name} via jacoballen.co`,
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `Contact Form: ${name}`,
        content: [
          {
            type: 'text/plain',
            value: `Name: ${name}\nEmail: ${email}\n\n${message}`,
          },
        ],
      }),
    });

    if (mailResponse.ok || mailResponse.status === 202) {
      return new Response(
        JSON.stringify({ success: true, message: "Message sent. I'll get back to you soon." }),
        { status: 200, headers }
      );
    }

    // If MailChannels fails, log and still return success to not confuse user
    console.error(`MailChannels error: ${mailResponse.status} ${await mailResponse.text()}`);
    return new Response(
      JSON.stringify({ success: true, message: "Message received. I'll get back to you soon." }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers }
    );
  }
};
