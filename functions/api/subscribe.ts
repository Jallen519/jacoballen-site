interface Env {
  // Add KV namespace binding here when ready:
  // SUBSCRIBERS: KVNamespace;
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

    // Log the subscriber for now — replace with KV, D1, or email provider later
    console.log(`New subscriber: ${email} at ${new Date().toISOString()}`);

    // TODO: When you pick an email provider, replace this with:
    // - Beehiiv: POST to https://api.beehiiv.com/v2/publications/{pub_id}/subscriptions
    // - ConvertKit: POST to https://api.convertkit.com/v3/forms/{form_id}/subscribe
    // - Or store in Cloudflare KV: await context.env.SUBSCRIBERS.put(email, JSON.stringify({ date: new Date().toISOString() }));

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers }
    );
  }
};
