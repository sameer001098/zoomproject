const express = require("express");
const axios = require("axios");
const cors = require("cors");
const nodemailer = require('nodemailer');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const apiSecret = process.env.ZOOM_MEETING_CLIENT_SECRET;
const apiKey = process.env.ZOOM_MEETING_CLIENT_ID;
const redirect_uri = "http://localhost:3000/api/callback";

// Zoom OAuth authorization URL
app.get("/api/zoom-auth", (req, res) => {
  const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${apiKey}&redirect_uri=${redirect_uri}`;
  return res.redirect(encodeURI(authorizationUrl));
});

// Zoom OAuth callback URL
app.get("/api/callback", async (req, res) => {
  console.log('Callback query parameters:', req.query);
  const authorizationCode = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirect_uri
        },
        auth: {
          username: apiKey,
          password: apiSecret
        },
      }
    );
    console.log('Token response:', tokenResponse.data);
    const accessToken = tokenResponse.data.access_token;
    process.env.ACCESS_TOKEN = accessToken; // Store the access token in process.env
    res.json({ accessToken });
  } catch (e) {
    console.error("Error getting tokens: ", e.response ? e.response.data : e.message);
    res.status(500).send("Error getting token");
  }
});



// Fetch meetings with password
app.get("/api/meetings", async (req, res) => {
    const accessToken = process.env.ACCESS_TOKEN;
    try {
      const meetingResponse = await axios.get("https://api.zoom.us/v2/users/me/meetings", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      // Include password in the meeting data if available
      const meetingsWithPassword = await Promise.all(meetingResponse.data.meetings.map(async (meeting) => {
        try {
          const meetingDetails = await axios.get(`https://api.zoom.us/v2/meetings/${meeting.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          return {
            ...meeting,
            password: meetingDetails.data.password
          };
        } catch (error) {
          console.error(`Error fetching details for meeting ${meeting.id}:`, error.response ? error.response.data : error.message);
          return meeting;
        }
      }));
  
      res.json({ meetings: meetingsWithPassword });
    } catch (error) {
      console.log("Error fetching meetings:", error.response?.data || error?.message);
      res.status(500).send("Error fetching meetings");
    }
  });


// Create meeting
async function createMeeting(topic, start_time, duration, timezone, agenda, attendees) {
  const accessToken = process.env.ACCESS_TOKEN;
  try {
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic,
      type: 2, // Scheduled meeting
      start_time,
      duration,
      timezone,
      agenda,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        audio: 'both',
        auto_recording: 'none',
        registrants_email_notification: true
      },
      tracking_fields: attendees.map(email => ({ field: 'email', value: email }))
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating meeting:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Create meeting API
app.post('/api/meetings', async (req, res) => {
  const { topic, start_time, duration, timezone = 'UTC', agenda = 'Meeting agenda here', attendees = [] } = req.body;

  try {
    const meeting = await createMeeting(topic, start_time, duration, timezone, agenda, attendees);
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'freelancers401@gmail.com',
    pass: 'xrcwymugyzgrlbcm'
  }
});

// Send invites API
app.post('/send-invites', (req, res) => {
  const { attendees, join_url } = req.body;

  const mailOptions = {
    from: 'freelancers401@gmail.com',
    subject: 'Zoom Meeting Invitation',
    text: `You are invited to a Zoom meeting. Join here: ${join_url}`
  };

  let errors = [];

  attendees.forEach((attendee, index) => {
    mailOptions.to = attendee;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        errors.push({ email: attendee, error: error.message });
        console.log('Error sending email to ' + attendee + ': ' + error.message);
      } else {
        console.log('Email sent to ' + attendee + ': ' + info.response);
      }

      // Send response after all emails are processed
      if (index === attendees.length - 1) {
        if (errors.length > 0) {
          res.status(500).send({ message: 'Some emails failed to send', errors });
        } else {
          res.send('Invitations sent successfully!');
        }
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const port = process.env.PORT || 3000;
// const apiSecret = process.env.ZOOM_MEETING_CLIENT_SECRET;
// const apiKey = process.env.ZOOM_MEETING_CLIENT_ID;
// const redirect_uri = "http://localhost:3000/api/callback";

// app.get("/api/zoom-auth", (req, res)=>{
//     const authorizationUrl = 'https://zoom.us/oauth/authorize?response_type=code&client_id=URMcC59tSxCFRhEwocOQIw&redirect_uri=http://localhost:3000/api/callback';
//     return res.redirect(encodeURI(authorizationUrl));
// })



// app.get("/api/callback", async (req, res) => {
//     console.log('Callback query parameters:', req.query);
//     const authorizationCode = req.query.code;

//     try {
//         const tokenResponse = await axios.post(
//             "https://zoom.us/oauth/token",
//             null,
//             {
//                 params: {
//                     grant_type: "authorization_code",
//                     code: authorizationCode,
//                     redirect_uri: redirect_uri
//                 },
//                 auth: {
//                     username: apiKey,
//                     password: apiSecret
//                 },
//             }
//         );
//         console.log('Token response:', tokenResponse.data);
//         const accessToken = tokenResponse.data.access_token;
//         res.json({ accessToken });
//     } catch (e) {
//         console.error("Error getting tokens: ", e.response ? e.response.data : e.message);
//         res.status(500).send("Error getting token");
//     }
// });

// app.get("/api/meetings", async (req, res)=>{
//     const accessToken = process.env.ACCESS_TOKEN;
//     try{
//         const meetingResponse = await axios.get("https://api.zoom.us/v2/users/me/meetings", {
//             headers : {
//                 Authorization : `Bearer ${accessToken}`
//             }
//         });
//         console.log('meetingResponse: ', meetingResponse)
//         res.json(meetingResponse.data);
//     } catch(error){
//         console.log("Error fetching meetings :", error.response?.data || error?.meessage);
//         res.status(500).send("Error fertching meetings")
//     }
// })


// app.get("/api/create-meetings", async (req, res)=>{
//     const accessToken = process.env.ACCESS_TOKEN;
//     const meetingData = req.body;

//     if(!accessToken){
//         throw('Unauthorized Token');
//     }
//     try{
//         const meetingResponse = await axios.post("https://api.zoom.us/v2/users/me/meetings",
//             {
//                 meetingData
//             },
//             {
//             headers : {
//                 Authorization : `Bearer ${accessToken}`
//             }
//         });
//         console.log('Create meetingResponse: ', meetingResponse)
//         res.json(meetingResponse.data);
//     } catch(error){
//         console.log("Error fetching meetings :", error.response?.data || error?.meessage);
//         res.status(500).send("Error creating meetings")
//     }
// })


// app.listen(port, ()=>{
//     console.log(`Server is running on port ${port}`);
// })