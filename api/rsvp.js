// Relays an RSVP to the Google Form from the server.
//
// The browser only ever talks to this site's own origin, so nothing on the
// guest's device has to reach docs.google.com — which is what was failing on
// mobile. It also means we get a real status code back and can tell the guest
// the truth about whether their reply landed.

const FORM_ID = "1FAIpQLSfuMaCe0OQw4aOE2MTk4_yowqCLRJXGKaIghE_MfUMeN4mCJA";

const FIELDS = {
  attending: "entry.1773114326",
  name:      "entry.1222470394",
  phone:     "entry.1637117082",
  kids:      "entry.2125723721",
  adults:    "entry.1929876314",
  note:      "entry.1326875089",
};

const FORM_ACTION = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

function clean(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (err) { body = null; }
  }
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "bad_request" });
    return;
  }

  const name  = clean(body.name, 200);
  const phone = clean(body.phone, 60);
  if (!name || !phone) {
    res.status(400).json({ error: "missing_fields" });
    return;
  }

  const coming = body.attending === "yes";
  const params = new URLSearchParams();
  params.append(FIELDS.attending, coming ? "Coming" : "Can’t come");
  params.append(FIELDS.name,   name);
  params.append(FIELDS.phone,  phone);
  params.append(FIELDS.kids,   coming ? clean(body.kids, 6)   || "0" : "");
  params.append(FIELDS.adults, coming ? clean(body.adults, 6) || "0" : "");
  params.append(FIELDS.note,   clean(body.note, 2000));

  try {
    const upstream = await fetch(FORM_ACTION, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString(),
    });

    if (!upstream.ok) {
      res.status(502).json({ error: "google_rejected", status: upstream.status });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: "google_unreachable" });
  }
};
