import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [disable, setDisable] = useState(false);

  const sendMessage = async (e, eventMessage) => {
    e.preventDefault();
    setLoading(true);
    setRequest(true);
    setError(false);
    setSuccess(false);
    setEvent(eventMessage);

    const res = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, eventMessage }),
    });

    const apiResponse = await res.json();

    if (apiResponse.success) {
      setSuccess(true);
      setMessage(JSON.parse(JSON.stringify(apiResponse.message)));
      console.log(message);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white py-4 grid grid-cols-2 md:grid-rows-3 gap-2 h-screen overflow-scroll">
      <Head>
        <title>Next.js + Twilio</title>
      </Head>

      {/* Form Section Starts*/}
      <div className="bg-white grid place-items-center col-span-2 lg:col-span-1 lg:row-span-1 my-4">
        <div className="w-full grid place-items-center h-full">
          {/* Form Component Starts */}
          <div className="bg-white w-3/4 mt-8 flex justify-center items-center text-center shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 w-3/4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter your Phone Number
              </h3>
              <form
                className="mt-5 sm:flex sm:items-center"
                onSubmit={sendMessage}
              >
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    name="phone"
                    id="phone"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="+1XXXXXXXXXXX"
                    required
                  />
                </div>
                <button
                  disabled={disable ? disable : loading}
                  type="submit"
                  className="mt-3 inline-flex w-3/6 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit
                </button>
              </form>
              {success && <p className="">Message sent successfully.</p>}
              {error && (
                <p className="">
                  Something went wrong. Please check the number.
                </p>
              )}
            </div>
          </div>
          {/* Form Component Ends */}
        </div>
        {success && (
          <>
            <button
              disabled={disable ? disable : loading}
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={(e) => {
                const eventMessage =
                  "A click event has occured in the application";
                sendMessage(e, eventMessage);
                setDisable(true);
              }}
            >
              Click here
            </button>
          </>
        )}
      </div>
      {/* Form Section Ends */}

      {/* Code Section Starts*/}
      <div className="col-span-2 lg:col-span-1 lg:row-span-2 mx-4">
        {/* Code Block Starts */}
        <pre className="p-4 bg-gray-800 h-full text-white rounded-lg language-javascript whitespace-pre overflow-x-scroll">
          <code className="whitespace-pre overflow-x-scroll">
            {`
function sendMessage(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const client = twilio(accountSid, authToken);

  const { phoneNumber } = req.body; // Form Value - ${phone} stored in the state

  // Twilio Message API resource is used to send the message
  // Message body will change based on the event
  client.messages
    .create({
      body: ${
        event ||
        'Thanks for submitting the form. Now try pressing the "Click Here" button on the website'
      },
      from: twilioPhoneNumber,
      to: phoneNumber,
    })
    .then((message) => {
      console.log(message);
      res.json({
        success: true,
      });
     }
    )
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
}
              `}
          </code>
        </pre>
        {/* Code Block Ends */}
      </div>
      {/* Code Section Ends*/}

      {/* Response Section Starts*/}
      <div className="bg-white row-start-2 col-span-2 lg:col-span-1 md:row-span-3 mx-4 mb-4">
        <pre className="bg-gray-300 border h-full rounded-lg p-6 pre overflow-auto">
          {`Response: ${"\n\n"}`}
          {success && (
            <code className="h-full">{JSON.stringify(message, null, 2)}</code>
          )}
        </pre>
      </div>
      {/* Response Section Ends*/}

      {/* Request Section Starts*/}
      <div className="bg-white row-start-4 md:row-start-3 col-span-2 lg:col-start-2 lg:col-span-2 mx-4">
        <pre className="bg-gray-300 border rounded-lg h-full p-6 pre">
          {`Request: ${"\n\n"}`}
          {request &&
            (event ? (
              <code className="">{`
POST /api/sendMessage

{"phone": "${phone}", "event": "${event}"}
          `}</code>
            ) : (
              <code className="">{`
POST /api/sendMessage

{"phone": "${phone}"}
          `}</code>
            ))}
        </pre>
      </div>
      {/* Request Section Ends*/}
    </div>
  );
}
