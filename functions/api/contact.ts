interface Env {
  // Add bindings here if needed (e.g., KV namespace, D1 database)
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

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers }
      );
    }

    // TODO: Forward to email service (Resend, SendGrid, etc.)
    // For now, log and return success
    console.log(`Contact form: ${name} <${email}> — ${message.slice(0, 100)}`);

    return new Response(
      JSON.stringify({ success: true, message: "Message received. I'll get back to you soon." }),
      { status: 200, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers }
    );
  }
};
