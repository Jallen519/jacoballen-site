interface Env {
  // No bindings needed — uses MailChannels free integration
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const formData = await context.request.formData();
    const email = formData.get('email')?.toString().trim();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required.' }),
        { status: 400, headers }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers }
      );
    }

    // Notify you of new subscriber via MailChannels
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
          name: 'jacoballen.co',
        },
        subject: `New Subscriber: ${email}`,
        content: [
          {
            type: 'text/plain',
            value: `New newsletter subscriber:\n\n${email}\n\nSubscribed at: ${new Date().toISOString()}`,
          },
        ],
      }),
    });

    if (!mailResponse.ok && mailResponse.status !== 202) {
      console.error(`MailChannels error: ${mailResponse.status} ${await mailResponse.text()}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers }
    );
  }
};
